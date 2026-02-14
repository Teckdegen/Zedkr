import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, ExternalLink, Activity, Layers } from "lucide-react";
import { toast } from "sonner";
import { getUserAPIsFromSupabase, deleteAPIFromSupabase } from "@/lib/supabase-api";
import { useUser } from "@/hooks/useUser";

const MyAPIs = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [userAPIs, setUserAPIs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's APIs from Supabase (frontend reads directly)
  useEffect(() => {
    const fetchAPIs = async () => {
      if (userLoading) return;
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Frontend reads directly from Supabase
        const apis = await getUserAPIsFromSupabase(user.id);
        setUserAPIs(apis || []);
      } catch (error: any) {
        console.error('Error fetching APIs:', error);
        toast.error('Failed to load APIs');
      } finally {
        setLoading(false);
      }
    };

    fetchAPIs();
  }, [user, userLoading]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this API project? All endpoints will be removed.")) {
      try {
        if (!user) return;
        // Frontend deletes directly from Supabase
        await deleteAPIFromSupabase(user.id, id);
        setUserAPIs(prev => prev.filter(api => api.id !== id));
        toast.success("API Project deleted successfully");
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete API');
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-api/${id}`);
  };

  if (loading || userLoading) {
    return (
      <DashboardLayout>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">My APIs</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">My APIs</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Please connect your wallet to view your APIs.</p>
        </div>
      </DashboardLayout>
    );
  }

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
          onClick={() => navigate("/create-api")}
          className="vercel-card border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-primary/50 transition-all min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all">
            <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white" />
          </div>
          <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300">Monetize New API</p>
        </motion.div>

        <AnimatePresence>
          {userAPIs.map((api, i) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/api-stats/${api.id}`}
                className="vercel-card block p-6 h-full hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                      <Activity className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{api.name || api.api_name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Layers className="w-3 h-3 text-zinc-500" />
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                          {api.endpoints?.length || 0} Endpoint{(api.endpoints?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Project Revenue</p>
                    <p className="text-xl font-black text-white">${(api.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Total Requests</p>
                    <p className="text-xl font-black text-zinc-300">{((api.totalCalls || 0) / 1000).toFixed(1)}K</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleEdit(e, api.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, api.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 transition-colors py-1 px-2 rounded hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Stats</span>
                    <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default MyAPIs;

