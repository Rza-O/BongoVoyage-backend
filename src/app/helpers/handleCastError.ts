/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/errors.interface";

export const handleCastError = (err: mongoose.Error.CastError): IErrorResponse => {
	return {
		statusCode: 400,
		message: `Invalid MongoDB ObjectID`,
	};
};
