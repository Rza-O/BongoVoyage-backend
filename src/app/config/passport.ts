/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

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
