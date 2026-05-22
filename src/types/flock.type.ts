import type {
  flockDetailSelect,
  flockListSelect,
  flockStatusSelect,
} from "../constants/flock.constant.js";
import type { Prisma } from "../generated/prisma/client.js";

export type FlockWithListSelect = Prisma.FlockGetPayload<{
  select: typeof flockListSelect;
}>;

export type FlockWithDetailSelect = Prisma.FlockGetPayload<{
  select: typeof flockDetailSelect;
}>;

export type FlockWithStatusSelect = Prisma.FlockGetPayload<{
  select: typeof flockStatusSelect;
}>;
