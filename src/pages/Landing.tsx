import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletButton from "@/components/WalletButton";
import { topAPIs, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";

const features = [
  {
    title: "Instant x402 Wrapping",
    desc: "Wrap any public REST API in seconds and initiate 402 Payment Required flows.",
  },
  {
    title: "Stacks x402 Protocol",
    desc: "Leverage the x402 standard on Stacks for transparent, trustless API payments.",
  },
  {
    title: "Real-time Payout Logs",
    desc: "Monitor every monetized call and track your protocol earnings in real-time.",
  },
  {
    title: "Global Protocol Proxy",
    desc: "Ultra-fast CDN-backed proxy endpoints that handle all payment verification.",
  },
  {
    title: "Automated STX Settlements",
    desc: "Receive earnings directly in your wallet as soon as calls are verified.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* Grid Overlay */}
      <div className="fixed inset-0 vercel-grid opacity-[0.2] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <img src="/logo.png" alt="Zedkr Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">Zedkr</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/my-apis" className="text-sm text-zinc-400 hover:text-white transition-colors">My APIs</Link>
              <Link to="/analytics" className="text-sm text-zinc-400 hover:text-white transition-colors">Analytics</Link>
              <Link to="/billing" className="text-sm text-zinc-400 hover:text-white transition-colors">Billing</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-8 mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Built on Stacks Ecosystem
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 vercel-gradient leading-[0.8] py-2">
              X402:<br />MONETIZE ANY API.
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Transform any public API endpoint into a revenue stream using the x402 protocol. <br />
              Automated, decentralized payments powered by the Stacks Blockchain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-white hover:bg-emerald-500 text-sm font-bold px-10 h-12 rounded-full transition-all hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(0,230,118,0.2)] active:scale-[0.98]">
                  Start Building
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Preview Section */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="vercel-card overflow-hidden bg-black/40 backdrop-blur-3xl border-white/5"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                <div>
                  <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Network Revenue</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-7xl font-bold tracking-tighter text-white">$12,847.52</span>
                    <span className="text-primary text-sm font-bold">+23.4%</span>
                  </div>
                </div>
                <div className="flex gap-12">
                  <div>
                    <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Active APIs</h3>
                    <p className="text-2xl font-bold tracking-tight text-white">1,248</p>
                  </div>
                  <div>
                    <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Total Calls</h3>
                    <p className="text-2xl font-bold tracking-tight text-white">8.4M</p>
                  </div>
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(142, 76%, 36%)"
                      fill="url(#revenueGrad)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border-t border-white/5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 bg-white/[0.01]">
              {topAPIs.slice(0, 4).map((api) => (
                <div key={api.name} className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">{api.name}</span>
                  <span className="text-sm font-bold text-primary">{api.revenue}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">The API Monetization Stack.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl">Everything you need to turn code into currency without the complexity of traditional payment gateways.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="vercel-card p-8 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-bold mb-3 relative z-10">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 border-t border-white/5 bg-primary/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 vercel-gradient leading-[1.1]">Join the future of API Economy.</h2>
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary text-white hover:bg-emerald-500 text-base font-bold px-12 h-14 rounded-full shadow-[0_0_30px_rgba(0,230,118,0.15)] transition-all hover:scale-105">
              Deploy Your First API <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};


export default Landing;

