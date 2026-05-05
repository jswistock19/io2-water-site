import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location === "/";

  const scrollTo = (id: string) => {
    if (isLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all border-b ${
      isLanding ? "bg-white/95 backdrop-blur-xl border-gray-100/80" : "bg-white border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative" data-testid="link-logo">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="iO2 Water Logo">
                <circle cx="18" cy="18" r="16" stroke="hsl(213 80% 40%)" strokeWidth="2.5" fill="none" />
                <circle cx="18" cy="18" r="8" fill="hsl(213 80% 40%)" opacity="0.12" />
                <circle cx="18" cy="18" r="4" fill="hsl(213 80% 40%)" />
                <path d="M18 2 Q26 10 18 18 Q10 10 18 2" fill="hsl(213 80% 40%)" opacity="0.3" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-gray-900">
              iO<span className="text-blue-700">2</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollTo('science')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              data-testid="link-science"
            >
              Science
            </button>
            <button
              onClick={() => scrollTo('benefits')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              data-testid="link-benefits"
            >
              Benefits
            </button>
            <Link href="/store" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium" data-testid="link-store">
              Store
            </Link>
            <button
              onClick={() => scrollTo('wholesale')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              data-testid="link-wholesale"
            >
              Wholesale
            </button>
            <button
              onClick={() => scrollTo('team')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Team
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/cart" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-700 text-white">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/store" className="hidden md:block">
              <Button size="sm" className="bg-blue-700 text-white hover:bg-blue-800 font-semibold" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600"
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
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-1">
          <button onClick={() => scrollTo('science')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Science</button>
          <button onClick={() => scrollTo('benefits')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Benefits</button>
          <Link href="/store" onClick={() => setMobileOpen(false)} className="block text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Store</Link>
          <button onClick={() => scrollTo('wholesale')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Wholesale</button>
          <button onClick={() => scrollTo('team')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Team</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">FAQ</button>
          <button onClick={() => scrollTo('contact')} className="block w-full text-left text-sm py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-600">Contact</button>
          <div className="pt-2">
            <Link href="/store" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">Shop Now</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
