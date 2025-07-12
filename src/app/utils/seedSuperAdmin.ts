import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
		if (isSuperAdminExist) {
			console.log("Super Admin Already Exists");
			return;
		}

		console.log("🚀 ~ seedSuperAdmin ~ Trying to create super admin:");

		const hashPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

		const authProvider: IAuthProvider = {
			provider: "credentials",
			providerId: envVars.SUPER_ADMIN_EMAIL,
		};

		const superAdminPayload: IUser = {
			name: "Super Admin",
			email: envVars.SUPER_ADMIN_EMAIL,
			role: Role.SUPER_ADMIN,
			password: hashPassword,
			isVerified: true,
			auths: [authProvider],
		};

		const superAdmin = await User.create(superAdminPayload);
		console.log("🚀 ~ seedSuperAdmin ~ created successfully:", superAdmin);
	} catch (error) {
		console.log(error);
	}
};
