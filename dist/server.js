import "dotenv/config";
import userRouter from "./modules/user/user.route.js";
import express, {} from "express";
import { env } from "./config/env.js";
const app = express();
app.use(express.json());
const { PORT } = env;
app.use("/api/v1/user", userRouter);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
export default app;
//# sourceMappingURL=server.js.map