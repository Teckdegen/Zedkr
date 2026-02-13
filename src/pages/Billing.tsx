import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { transactions, earningsChartData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { ArrowUpRight, History, Wallet } from "lucide-react";

const Billing = () => {
  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">Billing</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Manage your earnings, payouts, and financial history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Earned" value={`$${totalEarnings.toLocaleString()}`} change="All time" delay={0} />
        <StatCard title="This Month" value="$3,240.50" change="+18.4%" delay={0.1} />
        <StatCard title="Available Balance" value="$1,847.20" change="Ready" delay={0.2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="vercel-card p-6 mb-8"
      >
        <div className="mb-8">
          <h3 className="font-bold text-sm tracking-tight">Earnings History</h3>
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Weekly Performance</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsChartData}>
              <defs>
                <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#1a1a1a" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "4px",
                  fontSize: "10px",
                  backdropBlur: "10px"
                }}
                itemStyle={{ color: "#10b981" }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#10b981" fill="url(#billingGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="vercel-card overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            <h3 className="font-bold text-sm tracking-tight">Recent Transactions</h3>
          </div>
        </div>

        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase tracking-widest font-black border-b border-white/10">
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-left py-4 px-6">API / Source</th>
                <th className="text-left py-4 px-6">Amount</th>
                <th className="text-left py-4 px-6">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 text-sm text-zinc-400">{t.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-zinc-200">{t.api}</span>
                      <span className="text-[10px] font-mono text-zinc-600 truncate w-32">{t.from}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-black text-white">{t.amount} STX</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-mono text-zinc-600 truncate w-32 inline-block">{t.txHash}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col divide-y divide-white/5">
          {transactions.map((t) => (
            <div key={t.id} className="p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{t.api}</span>
                <span className="font-black text-sm text-white">{t.amount} STX</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>{t.date}</span>
                <div className="flex items-center gap-1">
                  ID: <span className="font-mono text-zinc-600 lowercase">{t.txHash.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Billing;

