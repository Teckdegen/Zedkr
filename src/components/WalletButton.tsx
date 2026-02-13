import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Wallet } from "lucide-react";

const WalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const address = "SP2J6Z...B48R";

  useEffect(() => {
    const savedName = localStorage.getItem("zedkr_nickname");
    const isConnected = localStorage.getItem("zedkr_connected") === "true";
    if (savedName) setNickname(savedName);
    if (isConnected) setConnected(true);
  }, []);

  const handleConnect = () => {
    if (connected) {
      setConnected(false);
      localStorage.setItem("zedkr_connected", "false");
    } else {
      setShowModal(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      setConnected(true);
      setShowModal(false);
      localStorage.setItem("zedkr_nickname", tempNickname);
      localStorage.setItem("zedkr_connected", "true");
    }
  };

  return (
    <>
      <button
        onClick={handleConnect}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${connected
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
            : "bg-primary text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          }`}
      >
        <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500" : "bg-white animate-pulse"}`} />
        {connected ? (
          <span className="flex items-center gap-2">
            <User className="w-3 h-3" />
            {nickname || address}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="vercel-card p-8 w-full max-w-sm border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tighter">Create Profile</h2>
                <p className="text-zinc-500 text-sm mt-2">Enter a unique Zedkr ID to link with your wallet.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 ml-1">Zedkr ID</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">@</span>
                    <Input
                      autoFocus
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="username"
                      className="bg-zinc-900 border-white/5 pl-8 h-12 rounded-xl focus:ring-primary/20 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 ml-1">Only letters, numbers, and underscores.</p>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-primary text-white hover:bg-emerald-500 h-12 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                    Complete Connection
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full mt-4 text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WalletButton;
