export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export const safeUserWithFarmSelect = {
  ...safeUserSelect,
  farms: {
    select: {
      id: true,
      name: true,
      farmType: true,
      isActive: true,
    },
  },
} as const;
