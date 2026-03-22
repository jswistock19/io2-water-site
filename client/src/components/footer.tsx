import { Link } from "wouter";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="iO2 Water">
                <circle cx="18" cy="18" r="16" stroke="hsl(192 100% 50%)" strokeWidth="2" fill="none" />
                <circle cx="18" cy="18" r="4" fill="hsl(192 100% 50%)" />
              </svg>
              <span className="font-display font-bold">iO<span className="text-primary">2</span></span>
            </div>
            <p className="text-sm text-muted-foreground">Don't Just Hydrate. Oxygenate.</p>
            <p className="text-xs text-muted-foreground mt-2">Powered by patented MohrO2 technology.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Shop</h4>
            <div className="space-y-2">
              <Link href="/store" className="block text-sm text-muted-foreground hover:text-foreground">All Products</Link>
              <Link href="/store" className="block text-sm text-muted-foreground hover:text-foreground">Bundles</Link>
              <Link href="/store" className="block text-sm text-muted-foreground hover:text-foreground">Subscriptions</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">About Oxira</span>
              <span className="block text-sm text-muted-foreground">Our Science</span>
              <span className="block text-sm text-muted-foreground">Lab Reports</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Contact Us</span>
              <span className="block text-sm text-muted-foreground">Shipping & Returns</span>
              <span className="block text-sm text-muted-foreground">FAQ</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; 2026 Oxira Inc. All rights reserved. iO2 Water is not intended to diagnose, treat, cure, or prevent any disease.</p>
          <PerplexityAttribution />
        </div>
      </div>
    </footer>
  );
}
