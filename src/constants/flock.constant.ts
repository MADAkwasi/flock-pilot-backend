import { feedLogListSelect } from "./feed-log.constant.js";
import { healthListSelect } from "./health.constant.js";
import { mortalityListSelect } from "./mortality.constant.js";

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
    select: {
      id: true,
      count: true,
      broken: true,
      recordedAt: true,
    },
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
    select: {
      id: true,
      type: true,
      category: true,
      amount: true,
      description: true,
      occurredAt: true,
    },
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
    select: {
      id: true,
      type: true,
      totalAmount: true,
      customerName: true,
    },
  },
} as const;
