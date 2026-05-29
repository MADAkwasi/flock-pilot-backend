import { expensesListSelect } from "./expenses.constant.js";
import { feedLogListSelect } from "./feed-log.constant.js";

export const inventoryItemListSelect = {
  id: true,
  name: true,
  category: true,
  unit: true,
  costPerUnit: true,
  createdAt: true,
} as const;

export const inventoryItemDetailSelect = {
  ...inventoryItemListSelect,
  reorderLevel: true,
  feedLog: {
    select: feedLogListSelect,
  },
  expense: {
    select: expensesListSelect,
  },
  transactions: {
    select: {
      type: true,
      quantity: true,
      note: true,
    },
  },
};
