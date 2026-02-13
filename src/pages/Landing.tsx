import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletButton from "@/components/WalletButton";
import { topAPIs, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const features = [
  { title: "Instant API Registration", desc: "Register any REST API in seconds and start earning per call." },
  { title: "Stacks Powered", desc: "Built on Stacks blockchain for transparent, trustless payments." },
  { title: "Real-time Analytics", desc: "Track every call, monitor performance, and optimize revenue." },
  { title: "Global Distribution", desc: "CDN-backed endpoints with 99.9% uptime guarantee." },
  { title: "Instant Payouts", desc: "Withdraw earnings in STX anytime, no minimums." },
  { title: "Pay Per Call", desc: "Users pay only for what they use. Fair and scalable pricing." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight">ZedKr</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/my-apis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">APIs</Link>
              <Link to="/billing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Billing</Link>
            </div>
          </div>
          <WalletButton />
        </div>
      </nav>

      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('/images/bg-pattern.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="relative z-10 max-w-4xl mx-auto text-center pt-32 pb-40 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.06em] mb-5 leading-[0.95]">
              Your APIs.<br />
              <span className="text-primary">x402 Powered.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Monetize any API endpoint in under a minute.<br className="hidden sm:block" />
              No code. No setup. Just revenue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link to="/dashboard">
              <Button size="lg" className="text-sm font-medium px-8 h-11 rounded-md">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Revenue card */}
      <section className="px-4 -mt-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">$12,847.52</p>
            </div>
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">↑ 23%</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 45%)" fill="url(#heroGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* Top APIs - Professional table-style list */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Top Performing APIs</h2>
            <p className="text-sm text-muted-foreground">See what's trending on ZedKr</p>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
              <span>API Name</span>
              <span className="text-center">Calls</span>
              <span className="text-right">Revenue</span>
            </div>
            {topAPIs.map((api, i) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="grid grid-cols-3 px-6 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/40 transition-colors"
              >
                <span className="font-medium text-sm">{api.name}</span>
                <span className="text-center text-sm text-muted-foreground">{api.calls}</span>
                <span className="text-right text-sm font-semibold text-primary">{api.revenue}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Why ZedKr?</h2>
            <p className="text-sm text-muted-foreground">Everything you need to monetize your APIs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card-hover p-5"
              >
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-sm">ZedKr</span>
          <p className="text-xs text-muted-foreground">© 2025 ZedKr. Built on Stacks.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
