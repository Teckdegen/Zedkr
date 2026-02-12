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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">ZedKr</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
              Dashboard
            </Link>
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-8">
              <Zap className="h-3.5 w-3.5" />
              Built on Stacks Blockchain
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              Monetize Your{" "}
              <span className="gradient-text">API Endpoints</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Register any API, set your price per call, and earn STX automatically. 
              ZedKr handles metering, billing, and payouts — you just build.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="text-base px-8">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/my-apis">
              <Button size="lg" variant="outline" className="text-base px-8 border-border/50">
                Explore APIs
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mini chart preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-20 glass-card p-6 gradient-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">$12,847.52</p>
            </div>
            <span className="text-sm text-success">↑ 23% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(175, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="hsl(175, 80%, 50%)" fill="url(#heroGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* Top APIs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Top Performing APIs</h2>
            <p className="text-muted-foreground">See what's trending on the ZedKr marketplace</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topAPIs.map((api, i) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 text-center"
              >
                <div className="text-4xl mb-3">{api.icon}</div>
                <h3 className="font-semibold mb-2">{api.name}</h3>
                <p className="text-sm text-muted-foreground">{api.calls} calls</p>
                <p className="text-primary font-semibold mt-1">{api.revenue} earned</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why ZedKr?</h2>
            <p className="text-muted-foreground">Everything you need to monetize your APIs</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card-hover p-6"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-bold">ZedKr</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 ZedKr. Built on Stacks.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
