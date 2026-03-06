import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const pairs = [
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
  { value: "SOL", label: "SOL - Solana" },
  { value: "BNB", label: "BNB - BNB" },
];

const periods = [
  { duration: "60s", profit: "10%", limit: "$300" },
  { duration: "120s", profit: "15%", limit: "$5000" },
  { duration: "180s", profit: "20%", limit: "$20000" },
  { duration: "240s", profit: "27%", limit: "$40000" },
  { duration: "360s", profit: "30%", limit: "$100000" },
];

const LoggedTrade = () => {
  const [selectedPair, setSelectedPair] = useState("BTC");
  const [selectedPeriod, setSelectedPeriod] = useState("60s");
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="card-glass p-6">
          {/* Pair selector */}
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="w-auto px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          >
            {pairs.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Chart placeholder */}
          <div className="card-glass p-4 mb-6 min-h-[220px] flex items-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[hsl(30,100%,50%)] flex items-center justify-center text-xs font-bold text-foreground">₿</div>
              <span className="text-sm font-medium text-foreground">
                {selectedPair} / USDT
              </span>
            </div>
          </div>

          {/* Period selection */}
          <h3 className="text-sm font-medium text-foreground mb-3">Select Period</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {periods.map((p) => (
              <button
                key={p.duration}
                onClick={() => setSelectedPeriod(p.duration)}
                className={`px-4 py-3 rounded-lg border text-center min-w-[80px] transition-colors ${
                  selectedPeriod === p.duration
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-secondary text-foreground hover:border-primary/40"
                }`}
              >
                <span className="block text-sm font-bold">{p.duration}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{p.profit} - Limit</span>
                <span className="block text-xs text-muted-foreground">{p.limit}</span>
              </button>
            ))}
          </div>

          {/* Amount */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (USDT)"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />

          {/* Buy/Sell buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
              Sell
            </button>
            <button className="py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
              Buy
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedTrade;
