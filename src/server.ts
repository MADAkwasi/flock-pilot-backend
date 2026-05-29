import "dotenv/config";
import express, {
  type Express,
  type Response,
  type Request,
  type NextFunction,
} from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.route.js";
import farmRouter from "./modules/farm/farm.route.js";
import flockRouter from "./modules/flock/flock.route.js";
import healthRouter from "./modules/events/health/health.route.js";
import mortalityRouter from "./modules/events/mortality/mortality.route.js";
import feedLogRouter from "./modules/events/feed-log/feed-log.route.js";
import eggRouter from "./modules/events/eggs/eggs.route.js";
import noteRouter from "./modules/events/notes/notes.route.js";
import saleRouter from "./modules/sales/sales.route.js";
import expensesRouter from "./modules/expenses/expenses.route.js";
import morgan from "morgan";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./utils/errorController.js";
import AppError from "./utils/appError.js";

const app: Express = express();

if (env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

const { PORT } = env;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/farms", farmRouter);
app.use("/api/v1/flocks", flockRouter);
app.use("/api/v1/feed-logs", feedLogRouter);
app.use("/api/v1/health-records", healthRouter);
app.use("/api/v1/mortality-records", mortalityRouter);
app.use("/api/v1/egg-productions", eggRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/sales", saleRouter);
app.use("/api/v1/expenses", expensesRouter);

app.all("/{*splat}", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
