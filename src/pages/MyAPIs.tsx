import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { userAPIs } from "@/data/mockData";
import AddAPIModal from "@/components/AddAPIModal";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Activity } from "lucide-react";

const MyAPIs = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">My APIs</h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and monitor your monetized x402 endpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* "New API" Blank State Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setModalOpen(true)}
          className="vercel-card border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all">
            <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white" />
          </div>
          <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300">Monetize New API</p>
        </motion.div>

        {userAPIs.map((api, i) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/api-stats/${api.id}`}
              className="vercel-card block p-6 h-full hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                    <Activity className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{api.name}</h3>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5 truncate w-40">{api.endpoint}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${api.status === "active"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${api.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
                  {api.status === "active" ? "Ready" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Total Revenue</p>
                  <p className="text-xl font-black text-white">${api.revenue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Price / Call</p>
                  <p className="text-xl font-black text-zinc-300">{api.pricePerCall} STX</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {(api.totalCalls / 1000).toFixed(1)}K Requests
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <AddAPIModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
};

export default MyAPIs;

