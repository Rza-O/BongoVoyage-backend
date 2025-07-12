import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
	const { email, password } = payload;

	const isUserExist = await User.findOne({ email });

	if (!isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exist");
	}

	const isPasswordValid = await bcryptjs.compare(password as string, isUserExist.password as string);

	if (!isPasswordValid) {
		throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
	}

	const jwtPayload = {
		userId: isUserExist.id,
		email: isUserExist.email,
		role: isUserExist.role,
	};

	// const accessToken = jwt.sign(jwtPayload, "secret", {
	// 	expiresIn: "1D",
	// });

	const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

	return {
		accessToken,
	};
};

export const AuthServices = {
	credentialsLogin,
};
