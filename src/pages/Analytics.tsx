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

const COLORS = ["hsl(175, 80%, 50%)", "hsl(260, 60%, 60%)", "hsl(38, 90%, 55%)", "hsl(150, 60%, 50%)", "hsl(340, 70%, 55%)"];

const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" };

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your API performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-semibold mb-4">Revenue vs Calls</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aCallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 12%, 50%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(175, 80%, 50%)" fill="url(#aRevGrad)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="calls" stroke="hsl(260, 60%, 60%)" fill="url(#aCallGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-semibold mb-4">Traffic by API</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-semibold mb-4">Weekly Call Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usageChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="day" stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="calls" fill="hsl(175, 80%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
