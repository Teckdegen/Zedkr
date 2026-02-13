import { Link, useLocation } from "react-router-dom";
import { Home, Code2, BarChart3, CreditCard, ChevronRight } from "lucide-react";
import WalletButton from "./WalletButton";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: Home },
  { label: "My APIs", path: "/my-apis", icon: Code2 },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Billing", path: "/billing", icon: CreditCard },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Subtle Background Grid */}
      <div className="fixed inset-0 vercel-grid opacity-[0.05] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110">
                  <img src="/logo.png" alt="Zedkr Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-bold tracking-tight hidden sm:block">Zedkr</span>
              </Link>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-200"
                        }`}
                    >
                      {item.label}
                      {isActive && (
                        <div className="absolute -bottom-[15px] left-0 right-0 h-[1px] bg-white" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header / Breadcrumbs */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <Link to="/" className="hover:text-white transition-colors">Project</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-200">{location.pathname.split('/')[1] || 'Dashboard'}</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-10 pb-24 md:pb-12 relative z-10">
        {children}
      </main>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors ${isActive ? "text-white font-bold" : "text-zinc-500"
                  }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

