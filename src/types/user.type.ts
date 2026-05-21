import { safeUserSelect } from "../constants/user.constant.js";
import type { Prisma } from "../generated/prisma/client.js";
import { safeUserWithFarmSelect } from "../constants/user.constant.js";

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

export type SafeUserWithFarms = Prisma.UserGetPayload<{
  select: typeof safeUserWithFarmSelect;
}>;
