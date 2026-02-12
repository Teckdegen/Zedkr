import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { userAPIs, callHistory, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const APIStats = () => {
  const { id } = useParams();
  const api = userAPIs.find((a) => a.id === id) || userAPIs[0];

  return (
    <DashboardLayout>
      <Link to="/my-apis" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to My APIs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{api.name}</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">{api.endpoint}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Calls", value: `${(api.totalCalls / 1000).toFixed(1)}K` },
          { label: "Revenue", value: `$${api.revenue.toFixed(2)}` },
          { label: "Price/Call", value: `${api.pricePerCall} STX` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Usage Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueChartData}>
            <defs>
              <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
            <Area type="monotone" dataKey="calls" stroke="hsl(175, 80%, 50%)" fill="url(#statGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="font-semibold mb-4">Recent Calls</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border/50">
                <th className="text-left py-3 px-2 font-medium">Timestamp</th>
                <th className="text-left py-3 px-2 font-medium">Endpoint</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Latency</th>
                <th className="text-left py-3 px-2 font-medium">Caller</th>
              </tr>
            </thead>
            <tbody>
              {callHistory.map((c) => (
                <tr key={c.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs">{c.timestamp}</td>
                  <td className="py-3 px-2 font-mono text-xs">{c.endpoint}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 200 ? "bg-success/15 text-success" : c.status === 429 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{c.latency}ms</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{c.caller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default APIStats;
