import {} from "@prisma/client";
import { prisma } from "../../db/prisma.js";
export class UserService {
    async createUser(userData) {
        return prisma.user.create({
            data: userData,
        });
    }
}
//# sourceMappingURL=user.service.js.map