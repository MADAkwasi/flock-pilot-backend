export enum PredictionSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface FarmPrediction {
  id: string;
  type: string;
  severity: PredictionSeverity;
  message: string;
  probability: number; // 0 - 1
  horizon: string; // e.g. "3 days", "7 days"
  meta?: any;
}
