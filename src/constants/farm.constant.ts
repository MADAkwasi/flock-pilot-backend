export const farmActiveSelect = {
  isActive: true,
  updatedAt: true,
};

export const farmListSelect = {
  id: true,
  name: true,
  isActive: true,
  farmType: true,
  createdAt: true,
} as const;

export const farmDetailSelect = {
  ownerId: true,
  description: true,
  ...farmListSelect,
  flocks: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
      currentCount: true,
      status: true,
      createdAt: true,
      startDate: true,
    },
  },
};
