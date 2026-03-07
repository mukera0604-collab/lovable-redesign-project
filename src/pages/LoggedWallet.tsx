import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, MinusCircle, ArrowLeftRight, Bot, CircleDollarSign, CalendarCheck, Settings } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, get, set, query, orderByChild, limitToLast } from "firebase/database";
import { rtdb } from "@/lib/firebase";

const LoggedWallet = () => {
  const { user, profile } = useAuth();

  // Sync tradeBalance from last closed order's balanceAfter
  useEffect(() => {
    if (!user) return;
    const ordersRef = ref(rtdb, `orders/${user.uid}`);
    get(ordersRef).then((snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const closedOrders = Object.values(data)
        .filter((o: any) => o.status === "Closed" && o.balanceAfter !== undefined)
        .sort((a: any, b: any) => b.endTime - a.endTime);
      if (closedOrders.length > 0) {
        const lastBalanceAfter = (closedOrders[0] as any).balanceAfter;
        set(ref(rtdb, `users/${user.uid}/tradeBalance`), lastBalanceAfter);
      }
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-glass p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Balance</p>
            <p className="text-2xl font-display font-bold text-foreground">
              {profile?.balance?.toLocaleString() ?? "0.00"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">USDT</p>
          </div>
          <div className="card-glass p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Trade Balance</p>
            <p className="text-2xl font-display font-bold text-primary">
              {profile?.tradeBalance?.toLocaleString() ?? "0.00"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">USDT</p>
          </div>
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
