import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
	(...authRoles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = req.headers.authorization;

			if (!accessToken) {
				throw new AppError(httpStatus.BAD_REQUEST, "No Token Received");
			}

			const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
			//  authRoles = ["ADMIN", "SUPERADMIN"]
			if (!authRoles.includes(verifiedToken.role)) {
				throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to access this route");
			}
			// custom express request type
			req.user = verifiedToken;

			next();
		} catch (error) {
			next(error);
		}
	};
