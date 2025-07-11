import { Types } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password?: string;
	phone?: string;
	pictures?: string;
	address?: string;
	isDeleted?: boolean;
	isActive?: IsActive;
	isVerified?: boolean;
	role: Role;
	auths: IAuthProvider[];
	bookings?: Types.ObjectId[];
	guides?: Types.ObjectId[];
}

// auth providers
/**
 * email, password
 * google auth
 */
export interface IAuthProvider {
	provider: string; //google, facebook, etc.
	providerId: string;
}

export enum IsActive {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	BLOCKED = "BLOCKED",
}

export enum Role {
	SUPER_ADMIN = "SUPER_ADMIN",
	ADMIN = "ADMIN",
	USER = "USER",
	GUIDE = "GUIDE",
}
