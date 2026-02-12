import { DollarSign, ArrowDownToLine } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { transactions, earningsChartData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";

const Billing = () => {
  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground mt-1">Track your earnings and withdrawals</p>
        </div>
        <Button className="animate-pulse-glow">
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Earned" value={`$${totalEarnings.toFixed(2)}`} change="All time" icon={DollarSign} delay={0} />
        <StatCard title="This Month" value="$3,240.50" change="18% from last month" icon={DollarSign} delay={0.1} />
        <StatCard title="Available Balance" value="$1,847.20" change="Ready to withdraw" icon={DollarSign} delay={0.2} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Earnings Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={earningsChartData}>
            <defs>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="week" stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
            <Area type="monotone" dataKey="earnings" stroke="hsl(260, 60%, 60%)" fill="url(#earnGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border/50">
                <th className="text-left py-3 px-2 font-medium">Date</th>
                <th className="text-left py-3 px-2 font-medium">From</th>
                <th className="text-left py-3 px-2 font-medium">API</th>
                <th className="text-left py-3 px-2 font-medium">Amount</th>
                <th className="text-left py-3 px-2 font-medium">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-2">{t.date}</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{t.from}</td>
                  <td className="py-3 px-2">{t.api}</td>
                  <td className="py-3 px-2 font-semibold text-primary">{t.amount} STX</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{t.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Billing;
