import "dotenv/config";
import express, { type Express } from "express";
import { env } from "./config/env.js";

const app: Express = express();

app.use(express.json());

const { PORT } = env;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
