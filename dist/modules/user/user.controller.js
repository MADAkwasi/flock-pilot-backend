import { UserService } from "./user.service.js";
const userService = new UserService();
export class UserController {
    static async createUser(req, res) {
        const { name, password, email } = req.body;
        const newUser = await userService.createUser({ name, password, email });
        res.status(200).json({
            status: "success",
            data: {
                user: newUser,
            },
        });
    }
}
//# sourceMappingURL=user.controller.js.map