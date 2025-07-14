import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import { notFound } from "./app/middlewares/not-found";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

// Middlewares
const app = express();

app.use(
	expressSession({
		secret: "Your-secret",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

// router to handle routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ message: "Welcome to BongoVoyage!" });
});

// Global error handler
app.use(globalErrorHandler);

// Not-Found
app.use(notFound);

export default app;
