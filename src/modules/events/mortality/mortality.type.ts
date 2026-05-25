import type {
  mortalityDetailSelect,
  mortalityListSelect,
} from "../../../constants/mortality.constant.js";
import type { MortalityRecordGetPayload } from "../../../generated/prisma/models.js";

export type MortalityWithListSelect = MortalityRecordGetPayload<{
  select: typeof mortalityListSelect;
}>;

export type MortalityWithDetailSelect = MortalityRecordGetPayload<{
  select: typeof mortalityDetailSelect;
}>;
