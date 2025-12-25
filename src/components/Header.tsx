import { Search, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { state: authState, logout } = useAuth();
  const { state: storeState } = useStore();

  const navLinks = [
    { name: "Wireless Adapters", href: "#wireless" },
    { name: "USB Hubs & Docks", href: "#hubs" },
    { name: "CarTech", href: "#cartech" },
  ];

  return (
    <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-lg border-border border-b">
      <div className="mx-auto px-4 py-4 container">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <a href="/" className="group flex items-center gap-2">
            {storeState.store?.photo ? (
              <img
                src={storeState.store.photo}
                alt={storeState.store.name}
                className="rounded-xl w-10 h-10 object-cover"
              />
            ) : (
              <div className="flex justify-center items-center bg-primary rounded-xl w-10 h-10">
                <span className="font-bold text-primary-foreground text-lg">
                  {storeState.store?.name?.charAt(0) || "C"}
                </span>
              </div>
            )}
            <span className="font-bold text-foreground group-hover:text-primary text-xl tracking-tight transition-colors">
              {storeState.store?.name || "CONNECT HUB"}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm nav-link">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-4 max-w-md">
            <div className="relative w-full">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-secondary pr-4 pl-10 border border-transparent focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full h-10 text-sm transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {authState.user ? (
              <div className="flex items-center gap-2">
                <Link to="/account">
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <span className="hidden sm:inline text-muted-foreground text-sm">
                  Welcome, {authState.user.firstname}
                </span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <span className="-top-1 -right-1 absolute flex justify-center items-center bg-primary rounded-full w-5 h-5 font-medium text-primary-foreground text-xs">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 pb-2 border-border border-t animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="py-2 font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t">
                {authState.user ? (
                  <>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        <User className="mr-2 w-4 h-4" />
                        Account
                      </Button>
                    </Link>
                    <span className="text-muted-foreground text-sm">
                      Welcome, {authState.user.firstname}
                    </span>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      <LogOut className="mr-2 w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm">
                      <User className="mr-2 w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
              <div className="relative mt-2">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-secondary pr-4 pl-10 border border-transparent focus:border-primary rounded-lg focus:outline-none w-full h-10 text-sm"
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
