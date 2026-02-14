export const dashboardStats = {
  totalCalls: 0,
  revenue: 0,
  activeEndpoints: 0,
  recentPayments: 0,
};

export const revenueChartData: Array<{ month: string; revenue: number; calls: number }> = [];

export const userAPIs: Array<{
  id: string;
  name: string;
  status: "active" | "inactive";
  revenue: number;
  totalCalls: number;
  endpoints: Array<{
    id: string;
    name: string;
    path: string;
    price: number;
    calls: number;
    revenue: number;
  }>;
}> = [];

export const callHistory: Array<{
  id: string;
  timestamp: string;
  endpoint: string;
  status: number;
  latency: number;
  caller: string;
}> = [];

export const transactions: Array<{
  id: string;
  date: string;
  from: string;
  amount: number;
  api: string;
  txHash: string;
}> = [];

export const earningsChartData: Array<{ week: string; earnings: number }> = [];

export const usageChartData: Array<{ day: string; calls: number }> = [];

export const topAPIs: Array<{
  name: string;
  calls: string;
  revenue: string;
  icon: string;
}> = [];
