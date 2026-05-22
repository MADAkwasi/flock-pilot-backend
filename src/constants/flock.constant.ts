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
    select: {
      id: true,
      count: true,
      cause: true,
      recordedAt: true,
    },
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
    select: {
      id: true,
      diagnosis: true,
      severity: true,
      treatment: true,
      medication: true,
      vetNotes: true,
      recordedAt: true,
    },
  },
  feed: {
    select: {
      id: true,
      feedType: true,
      quantityKg: true,
      notes: true,
      recordedAt: true,
    },
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
} as const;
