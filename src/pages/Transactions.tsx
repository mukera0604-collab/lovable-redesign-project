import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";

interface Transaction {
    id: string;
    type: "Deposit" | "Withdraw";
    amount: number;
    network: string;
    address: string;
    timestamp: number;
    status: "Pending" | "Completed" | "Failed";
}

const Transactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const transactionRef = ref(rtdb, `transactions/${user.uid}`);
        const unsubscribe = onValue(transactionRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const txList = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val,
                })).sort((a, b) => b.timestamp - a.timestamp);
                setTransactions(txList);
            } else {
                setTransactions([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="container mx-auto px-4 py-8 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/dashboard" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-foreground" />
                    </Link>
                    <h1 className="text-xl font-display font-bold text-foreground">Transaction History</h1>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="card-glass p-12 text-center">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground text-sm">No transactions found</p>
                        </div>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.id} className="card-glass p-5 flex items-center justify-between group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${tx.type === "Deposit" ? "bg-accent/10" : "bg-destructive/10"
                                        }`}>
                                        {tx.type === "Deposit" ? (
                                            <ArrowDownCircle className="h-6 w-6 text-accent" />
                                        ) : (
                                            <ArrowUpCircle className="h-6 w-6 text-destructive" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">{tx.type}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(tx.timestamp).toLocaleDateString()} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold block ${tx.type === "Deposit" ? "text-accent" : "text-destructive"}`}>
                                        {tx.type === "Deposit" ? "+" : "-"}${tx.amount.toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded ${tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" :
                                        tx.status === "Completed" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                                        }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default Transactions;
