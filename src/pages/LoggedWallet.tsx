import { Link } from "react-router-dom";
import { PlusCircle, MinusCircle, ArrowLeftRight, Bot, CircleDollarSign, CalendarCheck, Settings } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

const LoggedWallet = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Balance */}
        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Balance</p>
          <p className="text-4xl font-display font-bold text-foreground">
            {profile?.balance?.toLocaleString() ?? "0.00"} <span className="text-lg font-medium">USDT</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">≈ ${profile?.balance?.toLocaleString() ?? "0.00"} USD</p>
        </div>

        {/* Deposit / Withdraw / Transfer */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="h-4 w-4" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
          >
            <MinusCircle className="h-4 w-4" />
            Withdraw
          </Link>
          <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
            <ArrowLeftRight className="h-4 w-4" />
            Transfer
          </button>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: Bot, label: "Bot Trade" },
            { icon: CircleDollarSign, label: "Token" },
            { icon: CalendarCheck, label: "Check In" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className="card-glass p-4 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
            >
              <item.icon className="h-6 w-6 text-primary" />
              <span className="text-xs text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Asset Holdings */}
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Asset Holdings</h2>
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No asset holdings yet.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedWallet;
