import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { userSession, appDetails, showConnect } from "@/lib/stacks-auth";

const WalletButton = () => {
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((data) => {
          setUserData(data);
          const stxAddress = data.profile.stxAddress.mainnet || data.profile.stxAddress.testnet;
          const savedNickname = localStorage.getItem(`zedkr_nickname_${stxAddress}`);
          if (!savedNickname) {
            setShowModal(true);
          } else {
            setNickname(savedNickname);
          }
        });
      } else if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data);
        const stxAddress = data.profile.stxAddress.mainnet || data.profile.stxAddress.testnet;
        const savedNickname = localStorage.getItem(`zedkr_nickname_${stxAddress}`);
        if (savedNickname) setNickname(savedNickname);
      }
    } catch (err) {
      console.error("Session check failed", err);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const stxAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;
      fetch(`https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${stxAddress}/balances`)
        .then(res => res.json())
        .then(data => {
          if (data?.stx?.balance) {
            const bal = (parseInt(data.stx.balance) / 1000000).toFixed(2);
            setBalance(bal);
          } else {
            setBalance("0.00");
          }
        })
        .catch(() => setBalance("0.00"));
    } else {
      setBalance(null);
    }
  }, [userData]);

  const handleConnect = () => {
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut();
      setUserData(null);
      setNickname("");
      window.location.reload();
    } else {
      const connectFn = (typeof showConnect === 'function' ? showConnect : null) ||
        (window as any).StacksConnect?.showConnect ||
        (window as any).StacksConnect?.authenticate;

      if (typeof connectFn !== 'function') {
        console.error("Critical: showConnect not found.", {
          stacksAuthExport: showConnect,
          windowGlobal: (window as any).StacksConnect,
        });
        toast.error("Bridge library failed to initialize. Please refresh.");
        return;
      }

      try {
        connectFn({
          appDetails,
          userSession,
          onFinish: () => {
            const data = userSession.loadUserData();
            setUserData(data);
            const stxAddress = data.profile.stxAddress.mainnet || data.profile.stxAddress.testnet;
            const savedNickname = localStorage.getItem(`zedkr_nickname_${stxAddress}`);
            if (!savedNickname) {
              setShowModal(true);
            } else {
              setNickname(savedNickname);
            }
          },
        });
      } catch (err) {
        console.error("Wallet connect trigger failed", err);
        toast.error("Could not trigger wallet. Check extension setup.");
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNickname.trim() && userData) {
      const stxAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;
      setNickname(tempNickname);
      setShowModal(false);
      localStorage.setItem(`zedkr_nickname_${stxAddress}`, tempNickname);
    }
  };

  const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected";
  const connected = !!userData;

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
          <span className="flex items-center gap-3">
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {nickname || shortAddress}
              </span>
              {balance && (
                <span className="text-[10px] font-mono opacity-60 ml-4">
                  {balance} STX
                </span>
              )}
            </div>
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
                <h2 className="text-2xl font-bold tracking-tighter">Set Profile ID</h2>
                <p className="text-zinc-500 text-sm mt-2">Almost there! Link a Zedkr ID to {shortAddress}.</p>
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
                  <p className="text-[10px] text-zinc-600 ml-1">Visible across the x402 protocol.</p>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-primary text-white hover:bg-emerald-500 h-12 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                    Finish Setup
                  </Button>
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
