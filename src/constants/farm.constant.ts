import { flockListSelect } from "./flock.constant.js";

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
  ...farmListSelect,
  ownerId: true,
  description: true,
  flocks: {
    select: flockListSelect,
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
};
