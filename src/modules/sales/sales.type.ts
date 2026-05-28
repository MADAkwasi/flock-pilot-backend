import type {
  salesDetailSelect,
  salesListSelect,
} from "../../constants/sales.constant..js";
import type { SaleGetPayload } from "../../generated/prisma/models.js";

export type SalesWithListSelect = SaleGetPayload<{
  select: typeof salesListSelect;
}>;

export type SalesWithDetailSelect = SaleGetPayload<{
  select: typeof salesDetailSelect;
}>;
