import jwt from "jsonwebtoken";
import type {
  LoginDto,
  RegisterDto,
  updatePasswordDto,
} from "./auth.schema.js";
import bcrypt from "bcrypt";
import { prisma } from "../../db/prisma.js";
import { env } from "../../config/env.js";
import type { SafeUserWithFarms } from "../../types/user.type.js";
import { safeUserWithFarmSelect } from "../../constants/user.constant.js";
import type { User } from "../../generated/prisma/client.js";
import AppError from "../../utils/appError.js";

class AuthService {
  public async registerUser(
    userData: RegisterDto,
  ): Promise<{ token: string; user: User }> {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = this.signToken(user.id);

    return { token, user };
  }

  public async loginUser(
    userData: LoginDto,
  ): Promise<{ token: string; user: User }> {
    const { email, password } = userData;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new AppError("Invalid Credentials", 401);

    const token = this.signToken(user.id);

    return { token, user };
  }

  public async updateUserPassword(
    id: string,
    userData: updatePasswordDto,
  ): Promise<string> {
    const { currentPassword, newPassword } = userData;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new AppError("User not found", 404);

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) throw new AppError("Incorrect password", 400);

    const hashPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashPassword,
      },
    });

    return this.signToken(user.id);
  }

  public async getUser(id: string): Promise<SafeUserWithFarms | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: safeUserWithFarmSelect,
    });

    if (!user) throw new AppError("User not found", 404);

    return user;
  }

  private signToken(id: string): string {
    return jwt.sign({ id }, env.JWT_SECRET);
  }
}

export const authService = new AuthService();
