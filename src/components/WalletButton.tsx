import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User, Wallet, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { userSession, appDetails, showConnect } from "@/lib/stacks-auth";
import { registerUserByWallet, setUsername, getUserByWallet } from "@/lib/supabase-api";

const WalletButton = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then(async (data) => {
          setUserData(data);
          const stxAddress = data.profile.stxAddress.testnet || data.profile.stxAddress.mainnet;
          
          // Register user in Supabase (creates if doesn't exist)
          const user = await registerUserByWallet(stxAddress);
          
          if (user && !user.username) {
            // No username set - show modal
            setShowModal(true);
          } else if (user?.username) {
            // User exists with username - go to dashboard
            setNickname(user.username);
            navigate("/dashboard");
          }
        });
      } else if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data);
        const stxAddress = data.profile.stxAddress.testnet || data.profile.stxAddress.mainnet;
        
        // Get user from Supabase (async function inside useEffect)
        (async () => {
          const user = await getUserByWallet(stxAddress);
          if (user?.username) {
            setNickname(user.username);
          } else if (user && !user.username) {
            setShowModal(true);
          }
        })();
      }
    } catch (err) {
      console.error("Session check failed", err);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      // Only use testnet address for balance fetching
      const stxAddress = userData.profile.stxAddress.testnet;
      
      if (!stxAddress) {
        console.warn('No testnet address found');
        setBalance("0.00");
        return;
      }

      fetch(`https://stacks-node-api.testnet.stacks.co/extended/v1/address/${stxAddress}/balances`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Check multiple possible response structures
          const balance = data?.stx?.balance || data?.stx?.total_sent || data?.balance?.stx;
          
          if (balance) {
            // Handle both string and number formats
            const balanceValue = typeof balance === 'string' ? parseInt(balance) : balance;
            const bal = (balanceValue / 1000000).toFixed(2);
            setBalance(bal);
          } else {
            console.warn('Balance not found in response:', data);
            setBalance("0.00");
          }
        })
        .catch((error) => {
          console.error('Error fetching balance:', error);
          setBalance("0.00");
        });
    } else {
      setBalance(null);
    }
  }, [userData]);

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    userSession.signUserOut();
    setUserData(null);
    setNickname("");
    navigate("/");
    window.location.reload();
  };

  const handleConnect = () => {
    if (userSession.isUserSignedIn()) {
      // If clicked on the button itself (not the logout icon), maybe do nothing or show profile
      return;
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
          onFinish: async () => {
            const data = userSession.loadUserData();
            setUserData(data);
            const stxAddress = data.profile.stxAddress.testnet || data.profile.stxAddress.mainnet;
            
            // Register user in Supabase (creates if doesn't exist)
            const user = await registerUserByWallet(stxAddress);
            
            if (user && !user.username) {
              // No username - show modal to set it
              setShowModal(true);
            } else if (user?.username) {
              // User exists with username - go to dashboard
              setNickname(user.username);
              navigate("/dashboard");
            }
          },
        });
      } catch (err) {
        console.error("Wallet connect trigger failed", err);
        toast.error("Could not trigger wallet. Check extension setup.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNickname.trim() && userData) {
      const stxAddress = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
      
      try {
        // Set username in Supabase
        const updatedUser = await setUsername(stxAddress, tempNickname.toLowerCase());
        if (updatedUser) {
          setNickname(updatedUser.username || tempNickname);
          setShowModal(false);
          toast.success('Username registered successfully!');
          // Navigate to dashboard after setting username
          navigate("/dashboard");
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to register username');
      }
    }
  };

  const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected";
  const connected = !!userData;

  return (
    <>
      {connected ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/15 transition-all group">
            <div className="flex flex-col items-start leading-none pr-2">
              <span className="text-[11px] font-black tracking-tight flex items-center gap-1.5 uppercase">
                <User className="w-2.5 h-2.5" />
                {nickname || shortAddress}
              </span>
              {balance && (
                <span className="text-[9px] font-mono opacity-60 ml-3 mt-0.5">
                  {balance} STX
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-black/40 text-emerald-500 hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-white/5"
              title="Disconnect Wallet"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all active:scale-[0.98]"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Connect Wallet
        </button>
      )}

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
