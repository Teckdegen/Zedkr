import DashboardLayout from "@/components/DashboardLayout";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { getRevenueVsCallsData, getTrafficDistributionData, getDailyCallVolumeData } from "@/lib/supabase-api";

const COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"];

const tooltipStyle = {
  background: "rgba(0,0,0,0.9)",
  border: "1px solid rgba(16, 185, 129, 0.2)",
  borderRadius: "4px",
  color: "#10b981",
  fontSize: "10px",
  backdropBlur: "10px"
};

const Analytics = () => {
  const { user, loading: userLoading } = useUser();
  const [revenueChartData, setRevenueChartData] = useState<Array<{ month: string; revenue: number; calls: number }>>([]);
  const [usageChartData, setUsageChartData] = useState<Array<{ day: string; calls: number }>>([]);
  const [pieData, setPieData] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (userLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [revenueData, trafficData, dailyData] = await Promise.all([
          getRevenueVsCallsData(user.id),
          getTrafficDistributionData(user.id),
          getDailyCallVolumeData(user.id),
        ]);

        setRevenueChartData(revenueData);
        setPieData(trafficData);
        setUsageChartData(dailyData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, userLoading]);

  if (loading || userLoading) {
    return (
      <DashboardLayout>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">Analytics</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Loading analytics data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">Analytics</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Please connect your wallet to view analytics.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">Analytics</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Deep dive into your API performance and network growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="vercel-card p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Revenue vs Calls</h3>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Correlation Summary</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData.length > 0 ? revenueChartData : [{ month: 'No data', revenue: 0, calls: 0 }]}>
                <defs>
                  <linearGradient id="aRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis yAxisId="left" stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#10b981" }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#aRevGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vercel-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8 self-start">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Traffic Distribution</h3>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Market Share by API</p>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {pieData.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm mt-6">No data available</div>
          ) : (
            <div className="grid grid-cols-3 gap-x-6 gap-y-2 mt-6 w-full max-w-sm">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                  <div className="w-2 h-2 rounded-sm" style={{ background: COLORS[i] }} />
                  <span className="truncate">{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vercel-card p-6">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="w-4 h-4 text-primary" />
          <div>
            <h3 className="font-bold text-sm tracking-tight">Daily Call Volume</h3>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">7-Day Activity History</p>
          </div>
        </div>
        {usageChartData.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-20">No call volume data available</div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageChartData}>
                <XAxis dataKey="day" stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} contentStyle={tooltipStyle} itemStyle={{ color: "#10b981" }} />
                <Bar dataKey="calls" fill="#10b981" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;

