import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { userAPIs, callHistory, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Clock, ShieldCheck, Layers, ExternalLink, Zap } from "lucide-react";

const APIStats = () => {
  const { id } = useParams();
  const api = userAPIs.find((a) => a.id === id) || userAPIs[0];

  return (
    <DashboardLayout>
      <Link to="/my-apis" className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to My APIs
      </Link>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">{api.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <Layers className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{api.endpoints.length} Endpoints</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <ShieldCheck className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID: {api.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${api.status === 'active'
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            }`}>
            <Activity className="w-3 h-3" />
            {api.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Project Revenue", value: `$${api.revenue.toLocaleString()}`, icon: <ShieldCheck className="w-3 h-3 text-zinc-500" /> },
          { label: "Total Requests", value: `${(api.totalCalls / 1000).toFixed(1)}K`, icon: <Activity className="w-3 h-3 text-zinc-500" /> },
          { label: "Av. Latency", value: "42ms", icon: <Clock className="w-3 h-3 text-zinc-500" /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="vercel-card p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              {s.icon}
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{s.label}</p>
            </div>
            <p className="text-3xl font-black tracking-tighter">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Endpoints List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Active Endpoints
            </h3>
          </div>
          {api.endpoints.map((endpoint, i) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="vercel-card p-4 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{endpoint.name}</span>
                    <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 border border-white/5 px-1.5 rounded uppercase">{endpoint.id}</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 truncate">https://api.zedkr.com{endpoint.path}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">Price</p>
                    <p className="text-xs font-bold text-zinc-300">{endpoint.price} STX</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">Calls</p>
                    <p className="text-xs font-bold text-zinc-300">{(endpoint.calls / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-1" />
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="vercel-card p-6"
        >
          <div className="mb-8">
            <h3 className="font-bold text-sm tracking-tight">Project Traffic</h3>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Aggregated Volume</p>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "4px",
                    fontSize: "10px"
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Area type="monotone" dataKey="calls" stroke="#10b981" fill="url(#statGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="vercel-card overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 bg-white/[0.01]">
          <h3 className="font-bold text-sm tracking-tight">Recent Activity Log</h3>
        </div>

        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase tracking-widest font-black border-b border-white/10">
                <th className="text-left py-4 px-6">Timestamp</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Latency</th>
                <th className="text-left py-4 px-6">Caller / Wallet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {callHistory.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 font-mono text-[11px] text-zinc-500">{c.timestamp}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${c.status === 200
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : c.status === 429
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-300 font-bold">{c.latency}ms</td>
                  <td className="py-4 px-6 font-mono text-[10px] text-zinc-600 lowercase">{c.caller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col divide-y divide-white/5">
          {callHistory.map((c) => (
            <div key={c.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${c.status === 200 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}>
                  {c.status}
                </span>
                <span className="text-xs font-bold text-zinc-300">{c.latency}ms</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span className="font-mono lowercase">{c.timestamp}</span>
                <span className="font-mono lowercase truncate ml-2 w-32">{c.caller}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default APIStats;


