export const expensesListSelect = {
  id: true,
  type: true,
  category: true,
  amount: true,
  description: true,
  createdAt: true,
} as const;

export const expensesDetailSelect = {
  ...expensesListSelect,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
    },
  },
};
