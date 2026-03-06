import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push, set, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";

const pairs = [
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
  { value: "SOL", label: "SOL - Solana" },
  { value: "BNB", label: "BNB - BNB" },
];

const periods = [
  { duration: "60s", seconds: 60, profit: "10%", limit: 300 },
  { duration: "120s", seconds: 120, profit: "15%", limit: 5000 },
  { duration: "180s", seconds: 180, profit: "20%", limit: 20000 },
  { duration: "240s", seconds: 240, profit: "27%", limit: 40000 },
  { duration: "360s", seconds: 360, profit: "30%", limit: 100000 },
];

interface Order {
  id: string;
  pair: string;
  type: "Buy" | "Sell";
  amount: number;
  period: string;
  profit: string;
  startTime: number;
  endTime: number;
  status: "Open" | "Closed";
}

const LoggedTrade = () => {
  const { user, profile } = useAuth();
  const [selectedPair, setSelectedPair] = useState("BTC");
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrade = async (type: "Buy" | "Sell") => {
    if (!user || !profile) return;
    const tradeAmount = parseFloat(amount);

    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (profile.balance < tradeAmount) {
      alert("Insufficient balance.");
      return;
    }

    if (profile.balance < selectedPeriod.limit) {
      alert(`Your balance must be greater than $${selectedPeriod.limit} to trade in this period.`);
      return;
    }

    setLoading(true);
    try {
      const startTime = Date.now();
      const endTime = startTime + selectedPeriod.seconds * 1000;

      const newOrder = {
        pair: selectedPair,
        type,
        amount: tradeAmount,
        period: selectedPeriod.duration,
        profit: selectedPeriod.profit,
        startTime,
        endTime,
        status: "Open",
      };

      // Push order to RTDB
      const ordersRef = ref(rtdb, `orders/${user.uid}`);
      const orderPushRef = push(ordersRef);
      await set(orderPushRef, newOrder);

      // Deduct balance
      const balanceRef = ref(rtdb, `users/${user.uid}/balance`);
      await set(balanceRef, profile.balance - tradeAmount);

      setAmount("");
      alert(`${type} order placed successfully!`);
    } catch (error) {
      console.error("Trade error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-auto px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {pairs.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Balance</span>
              <span className="text-sm font-bold text-foreground">${profile?.balance?.toLocaleString() ?? "0.00"}</span>
            </div>
          </div>

          <div className="card-glass p-0 mb-6 min-h-[300px] overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-[hsl(30,100%,50%)] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {selectedPair === "BTC" ? "₿" : selectedPair[0]}
              </div>
              <span className="text-sm font-bold text-white drop-shadow-md">
                {selectedPair} / USDT
              </span>
            </div>
            <iframe
              key={`${selectedPair}-chart`}
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76231&symbol=BINANCE:${selectedPair}USDT&interval=1&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE:${selectedPair}USDT`}
              style={{ width: "100%", height: "300px", border: "none" }}
              title={`${selectedPair} Chart`}
            />
          </div>

          <h3 className="text-sm font-medium text-foreground mb-3">Select Period</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {periods.map((p) => (
              <button
                key={p.duration}
                onClick={() => setSelectedPeriod(p)}
                className={`px-2 py-3 rounded-lg border text-center transition-colors ${selectedPeriod.duration === p.duration
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-secondary text-foreground hover:border-primary/40"
                  }`}
              >
                <span className="block text-sm font-bold">{p.duration}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">{p.profit} Profit</span>
                <span className="block text-[10px] text-muted-foreground">${p.limit} Limit</span>
              </button>
            ))}
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (USDT)"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleTrade("Sell")}
              disabled={loading}
              className="py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : "Sell"}
            </button>
            <button
              onClick={() => handleTrade("Buy")}
              disabled={loading}
              className="py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : "Buy"}
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedTrade;
