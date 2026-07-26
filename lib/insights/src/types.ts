export type InsightsRange = 7 | 28 | 90;

export interface InsightsOrder {
  id: number;
  productName: string | null;
  productSlug: string | null;
  customerEmail: string | null;
  status: string;
  createdAt: string;
}

export interface InsightsDayPoint {
  date: string;
  sessions: number;
}

export interface InsightsResponse {
  rangeDays: InsightsRange;
  startDate: string;
  endDate: string;
  sessions: number;
  bounceRate: number | null;
  stripeSales: number;
  amazonClicks: number;
  dummyBookRequests: number;
  gaPurchaseEvents: number;
  sessionsByDay: InsightsDayPoint[];
  recentOrders: InsightsOrder[];
  gaConfigured: boolean;
  warnings: string[];
}
