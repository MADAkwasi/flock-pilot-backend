import type {
  farmActiveSelect,
  farmDetailSelect,
  farmListSelect,
} from "../../constants/farm.constant.js";
import type { Prisma } from "../../generated/prisma/client.js";

export type FarmWithListSelect = Prisma.FarmGetPayload<{
  select: typeof farmListSelect;
}>;

export type FarmWithDetailSelect = Prisma.FarmGetPayload<{
  select: typeof farmDetailSelect;
}>;

export type FarmWithActiveSelect = Prisma.FarmGetPayload<{
  select: typeof farmActiveSelect;
}>;
