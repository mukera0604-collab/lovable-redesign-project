import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const Deposit = () => {
  const [network, setNetwork] = useState("");
  const walletAddress = "bc1qgqftn67w79laye6p2ehechmImlepd9ctjg88vs";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 pb-24">
      <div className="card-glass p-10 w-full max-w-md glow-purple">
        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-6">Deposit Funds</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Choose Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Select Network --</option>
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ERC-20)</option>
              <option value="bsc">BSC (BEP-20)</option>
              <option value="tron">Tron (TRC-20)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Deposit To Wallet</label>
            <div className="flex items-center rounded-lg bg-secondary border border-border overflow-hidden">
              <span className="flex-1 px-4 py-3 text-foreground text-sm truncate">{walletAddress}</span>
              <button
                onClick={copyAddress}
                className="px-4 py-3 bg-card text-foreground text-sm font-medium border-l border-border hover:bg-muted transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Amount ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button className="w-full py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
            Proceed to Deposit
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Deposit;
