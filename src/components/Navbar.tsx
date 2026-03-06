import { Link, useLocation, useNavigate } from "react-router-dom";
import { Hexagon, User, Settings, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isDashboard = ["/deposit", "/withdraw", "/dashboard", "/markets", "/trade", "/wallet", "/rewards"].includes(location.pathname);

  return (
    <nav className="nav-gradient sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-display font-bold text-foreground">derp</span>
        </Link>

        {!isDashboard && (
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

        {isDashboard && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                <span className="text-muted-foreground text-lg">👤</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2 bg-card border-border">
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
                onClick={() => navigate("/login")}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-secondary transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
