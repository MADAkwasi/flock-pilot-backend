import type {
  inventoryTransactionDetailSelect,
  inventoryTransactionsListSelect,
} from "../../constants/inventory-transactions.constant.js";
import type { InventoryTransactionGetPayload } from "../../generated/prisma/models.js";

export type InventoryTransactionWithListSelect =
  InventoryTransactionGetPayload<{
    select: typeof inventoryTransactionsListSelect;
  }>;

export type InventoryTransactionWithDetailSelect =
  InventoryTransactionGetPayload<{
    select: typeof inventoryTransactionDetailSelect;
  }>;
