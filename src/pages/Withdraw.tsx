import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const Withdraw = () => {
  const [network, setNetwork] = useState("");

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 pb-24">
      <div className="card-glass p-10 w-full max-w-md glow-purple">
        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-6">Withdraw Funds</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Select Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Choose Network --</option>
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ERC-20)</option>
              <option value="bsc">BSC (BEP-20)</option>
              <option value="tron">Tron (TRC-20)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Your Wallet Address</label>
            <input
              type="text"
              placeholder="Enter your wallet address"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Amount ($)</label>
            <input
              type="number"
              placeholder="Enter withdrawal amount"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button className="w-full py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
            Submit Withdrawal Request
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdraw;
