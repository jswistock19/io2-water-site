import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import Landing from "@/pages/landing";
import Store from "@/pages/store";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router hook={useHashLocation}>
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/store" component={Store} />
              <Route path="/store/:id" component={ProductDetail} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/admin" component={AdminDashboard} />
              <Route component={NotFound} />
            </Switch>
          </Router>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
