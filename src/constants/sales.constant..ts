export const salesListSelect = {
  id: true,
  type: true,
  quantity: true,
  totalAmount: true,
  customerName: true,
  createdAt: true,
} as const;

export const salesDetailSelect = {
  ...salesListSelect,
  unitPrice: true,
  notes: true,
  flock: {
    select: {
      id: true,
      name: true,
      breed: true,
      flockType: true,
    },
  },
} as const;
