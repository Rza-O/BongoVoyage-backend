/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse } from "../interfaces/errors.interface";

export const handleDuplicateError = (err: any): IErrorResponse => {
	const matchedArray = err.message.match(/"([^"]*)"/);
	return {
		statusCode: 400,
		message: `${matchedArray[1]} already exist`,
	};
};
