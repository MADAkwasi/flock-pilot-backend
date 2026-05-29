export enum InsightSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export interface FarmInsight {
  id: string;
  type: string;
  severity: InsightSeverity;
  message: string;
  meta?: any;
}

export type MortalityTrendPoint = {
  date: string;
  count: number;
};

export type EggTrendPoint = {
  date: string;
  eggs: number;
};

export type InventoryStats = {
  lowStockCount: number;
  totalItems: number;
};

export type ExpenseStats = {
  thisMonth: number;
  lastMonth: number;
};
