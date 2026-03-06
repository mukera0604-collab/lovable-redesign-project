import { Link, useLocation } from "react-router-dom";
import { Hexagon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isDashboard = ["/deposit", "/withdraw", "/dashboard", "/markets", "/trade", "/wallet"].includes(location.pathname);

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
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
            <span className="text-muted-foreground text-lg">👤</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
