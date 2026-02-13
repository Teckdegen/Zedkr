import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { userAPIs, callHistory, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const APIStats = () => {
  const { id } = useParams();
  const api = userAPIs.find((a) => a.id === id) || userAPIs[0];

  return (
    <DashboardLayout>
      <Link to="/my-apis" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
        ← Back to My APIs
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{api.name}</h1>
        <p className="text-muted-foreground font-mono text-xs sm:text-sm mt-1 truncate">{api.endpoint}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Calls", value: `${(api.totalCalls / 1000).toFixed(1)}K` },
          { label: "Revenue", value: `$${api.revenue.toFixed(2)}` },
          { label: "Price/Call", value: `${api.pricePerCall} STX` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-3 sm:p-5">
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4 sm:p-6 mb-6">
        <h3 className="font-semibold text-sm mb-4">Usage Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueChartData}>
            <defs>
              <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
            <XAxis dataKey="month" stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} />
            <YAxis stroke="hsl(0, 0%, 45%)" fontSize={11} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: "8px", color: "hsl(0, 0%, 93%)", fontSize: "12px" }} />
            <Area type="monotone" dataKey="calls" stroke="hsl(142, 70%, 45%)" fill="url(#statGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 sm:p-6">
        <h3 className="font-semibold text-sm mb-4">Recent Calls</h3>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border/50">
                <th className="text-left py-3 px-2 font-medium text-xs uppercase tracking-wider">Timestamp</th>
                <th className="text-left py-3 px-2 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-2 font-medium text-xs uppercase tracking-wider">Latency</th>
                <th className="text-left py-3 px-2 font-medium text-xs uppercase tracking-wider">Caller</th>
              </tr>
            </thead>
            <tbody>
              {callHistory.map((c) => (
                <tr key={c.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs">{c.timestamp}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 200 ? "bg-primary/15 text-primary" : c.status === 429 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm">{c.latency}ms</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{c.caller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {callHistory.map((c) => (
            <div key={c.id} className="border border-border/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.status === 200 ? "bg-primary/15 text-primary" : c.status === 429 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                }`}>
                  {c.status}
                </span>
                <span className="text-xs text-muted-foreground">{c.latency}ms</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{c.timestamp}</span>
                <span className="font-mono truncate ml-2">{c.caller}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default APIStats;
