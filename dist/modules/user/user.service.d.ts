import { type User } from "@prisma/client";
import type { RegisterDto } from "./user.schema.js";
export declare class UserService {
    createUser(userData: RegisterDto): Promise<User>;
}
//# sourceMappingURL=user.service.d.ts.map