import "dotenv/config";
import authRouter from "./modules/auth/auth.route.js";
import express, {
  type Express,
  type Response,
  type Request,
  type NextFunction,
} from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./utils/errorController.js";
import AppError from "./utils/appError.js";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));

const { PORT } = env;

app.use("/api/v1/auth", authRouter);

app.all("/{*splat}", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
