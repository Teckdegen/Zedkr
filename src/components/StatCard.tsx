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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-4 sm:p-6"
    >
      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
      <p className="text-lg sm:text-2xl font-bold tracking-tight">{value}</p>
      {change && (
        <p className={`text-xs mt-2 ${changeType === "positive" ? "text-primary" : "text-destructive"}`}>
          {change}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
