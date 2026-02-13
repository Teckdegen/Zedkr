import DashboardLayout from "@/components/DashboardLayout";
import { revenueChartData, usageChartData } from "@/data/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const pieData = [
  { name: "Weather Pro", value: 342 },
  { name: "Sentiment AI", value: 189 },
  { name: "Image Resize", value: 98 },
  { name: "Text-to-Speech", value: 234 },
  { name: "Currency", value: 567 },
];

const COLORS = ["hsl(142, 70%, 45%)", "hsl(142, 50%, 35%)", "hsl(38, 90%, 55%)", "hsl(200, 60%, 50%)", "hsl(340, 70%, 55%)"];

const tooltipStyle = { background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: "8px", color: "hsl(0, 0%, 93%)", fontSize: "12px" };

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into your API performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 sm:p-6">
          <h3 className="font-semibold text-sm mb-4">Revenue vs Calls</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aCallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 60%, 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(200, 60%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 45%)" fill="url(#aRevGrad)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="calls" stroke="hsl(200, 60%, 50%)" fill="url(#aCallGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 sm:p-6">
          <h3 className="font-semibold text-sm mb-4">Traffic by API</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 sm:p-6">
        <h3 className="font-semibold text-sm mb-4">Weekly Call Volume</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={usageChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
            <XAxis dataKey="day" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} />
            <YAxis stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="calls" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
