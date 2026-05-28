import type { EggProductionGetPayload } from "../../../generated/prisma/models.js";
import {
  eggProductionDetailSelect,
  eggProductionListSelect,
} from "../../../constants/eggs.constant.js";

export type EggProductionWithListSelect = EggProductionGetPayload<{
  select: typeof eggProductionListSelect;
}>;

export type EggProductionWithDetailSelect = EggProductionGetPayload<{
  select: typeof eggProductionDetailSelect;
}>;
