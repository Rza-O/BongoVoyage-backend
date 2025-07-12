import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
	name: z
		.string({ invalid_type_error: "Name Must be string" })
		.min(2, { message: "Name at least has to be 2 characters long" })
		.max(50, { message: "Name cannot exceed 50 characters long" }),

	email: z
		.string({ invalid_type_error: "Email must be string" })
		.email({ message: "Invalid Email Format" })
		.min(5, { message: "Email must be 5 characters long" })
		.max(100, { message: "Email must not exceed 100 characters" }),

	// one upper, one special and one digit, 8 char min
	password: z
		.string()
		.min(8)
		.regex(/(?=.*[A-Z])/, {
			message: "Password Must contain at least 1 uppercase letter",
		})
		.regex(/^(?=.*[!@#$%^&*])/, {
			message: "Password Must contain at least 1 special letter",
		})
		.regex(/^(?=.*\d)/, {
			message: "Password Must contain at least 1 number",
		}),

	phone: z
		.string({ invalid_type_error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{3}| 01\d{9})$/, {
			message: "Phone Number must be valid for bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		})
		.optional(),

	address: z.string({ invalid_type_error: "Address must be string" }).max(200, { message: "Address cannot exceed 200 characters" }).optional(),
});

export const updateUserZodSchema = z.object({
	name: z
		.string({ invalid_type_error: "Name Must be string" })
		.min(2, { message: "Name at least has to be 2 characters long" })
		.max(50, { message: "Name cannot exceed 50 characters long" })
		.optional(),

	// one upper, one special and one digit, 8 char min
	password: z
		.string()
		.min(8)
		.regex(/(?=.*[A-Z])/, {
			message: "Password Must contain at least 1 uppercase letter",
		})
		.regex(/^(?=.*[!@#$%^&*])/, {
			message: "Password Must contain at least 1 special letter",
		})
		.regex(/^(?=.*\d)/, {
			message: "Password Must contain at least 1 number",
		})
		.optional(),

	phone: z
		.string({ invalid_type_error: "Phone Number must be string" })
		.regex(/^(?:\+8801\d{3}| 01\d{9})$/, {
			message: "Phone Number must be valid for bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
		})
		.optional(),

	address: z.string({ invalid_type_error: "Address must be string" }).max(200, { message: "Address cannot exceed 200 characters" }).optional(),

	role: z.enum(Object.values(Role) as [string]).optional(),

	isActive: z.enum(Object.values(IsActive) as [string]),

   isDeleted: z.boolean({ invalid_type_error: "isDeleted has to be a boolean value" }).optional(),
   
	isVerified: z.boolean({ invalid_type_error: "isVerified has to be a boolean value" }).optional(),
});
