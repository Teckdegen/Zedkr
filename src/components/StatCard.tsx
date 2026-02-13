import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  delay?: number;
}

const StatCard = ({ title, value, change, changeType = "positive", delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="vercel-card p-5"
    >
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold tracking-tighter">{value}</p>
        {change && (
          <span className={`text-[10px] font-bold ${changeType === "positive" ? "text-emerald-500" : "text-red-500"}`}>
            {change.includes('%') ? change.split(' ')[0] : change}
          </span>
        )}
      </div>
      {change && !change.includes('%') && (
        <p className="text-[10px] text-zinc-600 mt-1 font-medium">
          {change}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;

