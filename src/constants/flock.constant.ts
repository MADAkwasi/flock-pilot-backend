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
  notes: true,
  farm: {
    select: {
      name: true,
      location: true,
    },
  },
  mortality: {
    select: {
      count: true,
      cause: true,
      recordedAt: true,
    },
  },
  eggs: {
    select: {
      count: true,
      broken: true,
      recordedAt: true,
    },
  },
  health: {
    select: {
      condition: true,
      severity: true,
      treatment: true,
      medication: true,
      vetNotes: true,
      recordedAt: true,
    },
  },
  feed: {
    select: {
      feedType: true,
      quantityKg: true,
      cost: true,
      notes: true,
      fedAt: true,
    },
  },
} as const;
