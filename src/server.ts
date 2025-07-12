/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
	try {
		await mongoose.connect(envVars.DB_URL);
		console.log("🥭DB has been connected✅");
		server = app.listen(envVars.PORT, () => {
			console.log(`🔥Server is up and read at ${envVars.PORT}🔥`);
		});
	} catch (error) {
		console.log(error);
	}
};

(async () => {
	await startServer();
	await seedSuperAdmin();
})();

startServer();
seedSuperAdmin();

// * Graceful Server error handling

// 1. Unhandled rejection error
process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection detected... Server shutting down..", err);
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}
	process.exit(1);
});
// Promise.reject(new Error('I forgot to catch this promises'))

// 2. Uncaught exception detected
process.on("uncaughtException", (err) => {
	console.log("Unhandled exception detected... Server shutting down..", err);
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}
	process.exit(1);
});

// throw new Error("i forgot to handle this local error");

// 3. Signal termination error
process.on("SIGTERM", () => {
	console.log("SIGTERM Signal detected... Server shutting down..");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}
	process.exit(1);
});

// 4. Signal termination error (manual)
process.on("SIGINT", () => {
	console.log("SIGINT Signal detected... Server shutting down..");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}
	process.exit(1);
});
