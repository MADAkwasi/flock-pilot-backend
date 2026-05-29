export const inventoryTransactionsListSelect = {
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
  createdAt: true,
} as const;

export const inventoryTransactionDetailSelect = {
  ...inventoryTransactionsListSelect,
  source: true,
  referenceId: true,
  notes: true,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
    },
  },
  farm: {
    select: {
      id: true,
      name: true,
      isActive: true,
      farmType: true,
    },
  },
} as const;
