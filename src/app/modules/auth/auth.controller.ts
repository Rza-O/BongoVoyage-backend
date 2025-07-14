/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const loginInfo = await AuthServices.credentialsLogin(req.body);

	// res.cookie("accessToken", loginInfo.accessToken, {
	// 	httpOnly: true,
	// 	secure: false,
	// });

	// res.cookie("refreshToken", loginInfo.refreshToken, {
	// 	httpOnly: true,
	// 	secure: false,
	// });

	setAuthCookie(res, loginInfo);

	sendResponse(res, {
		statusCode: httpStatus.ACCEPTED,
		success: true,
		message: "User login Successfully!!",
		data: loginInfo,
	});
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		throw new AppError(httpStatus.BAD_REQUEST, "No Refresh token received from cookies!");
	}

	const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

	// res.cookie("accessToken", tokenInfo.accessToken, {
	// 	httpOnly: true,
	// 	secure: false,
	// });

	setAuthCookie(res, tokenInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New access token generated!!",
		data: tokenInfo,
	});
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		statusCode: httpStatus.ACCEPTED,
		success: true,
		message: "User logged out Successfully!!",
		data: null,
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const decodedToken = req.user;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	console.log(req.body);

	await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

	sendResponse(res, {
		statusCode: httpStatus.ACCEPTED,
		success: true,
		message: "Password has been reset Successfully!!",
		data: null,
	});
});

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	let redirectTO = req.query.state ? (req.query.state as string) : "";

	if (redirectTO.startsWith("/")) {
		redirectTO = redirectTO.slice(1);
	}

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!");
	}
	console.log("🚀 ~ googleCallbackController ~ user:", user);

	const tokenInfo = await createUserTokens(user);

	setAuthCookie(res, tokenInfo);

	res.redirect(`${envVars.FRONTEND_URL}/${redirectTO}`);
});

export const AuthControllers = {
	credentialsLogin,
	getNewAccessToken,
	logout,
	resetPassword,
	googleCallbackController,
};
