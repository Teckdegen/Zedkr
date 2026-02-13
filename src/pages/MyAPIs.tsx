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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">My APIs</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and monitor your registered API endpoints.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full h-10 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add API
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block vercel-card overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-4 bg-white/[0.02] border-b border-white/10 text-[10px] text-zinc-500 uppercase tracking-widest font-black">
          <span className="col-span-2">API Name / Endpoint</span>
          <span className="text-center">Status</span>
          <span className="text-center">Price / Call</span>
          <span className="text-center">Total Calls</span>
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
              className="grid grid-cols-6 px-6 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-all items-center group"
            >
              <div className="col-span-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-zinc-200">{api.name}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 truncate pr-4">{api.endpoint}</span>
              </div>
              <div className="flex justify-center">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${api.status === "active"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  }`}>
                  <Activity className="w-2.5 h-2.5" />
                  {api.status.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-bold text-center text-zinc-300">{api.pricePerCall} STX</span>
              <span className="text-sm font-bold text-center text-zinc-400">{(api.totalCalls / 1000).toFixed(1)}K</span>
              <span className="text-sm text-right font-black text-white">${api.revenue.toLocaleString()}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {userAPIs.map((api, i) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/api-stats/${api.id}`} className="vercel-card p-5 block hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-base">{api.name}</span>
                  <span className="text-[10px] font-mono text-zinc-500 truncate w-48">{api.endpoint}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${api.status === "active"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  }`}>
                  {api.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Rate</span>
                  <span className="text-xs font-bold">{api.pricePerCall} STX</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Usage</span>
                  <span className="text-xs font-bold">{(api.totalCalls / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Revenue</span>
                  <span className="text-xs font-black text-white">${api.revenue.toLocaleString()}</span>
                </div>
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

