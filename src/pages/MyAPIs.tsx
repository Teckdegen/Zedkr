import { useState } from "react";
import { Plus, ExternalLink, BarChart3 } from "lucide-react";
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
          <h1 className="text-3xl font-bold">My APIs</h1>
          <p className="text-muted-foreground mt-1">Manage your registered endpoints</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add API
        </Button>
      </div>

      <div className="grid gap-4">
        {userAPIs.map((api, i) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card-hover p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{api.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    api.status === "active"
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {api.status}
                  </span>
                </div>
                <p className="text-sm font-mono text-muted-foreground truncate">{api.endpoint}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-muted-foreground">Price/call</p>
                  <p className="font-semibold">{api.pricePerCall} STX</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Calls</p>
                  <p className="font-semibold">{(api.totalCalls / 1000).toFixed(1)}K</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-primary">${api.revenue.toFixed(2)}</p>
                </div>
                <Link to={`/api-stats/${api.id}`}>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AddAPIModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
};

export default MyAPIs;
