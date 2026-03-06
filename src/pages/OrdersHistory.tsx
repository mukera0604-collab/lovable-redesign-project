import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ClipboardList, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/lib/firebase";

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

const OrdersHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const ordersRef = ref(rtdb, `orders/${user.uid}`);
        const unsubscribe = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const ordersList = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val,
                })).sort((a, b) => b.startTime - a.startTime);
                setOrders(ordersList);
            } else {
                setOrders([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const getOrderStatus = (order: Order) => {
        const isExpired = Date.now() >= order.endTime;
        return isExpired ? "Closed" : "Open";
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="container mx-auto px-4 py-8 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/trade" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-foreground" />
                    </Link>
                    <h1 className="text-xl font-display font-bold text-foreground">Trading Orders</h1>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="card-glass p-12 text-center">
                            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground text-sm">No orders found</p>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const status = getOrderStatus(order);
                            return (
                                <div key={order.id} className="card-glass p-4 flex justify-between items-center group hover:border-primary/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-bold ${order.type === "Buy" ? "text-accent" : "text-destructive"}`}>
                                                {order.type} {order.pair}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                                {order.period}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs text-muted-foreground">
                                                Start: {new Date(order.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                End: {new Date(order.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold block text-sm">${order.amount.toFixed(2)}</span>
                                        <span className="text-[10px] text-accent block mb-1">+{order.profit} Profit</span>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${status === "Open" ? "bg-primary/20 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"
                                            }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default OrdersHistory;
