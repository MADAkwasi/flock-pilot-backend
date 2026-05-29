import { expensesListSelect } from "./expenses.constant.js";
import { flockListSelect } from "./flock.constant.js";

export const farmActiveSelect = {
  isActive: true,
  updatedAt: true,
} as const;

export const farmListSelect = {
  id: true,
  name: true,
  isActive: true,
  farmType: true,
  location: true,
  createdAt: true,
} as const;

export const farmDetailSelect = {
  ...farmListSelect,
  ownerId: true,
  description: true,
  flocks: {
    select: flockListSelect,
  },
  expenses: {
    select: expensesListSelect,
  },
  inventoryItems: {
    select: {
      id: true,
      name: true,
      category: true,
      unit: true,
    },
  },
  inventoryTransactions: {
    select: {
      id: true,
      inventoryItem: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      type: true,
      quantity: true,
      unitCost: true,
    },
  },
  sales: {
    select: {
      id: true,
      type: true,
      totalAmount: true,
      customerName: true,
    },
  },
} as const;
