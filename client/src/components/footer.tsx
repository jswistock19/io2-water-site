import { Link } from "wouter";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="iO2 Water">
                <circle cx="18" cy="18" r="16" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <circle cx="18" cy="18" r="4" fill="#3b82f6" />
              </svg>
              <span className="font-display font-bold text-white">iO<span className="text-blue-400">2</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Next-Generation Functional Hydration.</p>
            <p className="text-xs text-gray-500 mb-4">Elevated dissolved oxygen hydration — engineered for performance, recovery, and daily use.</p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "TikTok", href: "#" },
                { label: "X", href: "#" },
              ].map(s => (
                <a key={s.label} href={s.href} className="text-xs text-gray-500 hover:text-blue-400 transition-colors">{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Shop</h4>
            <div className="space-y-2">
              <Link href="/store" className="block text-sm text-gray-400 hover:text-white transition-colors">All Products</Link>
              <Link href="/store" className="block text-sm text-gray-400 hover:text-white transition-colors">12-Pack Cases</Link>
              <Link href="/store" className="block text-sm text-gray-400 hover:text-white transition-colors">Subscriptions</Link>
              <Link href="/store" className="block text-sm text-gray-400 hover:text-white transition-colors">Wholesale</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-gray-400">About iO2</span>
              <span className="block text-sm text-gray-400">Our Science</span>
              <span className="block text-sm text-gray-400">Technology</span>
              <span className="block text-sm text-gray-400">Partnerships</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:hello@drinkiO2.com" className="block text-sm text-gray-400 hover:text-white transition-colors">hello@drinkiO2.com</a>
              <a href="https://DrinkiO2.com" className="block text-sm text-gray-400 hover:text-white transition-colors">DrinkiO2.com</a>
              <span className="block text-sm text-gray-400">Wholesale Inquiries</span>
              <span className="block text-sm text-gray-400">FAQ</span>
            </div>
          </div>
        </div>

        {/* Standards bar */}
        <div className="border-t border-gray-800 py-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            {["Non-GMO", "BPA-Free", "No Artificial Additives", "Recyclable Packaging", "Plastic-Free Production", "Physician Endorsed", "Patented Technology"].map(s => (
              <span key={s} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-blue-400 inline-block" />
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; 2026 iO2 Technologies. All rights reserved. DrinkiO2.com<br />
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <PerplexityAttribution />
        </div>
      </div>
    </footer>
  );
}
