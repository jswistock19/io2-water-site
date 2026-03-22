import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";

export default function Checkout() {
  const { items, subtotal, itemCount } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orderComplete, setOrderComplete] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", state: "", zip: "",
  });

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/checkout", form);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setOrderComplete(true);
    },
    onError: (err: Error) => {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    },
  });

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight mb-4" data-testid="text-order-confirmed">Order Confirmed</h1>
          <p className="text-muted-foreground mb-8">Your order has been placed. You'll receive a confirmation email shortly.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard"><Button variant="outline">View Dashboard</Button></Link>
            <Link href="/store"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Continue Shopping</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl mb-4">Nothing to checkout</h1>
          <Link href="/store"><Button className="bg-primary text-primary-foreground">Go to Store</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-bold text-3xl tracking-tight mb-8" data-testid="text-checkout-title">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card border-border">
                <h2 className="font-semibold text-lg mb-6">Shipping Information</h2>
                <form onSubmit={(e) => { e.preventDefault(); checkoutMutation.mutate(); }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required data-testid="input-shipping-name" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required data-testid="input-shipping-email" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm">Address</Label>
                    <Input id="address" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} required data-testid="input-shipping-address" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">City</Label>
                      <Input id="city" value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} required data-testid="input-shipping-city" />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm">State</Label>
                      <Input id="state" value={form.state} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))} required data-testid="input-shipping-state" />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm">ZIP</Label>
                      <Input id="zip" value={form.zip} onChange={(e) => setForm(f => ({ ...f, zip: e.target.value }))} required data-testid="input-shipping-zip" />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Lock className="h-4 w-4" />
                    <span>Payment processing is simulated for this demo</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                    disabled={checkoutMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {checkoutMutation.isPending ? "Processing..." : `Place Order — $${total.toFixed(2)}`}
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card className="p-6 bg-card border-border sticky top-24">
                <h3 className="font-semibold text-sm mb-4">Order Summary ({itemCount} items)</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const price = item.isSubscription && item.product?.subscriptionPrice
                      ? item.product.subscriptionPrice
                      : (item.product?.price || 0);
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">{item.product?.name} × {item.quantity}</span>
                        <span className="font-medium">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-primary">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base"><span>Total</span><span className="font-display">${total.toFixed(2)}</span></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
