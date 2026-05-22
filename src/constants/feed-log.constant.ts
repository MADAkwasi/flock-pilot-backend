export const feedLogListSelect = {
  id: true,
  feedType: true,
  quantityKg: true,
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
};
