import { Link, useLocation, useNavigate } from "react-router-dom";
import { Hexagon, User, Settings, LogOut, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const isDashboard = ["/deposit", "/withdraw", "/dashboard", "/markets", "/trade", "/wallet", "/rewards"].includes(location.pathname);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="nav-gradient sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://web3derp.pro/assets/web4_logo.png" className="h-8  text-primary" />

        </Link>

        {!isDashboard && !user && (
          <>
            <div className="hidden md:flex items-center gap-8">
              {["Markets", "Features", "Academy", "About"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg border border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-lg gradient-cta text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          </>
        )}

        {(isDashboard || user) && (
          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">${profile.balance.toLocaleString()}</span>
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-full border border-border hover:border-primary/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">
                      {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-foreground mr-1">
                    {profile?.name?.split(" ")[0] || "User"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2 bg-card border-border">
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                </div>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
