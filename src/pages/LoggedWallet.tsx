import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Download, ArrowLeftRight, Bot, CircleDollarSign, Gift, Settings } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, get, set } from "firebase/database";
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

  const totalBalance = (profile?.balance ?? 0) + (profile?.tradeBalance ?? 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Total Balance */}
        <div className="text-center mb-8 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3">Total Balance</p>
          <p className="text-4xl font-display font-bold text-foreground">
            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-lg font-normal text-muted-foreground ml-2">USDT</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ≈ ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </p>
        </div>

        {/* Deposit / Withdraw / Transfer */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 py-4 rounded-xl gradient-cta text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="h-5 w-5" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 py-4 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
          >
            <Download className="h-5 w-5" />
            Withdraw
          </Link>
          <button className="flex items-center justify-center gap-2 py-4 rounded-xl border border-border bg-secondary/50 text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
            <ArrowLeftRight className="h-5 w-5" />
            Transfer
          </button>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: Bot, label: "Bot Trade" },
            { icon: CircleDollarSign, label: "Token" },
            { icon: Gift, label: "Check In" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className="card-glass p-5 flex flex-col items-center gap-2.5 rounded-xl hover:border-primary/40 transition-colors"
            >
              <item.icon className="h-7 w-7 text-primary" />
              <span className="text-xs text-foreground font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Asset Holdings */}
        <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.15em] mb-4">Asset Holdings</h2>
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground italic">No asset holdings yet.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedWallet;
