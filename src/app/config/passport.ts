/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email: string, password: string, done) => {
			try {
				// finding User
				const isUserExist = await User.findOne({ email });

				// way 1
				// if (!isUserExist) {
				// 	return done(null, false, { message: "User Doesn't Exist!" });
				// }

				// way 2
				if (!isUserExist) {
					return done("User Doesn't Exist!");
				}

				// check if the user logged in using google
				const isGoogleAuthenticated = isUserExist.auths.some((providersObject) => providersObject.provider === "google");
				if (isGoogleAuthenticated && isUserExist.password) {
					// way 1
					return done(null, false, {
						message: "You have authenticated using goggle and if you want to login using password then login via google and then set password",
					});
					// way 2
					// return done("You have authenticated using goggle and if you want to login using password then login via google and then set password");
				}

				// matching password
				const isPasswordValid = await bcryptjs.compare(password as string, isUserExist.password as string);

				if (!isPasswordValid) {
					return done(null, false, { message: "Password Doesn't Match!" });
				}
				// if matched then return user
				return done(null, isUserExist);
			} catch (error) {
				console.log(error);
				done(error);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: envVars.GOOGLE_CLIENT_ID,
			clientSecret: envVars.GOOGLE_CLIENT_SECRET,
			callbackURL: envVars.GOOGLE_CALLBACK_URL,
		},
		async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
			try {
				const email = profile.emails?.[0].value;
				if (!email) {
					return done(null, false, { message: "No Email Found!" });
				}

				let user = await User.findOne({ email });

				if (!user) {
					user = await User.create({
						email,
						name: profile.displayName,
						pictures: profile.photos?.[0].value,
						role: Role.USER,
						auths: [
							{
								provider: "google",
								providerId: profile.id,
							},
						],
					});
				}
				return done(null, user);
			} catch (error) {
				console.log("Google strategy error", error);
				return done(error);
			}
		}
	)
);

/**
 * frontend URL -> http://localhost:3000/api/v1/auth/google -> passport -> Google OAuth Screen -> gmail login-> successful -> http://localhost:3000/api/v1/auth/google/callback -> DB Store -> token
 *
 *
 * we have to create a bridge
 * bridge = Google -> user DB Store -> token
 * google req -> google -> successful : JWT Token : Role: Email -> DB store -> token -> api access
 */

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
	done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		console.log(error);
		done(error);
	}
});
