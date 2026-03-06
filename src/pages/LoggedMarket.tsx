import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";

type TabType = "Coins" | "Commodities" | "Metals";

const fetchCoins = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const LoggedMarket = () => {
  const [tab, setTab] = useState<TabType>("Coins");

  const { data: coins, isLoading, isError } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
    refetchInterval: 60000, // Refresh every minute
  });

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
              className={`pb-3 text-sm font-medium transition-colors ${tab === t
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
                <th className="text-left text-xs text-primary font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tab === "Coins" && isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              )}
              {tab === "Coins" && isError && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-destructive">
                    Failed to load market data. Please try again later.
                  </td>
                </tr>
              )}
              {tab === "Coins" &&
                coins?.map((coin: any) => (
                  <tr key={coin.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-4 text-sm text-foreground flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      {coin.name}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">{coin.symbol.toUpperCase()}</td>
                    <td className="px-4 py-4 text-sm text-foreground">${coin.current_price.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${coin.price_change_percentage_24h >= 0
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/20 text-destructive"
                          }`}
                      >
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>
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
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
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
