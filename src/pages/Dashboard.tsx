import { PhoneCall, DollarSign, Radio, Banknote } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { dashboardStats, revenueChartData, usageChartData } from "@/data/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total API Calls" value="1.28M" change="12.4% from last month" icon={PhoneCall} delay={0} />
        <StatCard title="Revenue" value="$12,847" change="23.1% from last month" icon={DollarSign} delay={0.1} />
        <StatCard title="Active Endpoints" value="24" change="3 new this week" icon={Radio} delay={0.2} />
        <StatCard title="Recent Payments" value="$847.20" change="Last 24 hours" icon={Banknote} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-1">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Monthly revenue over time</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(175, 80%, 50%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-1">Daily API Calls</h3>
          <p className="text-sm text-muted-foreground mb-4">Calls this week</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usageChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="day" stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
              <Bar dataKey="calls" fill="hsl(260, 60%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
