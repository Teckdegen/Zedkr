import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { revenueChartData, usageChartData } from "@/data/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">Overview</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Monitor your API performance and revenue in real-time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total API Calls" value="1.28M" change="+12.4% last month" delay={0} />
        <StatCard title="Revenue" value="$12,847" change="+23.1% last month" delay={0.1} />
        <StatCard title="Active Endpoints" value="24" change="3 new this week" delay={0.2} />
        <StatCard title="Recent Payout" value="$847.20" change="Completed" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="vercel-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-sm tracking-tight">Revenue Trend</h3>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Last 30 Days</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#1a1a1a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#1a1a1a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: "4px",
                    fontSize: "10px",
                    backdropBlur: "10px"
                  }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fill="url(#dashRevGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="vercel-card p-6"
        >
          <div className="mb-8">
            <h3 className="font-bold text-sm tracking-tight">API Usage</h3>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Daily Traffic</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageChartData}>
                <XAxis
                  dataKey="day"
                  stroke="#1a1a1a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: "4px",
                    fontSize: "10px"
                  }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Bar dataKey="calls" fill="#22c55e" radius={[2, 2, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

