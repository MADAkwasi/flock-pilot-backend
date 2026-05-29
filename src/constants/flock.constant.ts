import { eggProductionListSelect } from "./eggs.constant.js";
import { expensesListSelect } from "./expenses.constant.js";
import { feedLogListSelect } from "./feed-log.constant.js";
import { healthListSelect } from "./health.constant.js";
import { mortalityListSelect } from "./mortality.constant.js";
import { salesListSelect } from "./sales.constant..js";

export const flockListSelect = {
  id: true,
  name: true,
  breed: true,
  flockType: true,
  currentCount: true,
  source: true,
  status: true,
  startDate: true,
} as const;

export const flockStatusSelect = {
  status: true,
  updatedAt: true,
} as const;

export const flockDetailSelect = {
  ...flockListSelect,
  initialCount: true,
  farm: {
    select: {
      id: true,
      name: true,
      location: true,
    },
  },
  mortality: {
    select: mortalityListSelect,
  },
  eggs: {
    select: eggProductionListSelect,
  },
  health: {
    select: healthListSelect,
  },
  feed: {
    select: feedLogListSelect,
  },
  notes: {
    select: {
      id: true,
      content: true,
      recordedAt: true,
    },
  },
  expenses: {
    select: expensesListSelect,
  },
  inventoryTransactions: {
    select: {
      id: true,
      inventoryItem: {
        select: {
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
    select: salesListSelect,
  },
} as const;
