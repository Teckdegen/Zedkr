import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Code2, Globe, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletButton from "@/components/WalletButton";
import { topAPIs, revenueChartData } from "@/data/mockData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const features = [
  { icon: Code2, title: "Instant API Registration", desc: "Register any REST API in seconds and start earning per call." },
  { icon: Shield, title: "Stacks Powered", desc: "Built on Stacks blockchain for transparent, trustless payments." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track every call, monitor performance, and optimize revenue." },
  { icon: Globe, title: "Global Distribution", desc: "CDN-backed endpoints with 99.9% uptime guarantee." },
  { icon: Coins, title: "Instant Payouts", desc: "Withdraw earnings in STX anytime, no minimums." },
  { icon: Zap, title: "Pay Per Call", desc: "Users pay only for what they use. Fair and scalable pricing." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold tracking-tight">ZedKr</span>
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
        {/* Background pattern image */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('/images/bg-pattern.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="relative z-10 max-w-4xl mx-auto text-center pt-32 pb-40 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built on Stacks Blockchain
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[0.9]">
              Monetize Your<br />
              <span className="text-primary">API Endpoints</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Register any API, set your price per call, and earn STX automatically. 
              ZedKr handles metering, billing, and payouts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button size="lg" className="text-sm font-medium px-6 rounded-md">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/my-apis">
              <Button size="lg" variant="outline" className="text-sm font-medium px-6 rounded-md">
                Explore APIs
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
            <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">↑ 23%</span>
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

      {/* Top APIs */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Top Performing APIs</h2>
            <p className="text-sm text-muted-foreground">See what's trending on ZedKr</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topAPIs.map((api, i) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card-hover p-5"
              >
                <div className="text-3xl mb-3">{api.icon}</div>
                <h3 className="font-medium text-sm mb-1">{api.name}</h3>
                <p className="text-xs text-muted-foreground">{api.calls} calls</p>
                <p className="text-primary text-sm font-semibold mt-2">{api.revenue}</p>
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
                <f.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-medium text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">ZedKr</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 ZedKr. Built on Stacks.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
