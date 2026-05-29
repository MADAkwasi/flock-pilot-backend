export const mortalityListSelect = {
  id: true,
  count: true,
  cause: true,
  recordedAt: true,
} as const;

export const mortalityDetailSelect = {
  ...mortalityListSelect,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
      currentCount: true,
      initialCount: true,
    },
  },
} as const;
