import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Droplets } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
      isLanding ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-background border-b border-border"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative" data-testid="link-logo">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="iO2 Water Logo">
                <circle cx="18" cy="18" r="16" stroke="hsl(192 100% 50%)" strokeWidth="2" fill="none" />
                <circle cx="18" cy="18" r="8" fill="hsl(192 100% 50%)" opacity="0.2" />
                <circle cx="18" cy="18" r="4" fill="hsl(192 100% 50%)" />
                <path d="M18 2 Q26 10 18 18 Q10 10 18 2" fill="hsl(192 100% 50%)" opacity="0.3" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              iO<span className="text-primary">2</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => { if (isLanding) document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-science"
            >
              Science
            </button>
            <button
              onClick={() => { if (isLanding) document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-benefits"
            >
              Benefits
            </button>
            <Link href="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-store">
              Store
            </Link>
            <button
              onClick={() => { if (isLanding) document.getElementById('wholesale')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-wholesale"
            >
              Wholesale
            </button>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-dashboard">
              Dashboard
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/cart" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/store" className="hidden md:block">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border p-4 space-y-3">
          <Link href="/store" onClick={() => setMobileOpen(false)} className="block text-sm py-2">Store</Link>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm py-2">Dashboard</Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-sm py-2">Admin</Link>
          <Link href="/store" onClick={() => setMobileOpen(false)}>
            <Button className="w-full bg-primary text-primary-foreground">Shop Now</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
