import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, Clock, ShieldCheck, Layers, ExternalLink, Zap } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getUserAPIsFromSupabase, deleteAPIFromSupabase } from "@/lib/supabase-api";
import { useUser } from "@/hooks/useUser";
import { useSTXPrice } from "@/hooks/useSTXPrice";
import { supabase } from "@/lib/supabase";

const APIStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { stxToUSD, formatUSD } = useSTXPrice();
  const [api, setApi] = useState<any>(null);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate chart data from call history
  const revenueChartData = callHistory.length > 0 
    ? callHistory.slice(0, 7).reverse().map((call, i) => ({
        month: new Date(call.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calls: 1,
      }))
    : [{ month: 'No data', calls: 0 }];

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading || !user || !id) return;

      try {
        setLoading(true);
        // Frontend reads directly from Supabase
        const apis = await getUserAPIsFromSupabase(user.id);
        const foundApi = apis.find((a: any) => a.id === id);
        if (foundApi) {
          // Fetch call history and stats for all endpoints
          const endpointIds = (foundApi.endpoints || []).map((e: any) => e.id);
          
          if (endpointIds.length > 0) {
            // Get all API calls for this API's endpoints to calculate revenue and total calls
            const { data: allCallsData, error: callsError } = await supabase
              .from('api_calls')
              .select('amount_paid, timestamp, status_code, latency_ms, caller_wallet')
              .in('endpoint_id', endpointIds)
              .order('timestamp', { ascending: false });

            if (!callsError && allCallsData) {
              // Calculate total revenue (convert microSTX to STX)
              const totalRevenue = allCallsData.reduce((sum, call) => 
                sum + (Number(call.amount_paid) || 0), 0
              ) / 1000000;

              // Calculate total calls
              const totalCalls = allCallsData.length;

              // Get recent calls for display
              const recentCalls = allCallsData.slice(0, 20).map((call: any) => ({
                id: call.id || Math.random().toString(),
                timestamp: new Date(call.timestamp).toLocaleString(),
                status: call.status_code || 'N/A',
                latency: call.latency_ms || 0,
                caller: call.caller_wallet || 'Unknown',
              }));

              setCallHistory(recentCalls);

              // Update API with calculated stats
              setApi({
                ...foundApi,
                revenue: totalRevenue,
                totalCalls: totalCalls,
              });
            } else {
              // No calls yet
              setApi({
                ...foundApi,
                revenue: 0,
                totalCalls: 0,
              });
              setCallHistory([]);
            }
          } else {
            // No endpoints
            setApi({
              ...foundApi,
              revenue: 0,
              totalCalls: 0,
            });
            setCallHistory([]);
          }
        } else {
          navigate("/my-apis");
        }
      } catch (error) {
        console.error('Error fetching API stats:', error);
        navigate("/my-apis");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, userLoading, navigate]);

  if (loading || userLoading) {
    return (
      <DashboardLayout>
        <Link to="/my-apis" className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to My APIs
        </Link>
        <div className="text-center py-20">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!api) {
    return (
      <DashboardLayout>
        <Link to="/my-apis" className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to My APIs
        </Link>
        <div className="text-center py-20">
          <p className="text-zinc-500">API not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/my-apis" className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to My APIs
      </Link>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">{api.api_name || api.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <Layers className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{api.endpoints?.length || 0} Endpoints</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <ShieldCheck className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID: {api.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex items-center gap-2 mr-2">
            <Link
              to={`/edit-api/${api.id}`}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors py-1.5 px-3 rounded bg-white/5 border border-white/5"
            >
              Edit Project
            </Link>
            <button
              onClick={async () => {
                if (confirm("Delete this entire API project?")) {
                  try {
                    if (!user) return;
                    // Frontend deletes directly from Supabase
                    await deleteAPIFromSupabase(user.id, api.id);
                  toast.success("Project deleted");
                  navigate("/my-apis");
                  } catch (error: any) {
                    toast.error(error.message || "Failed to delete API");
                  }
                }
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 transition-colors py-1.5 px-3 rounded bg-rose-500/5 border border-rose-500/10"
            >
              Delete
            </button>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${(api.endpoints || []).some((e: any) => e.active !== false)
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            }`}>
            <Activity className="w-3 h-3" />
            {(api.endpoints || []).some((e: any) => e.active !== false) ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Project Revenue", value: formatUSD(stxToUSD(api.revenue || 0)), subtitle: `${(api.revenue || 0).toFixed(3)} STX`, icon: <ShieldCheck className="w-3 h-3 text-zinc-500" /> },
          { label: "Total Requests", value: (api.totalCalls || 0) >= 1000 ? `${((api.totalCalls || 0) / 1000).toFixed(1)}K` : (api.totalCalls || 0).toString(), icon: <Activity className="w-3 h-3 text-zinc-500" /> },
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
            {s.subtitle && <p className="text-[10px] text-zinc-500 mt-1">{s.subtitle}</p>}
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
          {api.endpoints?.map((endpoint, i) => (
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
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{endpoint.endpoint_name || endpoint.name}</span>
                    <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 border border-white/5 px-1.5 rounded uppercase">{endpoint.id}</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 truncate">
                    {endpoint.monetized_url || (user?.username && (api.api_name_slug || api.apiNameSlug)
                      ? `https://zedkr.up.railway.app/${user.username}/${api.api_name_slug || api.apiNameSlug}/${endpoint.endpoint_path || endpoint.path}`
                      : `https://zedkr.up.railway.app/.../${endpoint.endpoint_path || endpoint.path}`
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">Price</p>
                    <p className="text-xs font-bold text-zinc-300">
                      {formatUSD(stxToUSD((endpoint.price || endpoint.price_microstx / 1000000) || 0))}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {((endpoint.price || endpoint.price_microstx / 1000000) || 0).toFixed(3)} STX
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">Calls</p>
                    <p className="text-xs font-bold text-zinc-300">{(endpoint.calls || 0)}</p>
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
              {callHistory.length > 0 ? callHistory.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 font-mono text-[11px] text-zinc-500">{c.timestamp}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${c.status === 200 || c.status === '200'
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : c.status === 429 || c.status === '429'
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-300 font-bold">{c.latency}ms</td>
                  <td className="py-4 px-6 font-mono text-[10px] text-zinc-600 lowercase">{c.caller}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-zinc-500 text-sm">No API calls yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col divide-y divide-white/5">
          {callHistory.length > 0 ? callHistory.map((c) => (
            <div key={c.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${c.status === 200 || c.status === '200' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
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
          )) : (
            <div className="p-5 text-center text-zinc-500 text-sm">No API calls yet</div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default APIStats;


