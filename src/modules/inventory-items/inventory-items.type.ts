import type {
  inventoryItemDetailSelect,
  inventoryItemListSelect,
} from "../../constants/inventory-items.constant.js";
import type { InventoryItemGetPayload } from "../../generated/prisma/models.js";

export type InventoryItemWithListSelect = InventoryItemGetPayload<{
  select: typeof inventoryItemListSelect;
}>;

export type InventoryItemWithDetailSelect = InventoryItemGetPayload<{
  select: typeof inventoryItemDetailSelect;
}>;
