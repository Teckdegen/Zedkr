import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { userAPIs } from "@/data/mockData";
import AddAPIModal from "@/components/AddAPIModal";
import { motion } from "framer-motion";

const MyAPIs = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My APIs</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your registered endpoints</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add API</Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span>Name</span>
          <span>Endpoint</span>
          <span className="text-center">Price/Call</span>
          <span className="text-center">Calls</span>
          <span className="text-right">Revenue</span>
        </div>
        {userAPIs.map((api, i) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/api-stats/${api.id}`}
              className="grid grid-cols-5 px-6 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors items-center"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{api.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  api.status === "active"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {api.status}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground truncate pr-4">{api.endpoint}</span>
              <span className="text-sm text-center">{api.pricePerCall} STX</span>
              <span className="text-sm text-center text-muted-foreground">{(api.totalCalls / 1000).toFixed(1)}K</span>
              <span className="text-sm text-right font-semibold text-primary">${api.revenue.toFixed(2)}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <AddAPIModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
};

export default MyAPIs;
