import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ClipboardList, Receipt } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { ref, onValue, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  pair: string;
  type: "Buy" | "Sell";
  amount: number;
  period: string;
  profitPercent: number;
  startTime: number;
  endTime: number;
  status: "Open" | "Closed";
  result?: string;
  grossPayout?: number;
  fees?: number;
  netPnL?: number;
  balanceBefore?: number;
  balanceAfter?: number;
}

const OrdersHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, `orders/${user.uid}`);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ordersList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        })).sort((a: any, b: any) => b.startTime - a.startTime);

        const now = Date.now();
        ordersList.forEach((order: any) => {
          if (order.status === "Open" && now >= order.endTime) {
            const orderRef = ref(rtdb, `orders/${user.uid}/${order.id}`);
            update(orderRef, { status: "Closed" });
          }
        });

        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getDisplayStatus = (order: Order) => {
    if (order.status === "Closed") return "Closed";
    return Date.now() >= order.endTime ? "Closed" : "Open";
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
              const status = getDisplayStatus(order);
              return (
                <div
                  key={order.id}
                  onClick={() => status === "Closed" && order.result ? setSelectedOrder(order) : null}
                  className={`card-glass p-4 flex justify-between items-center group hover:border-primary/30 transition-colors ${status === "Closed" && order.result ? "cursor-pointer" : ""}`}
                >
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
                    <span className="text-[10px] text-accent block mb-1">+{order.profitPercent ?? 0}% Profit</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${status === "Open" ? "bg-primary/20 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Trade Receipt Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
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
                {selectedOrder?.result}
              </span>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-2">
              <div className="card-glass p-4 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Trade Details</h4>
                {[
                  ["Trade ID", selectedOrder.id.slice(-6)],
                  ["Pair", `${selectedOrder.pair} / USDT`],
                  ["Direction", selectedOrder.type.toUpperCase()],
                  ["Amount", `${selectedOrder.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Duration", `${selectedOrder.period}`],
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
                  ["Result", selectedOrder.result ?? "-"],
                  ["Gross Payout", `${(selectedOrder.grossPayout ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Fees", `${(selectedOrder.fees ?? 0).toFixed(2)} USDT`],
                  ["Net P&L", `${(selectedOrder.netPnL ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Balance (Before)", `${(selectedOrder.balanceBefore ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
                  ["Balance (After)", `${(selectedOrder.balanceAfter ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`],
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

export default OrdersHistory;
