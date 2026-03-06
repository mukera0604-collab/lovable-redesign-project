import { Link } from "react-router-dom";
import { Home, BarChart3, ArrowLeftRight, ClipboardList, Wallet } from "lucide-react";

const BottomNav = () => {
  const items = [
    { icon: Home, label: "Home", to: "/dashboard" },
    { icon: BarChart3, label: "Markets", to: "/markets" },
    { icon: ArrowLeftRight, label: "Trade", to: "/trade" },
    { icon: ClipboardList, label: "Orders", to: "#" },
    { icon: Wallet, label: "Wallet", to: "/wallet" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-3">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
