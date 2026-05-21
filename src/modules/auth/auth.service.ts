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

class AuthService {
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

  public async updateUserPassword(
    id: string,
    userData: updatePasswordDto,
  ): Promise<string | null> {
    const { currentPassword, newPassword } = userData;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) return null;

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

    if (!user) return null;

    return user;
  }

  private signToken(id: string): string {
    return jwt.sign({ id }, env.JWT_SECRET);
  }
}

export const authService = new AuthService();
