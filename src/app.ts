import express, { type Request, type Response } from "express";
import morgan from "morgan";


const app = express();
app.use(morgan("dev"));


app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ message: "Welcome to BongoVoyage!" });
});

export default app;
