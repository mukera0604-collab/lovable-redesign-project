import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const networkAddresses: Record<string, string> = {
  btc: "bc1qdmkkke7xn0ttsqw2f2va38zkluu7gtrd0v486w",
  eth: "0xa83c905a85c5985fb50bc9d6ad01ee8234989624",
  bsc: "0xa83c905a85c5985fb50bc9d6ad01ee8234989624",
  tron: "TK4acMVuTCkVjYadHnusZMf8UT2bj5xrbk",
  polygon: "0xa83c905a85c5985fb50bc9d6ad01ee8234989624",
  solana: "ADheKPKXRyQrm5VPLnAUd5i6vboWToZ7ZXPsxkoupWa5"
};

const Deposit = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate();
  const walletAddress = network ? networkAddresses[network] : "Please select a network";

  const copyAddress = () => {
    if (network) {
      navigator.clipboard.writeText(walletAddress);
      alert("Address copied to clipboard!");
    } else {
      alert("Please select a network first.");
    }
  };

  const handleDeposit = async () => {
    if (!user) return;
    if (!network || !amount) {
      alert("Please select a network and enter an amount.");
      return;
    }

    setLoading(true);
    try {
      const transactionRef = ref(rtdb, `transactions/${user.uid}`);
      const newTransaction = {
        type: "Deposit",
        network,
        amount: parseFloat(amount),
        address: walletAddress,
        timestamp: Date.now(),
        status: "Pending"
      };
      await push(transactionRef, newTransaction);

      setAmount("");
      navigate("/transactions");
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to submit deposit request.");
    } finally {
      setLoading(false);
    }
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
              <option value="polygon">Polygon (POL)</option>
              <option value="solana">Solana (SOL)</option>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Processing..." : "Proceed to Deposit"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Deposit;
