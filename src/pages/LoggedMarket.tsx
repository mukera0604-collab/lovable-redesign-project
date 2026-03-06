import { useState } from "react";
import BottomNav from "@/components/BottomNav";

type TabType = "Coins" | "Commodities" | "Metals";

const coinsData = [
  { name: "Tether", symbol: "USDT", price: "$1", change: -0.01 },
  { name: "Bitcoin", symbol: "BTC", price: "$70,092", change: -3.12 },
  { name: "Ethereum", symbol: "ETH", price: "$2,052.74", change: -2.88 },
  { name: "USDC", symbol: "USDC", price: "$1", change: 0.01 },
  { name: "Solana", symbol: "SOL", price: "$86.54", change: -5.26 },
  { name: "XRP", symbol: "XRP", price: "$1.39", change: -2.33 },
  { name: "USD1", symbol: "USD1", price: "$0.999", change: 0.05 },
  { name: "BNB", symbol: "BNB", price: "$639.2", change: -2.42 },
  { name: "Dogecoin", symbol: "DOGE", price: "$0.093", change: -2.20 },
  { name: "Tether Gold", symbol: "XAUT", price: "$5,078.68", change: -0.36 },
  { name: "Sui", symbol: "SUI", price: "$0.936", change: -2.96 },
];

const LoggedMarket = () => {
  const [tab, setTab] = useState<TabType>("Coins");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-2">
          Web3 Derp Markets
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-8">
          Track real-time crypto, commodities, and metals prices
        </p>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-border">
          {(["Coins", "Commodities", "Metals"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card-glass overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Name</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Symbol</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Last Price (USD)</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">24h Change</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Holdings</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">P/L %</th>
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tab === "Coins" &&
                coinsData.map((coin) => (
                  <tr key={coin.symbol} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-4 text-sm text-foreground">{coin.name}</td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">{coin.symbol}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{coin.price}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          coin.change >= 0
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {coin.change >= 0 ? "" : ""}{coin.change}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">—</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">—</td>
                    <td className="px-4 py-4">
                      <button className="px-4 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              {tab !== "Coins" && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No {tab.toLowerCase()} data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LoggedMarket;
