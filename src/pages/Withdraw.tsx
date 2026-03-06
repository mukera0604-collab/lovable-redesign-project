import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, push, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";

const Withdraw = () => {
  const { user, profile } = useAuth();
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!user || !profile) return;
    const withdrawAmount = parseFloat(amount);
   


      
      alert("Can not withdraw there is pending order .");
    return;
    
    if (!network || !address || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please fill in all fields with valid data.");
      return;
    }

    if (profile.balance < withdrawAmount) {
      alert("Insufficient balance.");
      return;
    }

    setLoading(true);
    try {
      // Record transaction
      const transactionRef = ref(rtdb, `transactions/${user.uid}`);
      const newTransaction = {
        type: "Withdraw",
        network,
        amount: withdrawAmount,
        address,
        timestamp: Date.now(),
        status: "Pending"
      };
      await push(transactionRef, newTransaction);

      // Deduct balance
      const balanceRef = ref(rtdb, `users/${user.uid}/balance`);
      await set(balanceRef, profile.balance - withdrawAmount);

      alert("Withdrawal request submitted successfully!");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Withdraw error:", error);
      alert("Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

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
              <option value="polygon">Polygon (POL)</option>
              <option value="solana">Solana (SOL)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Your Wallet Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter withdrawal amount"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full py-3 rounded-lg gradient-cta text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Withdrawal Request"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdraw;
