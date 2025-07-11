/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const user = await UserServices.createUser(req.body);
// 		res.status(httpStatus.CREATED).json({ message: "User Created Successfully!!", user });
// 	} catch (error: any) {
// 		console.log(error);
// 		next(error);
// 	}
// };

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = await UserServices.createUser(req.body);
	res.status(httpStatus.CREATED).json({ message: "User Created Successfully!!", user });
});

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await UserServices.getAllUser();
	// res.status(httpStatus.OK).json({
	// 	success: true,
	// 	message: "All User retrieved successfully!",
	// 	data: users,
	// });

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All User retrieved Successfully!!",
		data: result?.data,
		meta: result.meta,
	});
});

export const UserControllers = {
	createUser,
	getAllUser,
};

// Things that are happening in details
/**
 * Route Matching(app.ts->index.ts->user.route)-> Controller -> Service -> Model -> Database
 *
 * good practice  Model -> Service ->Controller -> Route Matching(index.ts->user.route)
 */
