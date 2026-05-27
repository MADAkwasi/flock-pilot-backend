export const feedLogListSelect = {
  id: true,
  quantityKg: true,
  inventoryItemId: true,
  notes: true,
  recordedAt: true,
} as const;

export const feedLogDetailSelect = {
  ...feedLogListSelect,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
    },
  },
} as const;
