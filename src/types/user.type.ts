import type { safeUserSelect } from "../constants/user.constant.js";
import type { Prisma } from "../generated/prisma/client.js";

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;
