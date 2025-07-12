import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const isUserExist = await User.findOne({ email });

	if (isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
	}

	const hashPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

	const authProviders: IAuthProvider = { provider: "credentials", providerId: email as string };

	const user = await User.create({
		email,
		auths: [authProviders],
		password: hashPassword,
		...rest,
	});
	return user;
};

const getAllUser = async () => {
	const users = await User.find({});
	const totalUsers = await User.countDocuments();
	return {
		data: users,
		meta: {
			total: totalUsers,
		},
	};
};

const updatedUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
	const ifUserExist = await User.findById(userId);
	if (!ifUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found!");
	}

	// if (ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED) {
	// 	throw new AppError(httpStatus.FORBIDDEN, "User has been blocked or deleted!");
	// }

	/**
	 * email cannot update
	 * name, phone, password, address
	 * only admin superadmin - role, isDeleted
	 * promoting to superadmin - only super admin can do
	 */

	if (payload.role) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}

		if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}

		if (payload.isActive || payload.isDeleted || payload.isVerified) {
			if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
				throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
			}
		}
	}

	if (payload.password) {
		payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND);
	}

	const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
	return newUpdatedUser;
};

export const UserServices = {
	createUser,
	getAllUser,
	updatedUser,
};
