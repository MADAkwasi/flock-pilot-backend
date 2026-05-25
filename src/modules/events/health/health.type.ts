import type {
  healthDetailSelect,
  healthListSelect,
} from "../../../constants/health.constant.js";
import type { HealthRecordGetPayload } from "../../../generated/prisma/models.js";

export type HealthWithListSelect = HealthRecordGetPayload<{
  select: typeof healthListSelect;
}>;

export type HealthWithDetailSelect = HealthRecordGetPayload<{
  select: typeof healthDetailSelect;
}>;
