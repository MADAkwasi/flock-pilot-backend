import { Router } from "express";
import { UserController } from "./user.controller.js";
const router = Router();
router.route("/").post(UserController.createUser);
export default router;
//# sourceMappingURL=user.route.js.map