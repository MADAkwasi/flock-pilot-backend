export const healthListSelect = {
  id: true,
  diagnosis: true,
  severity: true,
  treatment: true,
  medication: true,
  affectedCount: true,
  vetNotes: true,
  recordedAt: true,
} as const;

export const healthDetailSelect = {
  ...healthListSelect,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
    },
  },
} as const;
