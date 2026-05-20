import jwt from "jsonwebtoken";
import type { LoginDto, RegisterDto } from "./auth.schema.js";
import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { env } from "../../config/env.js";

class UserService {
  public async registerUser(userData: RegisterDto): Promise<string> {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = this.signToken(newUser.id);

    return token;
  }

  public async loginUser(userData: LoginDto): Promise<string | null> {
    const { email, password } = userData;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    const token = this.signToken(user.id);

    return token;
  }

  private signToken(id: string): string {
    return jwt.sign({ id }, env.JWT_SECRET);
  }
}

export const userService = new UserService();
