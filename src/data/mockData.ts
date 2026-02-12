export const dashboardStats = {
  totalCalls: 1_284_392,
  revenue: 12_847.52,
  activeEndpoints: 24,
  recentPayments: 847.20,
};

export const revenueChartData = [
  { month: "Jul", revenue: 1200, calls: 45000 },
  { month: "Aug", revenue: 1800, calls: 62000 },
  { month: "Sep", revenue: 2400, calls: 78000 },
  { month: "Oct", revenue: 1900, calls: 71000 },
  { month: "Nov", revenue: 3100, calls: 98000 },
  { month: "Dec", revenue: 2800, calls: 89000 },
  { month: "Jan", revenue: 3500, calls: 112000 },
];

export const userAPIs = [
  { id: "1", name: "Weather Pro", endpoint: "https://api.zedkr.com/v1/weather", pricePerCall: 0.002, status: "active" as const, totalCalls: 342100, revenue: 684.20 },
  { id: "2", name: "Sentiment Analysis", endpoint: "https://api.zedkr.com/v1/sentiment", pricePerCall: 0.005, status: "active" as const, totalCalls: 189400, revenue: 947.00 },
  { id: "3", name: "Image Resize", endpoint: "https://api.zedkr.com/v1/resize", pricePerCall: 0.01, status: "active" as const, totalCalls: 98200, revenue: 982.00 },
  { id: "4", name: "Geocoding", endpoint: "https://api.zedkr.com/v1/geocode", pricePerCall: 0.003, status: "inactive" as const, totalCalls: 45600, revenue: 136.80 },
  { id: "5", name: "Text-to-Speech", endpoint: "https://api.zedkr.com/v1/tts", pricePerCall: 0.008, status: "active" as const, totalCalls: 234500, revenue: 1876.00 },
  { id: "6", name: "Currency Exchange", endpoint: "https://api.zedkr.com/v1/exchange", pricePerCall: 0.001, status: "active" as const, totalCalls: 567800, revenue: 567.80 },
];

export const callHistory = [
  { id: "c1", timestamp: "2025-02-12 14:32:01", endpoint: "/v1/weather", status: 200, latency: 45, caller: "SP2J6Z...B48R" },
  { id: "c2", timestamp: "2025-02-12 14:31:58", endpoint: "/v1/sentiment", status: 200, latency: 120, caller: "SP1QR3...X91K" },
  { id: "c3", timestamp: "2025-02-12 14:31:55", endpoint: "/v1/weather", status: 200, latency: 38, caller: "SP3TW8...M22P" },
  { id: "c4", timestamp: "2025-02-12 14:31:50", endpoint: "/v1/resize", status: 429, latency: 12, caller: "SP2J6Z...B48R" },
  { id: "c5", timestamp: "2025-02-12 14:31:48", endpoint: "/v1/tts", status: 200, latency: 230, caller: "SP4KL9...W77D" },
  { id: "c6", timestamp: "2025-02-12 14:31:42", endpoint: "/v1/exchange", status: 200, latency: 22, caller: "SP1QR3...X91K" },
  { id: "c7", timestamp: "2025-02-12 14:31:35", endpoint: "/v1/geocode", status: 500, latency: 890, caller: "SP3TW8...M22P" },
  { id: "c8", timestamp: "2025-02-12 14:31:30", endpoint: "/v1/weather", status: 200, latency: 41, caller: "SP5MN2...J33F" },
];

export const transactions = [
  { id: "t1", date: "2025-02-12", from: "SP2J6Z...B48R", amount: 0.45, api: "Weather Pro", txHash: "0x8f2a...3d1b" },
  { id: "t2", date: "2025-02-11", from: "SP1QR3...X91K", amount: 1.20, api: "Sentiment Analysis", txHash: "0x3c7e...9a4f" },
  { id: "t3", date: "2025-02-11", from: "SP3TW8...M22P", amount: 0.80, api: "Image Resize", txHash: "0x1d5b...7c2e" },
  { id: "t4", date: "2025-02-10", from: "SP4KL9...W77D", amount: 2.10, api: "Text-to-Speech", txHash: "0x6a9f...4b8d" },
  { id: "t5", date: "2025-02-10", from: "SP5MN2...J33F", amount: 0.15, api: "Currency Exchange", txHash: "0x2e4c...8f1a" },
  { id: "t6", date: "2025-02-09", from: "SP2J6Z...B48R", amount: 3.50, api: "Weather Pro", txHash: "0x7b3d...5e9c" },
  { id: "t7", date: "2025-02-09", from: "SP1QR3...X91K", amount: 0.95, api: "Geocoding", txHash: "0x4f1a...2d7b" },
  { id: "t8", date: "2025-02-08", from: "SP3TW8...M22P", amount: 1.75, api: "Text-to-Speech", txHash: "0x9c6e...1a3f" },
];

export const earningsChartData = [
  { week: "W1", earnings: 420 },
  { week: "W2", earnings: 680 },
  { week: "W3", earnings: 520 },
  { week: "W4", earnings: 890 },
  { week: "W5", earnings: 1100 },
  { week: "W6", earnings: 760 },
  { week: "W7", earnings: 950 },
  { week: "W8", earnings: 1240 },
];

export const usageChartData = [
  { day: "Mon", calls: 18400 },
  { day: "Tue", calls: 22100 },
  { day: "Wed", calls: 19800 },
  { day: "Thu", calls: 24500 },
  { day: "Fri", calls: 28300 },
  { day: "Sat", calls: 15200 },
  { day: "Sun", calls: 12600 },
];

export const topAPIs = [
  { name: "Weather Pro", calls: "342K", revenue: "$684", icon: "☁️" },
  { name: "Sentiment AI", calls: "189K", revenue: "$947", icon: "🧠" },
  { name: "Image Resize", calls: "98K", revenue: "$982", icon: "🖼️" },
  { name: "Text-to-Speech", calls: "234K", revenue: "$1.8K", icon: "🔊" },
];
