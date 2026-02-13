import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { revenueChartData, usageChartData } from "@/data/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total API Calls" value="1.28M" change="12.4% from last month" delay={0} />
        <StatCard title="Revenue" value="$12,847" change="23.1% from last month" delay={0.1} />
        <StatCard title="Active Endpoints" value="24" change="3 new this week" delay={0.2} />
        <StatCard title="Recent Payments" value="$847.20" change="Last 24 hours" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 sm:p-6"
        >
          <h3 className="font-semibold text-sm mb-1">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly revenue over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} />
              <YAxis stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: "8px", color: "hsl(0, 0%, 93%)", fontSize: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 45%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 sm:p-6"
        >
          <h3 className="font-semibold text-sm mb-1">Daily API Calls</h3>
          <p className="text-xs text-muted-foreground mb-4">Calls this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={usageChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
              <XAxis dataKey="day" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} />
              <YAxis stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: "8px", color: "hsl(0, 0%, 93%)", fontSize: "12px" }} />
              <Bar dataKey="calls" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
