/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import mongoose from "mongoose";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSources } from "../interfaces/errors.interface";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	if (envVars.NODE_ENV === "development") {
		console.log(err);
	}
	let statusCode = 500;
	let message = "Something went wrong!!";

	let errorsSources: IErrorSources[] = []; 

	// ! Mongoose errors
	// duplicate error
	if (err.code === 11000) {
		const simplifiedError = handleDuplicateError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	}
	// cast error(ObjectId error)
	else if (err.name === "CastError") {
		const simplifiedError = handleCastError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	}
	// Type validation error
	else if (err.name === "ValidationError") {
		const simplifiedError = handleValidationError(err);
		statusCode = simplifiedError.statusCode;
		errorsSources = simplifiedError.errorSources as IErrorSources[];
		message = simplifiedError.message;
	}

	// ! Zod Errors
	else if (err.name === "ZodError") {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError.statusCode;
		errorsSources = simplifiedError.errorSources as IErrorSources[];
		message = simplifiedError.message;
	} else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof Error) {
		statusCode = 500;
		message = err.message;
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorsSources,
		err: envVars.NODE_ENV === "development" ? err : null,
		stack: envVars.NODE_ENV === "development" ? err.stack : null,
	});
};

/**
 * some unhandled error:
 * mongoose
 * zod
 *
 * -- Mongoose errors--
 * - Duplicate error
 * - cast error(ObjectId error)
 * - Validation error
 *
 * -- Zod errors --
 * -
 */
