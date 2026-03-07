import { useState, useEffect, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push, set, onValue, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { X, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const pairs = [
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
  { value: "SOL", label: "SOL - Solana" },
  { value: "BNB", label: "BNB - BNB" },
];

const periods = [
  { duration: "60s", seconds: 60, profit: 10, limit: 300 },
  { duration: "120s", seconds: 120, profit: 15, limit: 5000 },
  { duration: "180s", seconds: 180, profit: 20, limit: 20000 },
  { duration: "240s", seconds: 240, profit: 27, limit: 40000 },
  { duration: "360s", seconds: 360, profit: 30, limit: 100000 },
];

interface TradeReceipt {
  tradeId: string;
  pair: string;
  type: "Buy" | "Sell";
  amount: number;
  duration: number;
  profitPercent: number;
  grossPayout: number;
  fees: number;
  netPnL: number;
  balanceBefore: number;
  balanceAfter: number;
  result: "WIN";
}

const LoggedTrade = () => {
  const { user, profile } = useAuth();
  const [selectedPair, setSelectedPair] = useState("BTC");
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Countdown dialog
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [activeTrade, setActiveTrade] = useState<{
    pair: string;
    type: "Buy" | "Sell";
    amount: number;
    totalSeconds: number;
    tradeId: string;
  } | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Receipt dialog
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<TradeReceipt | null>(null);

  // Countdown timer
  useEffect(() => {
    if (countdownOpen && countdownSeconds > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdownSeconds((s) => s - 1);
      }, 1000);
    } else if (countdownOpen && countdownSeconds === 0 && activeTrade) {
      // Timer finished — settle the trade
      settleTrade(activeTrade);
      setCountdownOpen(false);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdownOpen, countdownSeconds]);

  const settleTrade = async (trade: NonNullable<typeof activeTrade>) => {
    if (!user || !profile) return;

    const profitPercent = selectedPeriod.profit;
    const grossPayout = trade.amount * (profitPercent / 100);
    const fees = 0;
    const balanceBefore = profile.tradeBalance;
    const balanceAfter = balanceBefore + grossPayout;
    const netPnL = grossPayout - trade.amount;

    const receiptData: TradeReceipt = {
      tradeId: trade.tradeId,
      pair: trade.pair,
      type: trade.type,
      amount: trade.amount,
      duration: trade.totalSeconds,
      profitPercent,
      grossPayout,
      fees,
      netPnL,
      balanceBefore,
      balanceAfter,
      result: "WIN",
    };

    // Update order status to Closed and add settlement data
    const orderRef = ref(rtdb, `orders/${user.uid}/${trade.tradeId}`);
    await update(orderRef, {
      status: "Closed",
      result: "WIN",
      grossPayout,
      fees,
      netPnL,
      balanceBefore,
      balanceAfter,
    });

    // Update trade balance
    const tradeBalRef = ref(rtdb, `users/${user.uid}/tradeBalance`);
    await set(tradeBalRef, balanceAfter);

    setReceipt(receiptData);
    setActiveTrade(null);
    setReceiptOpen(true);
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleTrade = async (type: "Buy" | "Sell") => {
    if (!user || !profile) return;
    const tradeAmount = parseFloat(amount);

    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (profile.tradeBalance < tradeAmount) {
      alert("Insufficient trade balance.");
      return;
    }

    if (profile.tradeBalance < selectedPeriod.limit) {
      alert(`Your trade balance must be at least $${selectedPeriod.limit} to trade in this period.`);
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
        profitPercent: selectedPeriod.profit,
        startTime,
        endTime,
        status: "Open",
      };

      const ordersRef = ref(rtdb, `orders/${user.uid}`);
      const orderPushRef = push(ordersRef);
      const tradeId = orderPushRef.key!;
      await set(orderPushRef, newOrder);

      // Deduct from trade balance
      const tradeBalRef = ref(rtdb, `users/${user.uid}/tradeBalance`);
      await set(tradeBalRef, profile.tradeBalance - tradeAmount);

      setAmount("");

      // Start countdown
      setActiveTrade({
        pair: selectedPair,
        type,
        amount: tradeAmount,
        totalSeconds: selectedPeriod.seconds,
        tradeId,
      });
      setCountdownSeconds(selectedPeriod.seconds);
      setCountdownOpen(true);
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
              <span className="text-xs text-muted-foreground block">Trade Balance</span>
              <span className="text-sm font-bold text-foreground">${profile?.tradeBalance?.toLocaleString() ?? "0.00"}</span>
              <span className="text-xs text-muted-foreground block mt-1">Balance</span>
              <span className="text-xs text-foreground">${profile?.balance?.toLocaleString() ?? "0.00"}</span>
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
                <span className="block text-[10px] text-muted-foreground mt-0.5">{p.profit}% Profit</span>
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

      {/* Countdown Dialog */}
      <Dialog open={countdownOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm bg-[hsl(var(--card))] border-border" hideClose>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{activeTrade?.pair}/USDT</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${activeTrade?.type === "Buy" ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}>
                {activeTrade?.type?.toUpperCase()}
              </span>
            </div>
            <button onClick={() => setCountdownOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-6">
            <p className="text-5xl font-display font-bold text-foreground mb-6">
              {formatCountdown(countdownSeconds)}
            </p>
            <p className="text-sm text-muted-foreground">
              Amount: {activeTrade?.amount?.toLocaleString()} USDT
            </p>
            <p className="text-sm text-muted-foreground">
              Timer: {activeTrade?.totalSeconds} sec
            </p>
            <p className="text-sm text-accent font-medium mt-2">Running...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trade Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-sm bg-background border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary-foreground" />
                </div>
                <DialogTitle className="text-xl font-display">Trade Receipt</DialogTitle>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full border border-accent text-accent">
                {receipt?.result}
              </span>
            </div>
          </DialogHeader>

          {receipt && (
            <div className="space-y-6 mt-2">
              <div className="card-glass p-4 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Trade Details</h4>
                {[
                  ["Trade ID", receipt.tradeId.slice(-6)],
                  ["Pair", `${receipt.pair} / USDT`],
                  ["Direction", receipt.type.toUpperCase()],
                  ["Amount", `${receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Duration", `${receipt.duration} s`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="card-glass p-4 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Settlement Summary</h4>
                {[
                  ["Result", receipt.result],
                  ["Gross Payout", `${receipt.grossPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Fees", `${receipt.fees.toFixed(2)} USDT`],
                  ["Net P&L", `${receipt.netPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Balance (Before)", `${receipt.balanceBefore.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Balance (After)", `${receipt.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default LoggedTrade;
