import { Link } from "react-router-dom";
import { Users, TrendingUp, Landmark, ArrowLeftRight, CircleDollarSign, Bell, Gift, Headphones } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

const LoggedHome = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Card */}
        <div className="card-glass p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary text-center mb-3">
            Welcome, {profile?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground text-center text-sm max-w-2xl mx-auto mb-6">
            You're all set to trade on Web3 Derp. Use the quick actions below or explore the markets to get started.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="card-glass p-5 flex-1 min-w-[200px]">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-display font-bold text-foreground text-center text-sm">Community Signals</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Follow top traders and get real-time insights.</p>
            </div>
            <div className="card-glass p-5 flex-1 min-w-[200px]">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-display font-bold text-foreground text-center text-sm">Real-Time Charts</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Track crypto movements live and make informed trades.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Landmark, label: "Deposit", to: "/deposit" },
            { icon: ArrowLeftRight, label: "Transactions", to: "/transactions" },
            { icon: CircleDollarSign, label: "Withdraw", to: "/withdraw" },
            { icon: Gift, label: "Rewards", to: "/rewards" },
            { icon: Headphones, label: "Support", to: "https://t.me/web3derp", external: true },
          ].map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glass p-6 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
              >
                <item.icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-foreground">{item.label}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="card-glass p-6 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
              >
                <item.icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-foreground">{item.label}</span>
              </Link>
            )
          )}
        </div>

        {/* Promotions */}
        <h2 className="text-xl font-display font-bold text-primary mb-4">Promotions</h2>
        <div className="flex flex-col gap-4">
          <div className="card-glass p-6">
            <h3 className="font-display font-bold text-foreground mb-1">Level Up Your Account</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to premium for up to <span className="font-bold text-foreground">10% cashback</span> on trades.
            </p>
            <button className="px-5 py-2 rounded-full gradient-cta text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
          <div className="card-glass p-6">
            <h3 className="font-display font-bold text-foreground mb-1">Invite & Earn</h3>
            <p className="text-sm text-muted-foreground mb-3">Get instant bonuses for every friend that joins.</p>
            <button className="px-5 py-2 rounded-full gradient-cta text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Invite Friends
            </button>
          </div>
          <div className="card-glass p-6">
            <h3 className="font-display font-bold text-foreground mb-1">24/7 Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Need help? Our team is always online for you.</p>
            <a
              href="https://t.me/web3derp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-full gradient-cta text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedHome;
