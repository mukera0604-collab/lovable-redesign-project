import BottomNav from "@/components/BottomNav";
import { Gift } from "lucide-react";

const Rewards = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <Gift className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Rewards</h1>
        <p className="text-muted-foreground text-sm">Coming Soon</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default Rewards;
