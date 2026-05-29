export const eggProductionListSelect = {
  id: true,
  count: true,
  broken: true,
  recordedAt: true,
} as const;

export const eggProductionDetailSelect = {
  ...eggProductionListSelect,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
      currentCount: true,
    },
  },
} as const;
