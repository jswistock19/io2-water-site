import { Link } from "wouter";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Droplets } from "lucide-react";
import { getProductImage } from "@/lib/product-images";

export default function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeItem } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-bold text-3xl tracking-tight mb-2" data-testid="text-cart-title">Your Cart</h1>
          <p className="text-muted-foreground mb-8">{itemCount} {itemCount === 1 ? "item" : "items"}</p>

          {items.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl mb-2">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground mb-6">Add some premium oxygen-enriched water to get started.</p>
              <Link href="/store">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-start-shopping">
                  Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const price = item.isSubscription && item.product?.subscriptionPrice
                    ? item.product.subscriptionPrice
                    : (item.product?.price || 0);
                  return (
                    <Card key={item.id} className="p-5 bg-card border-border" data-testid={`card-cart-item-${item.id}`}>
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {getProductImage(item.product?.imageUrl) ? (
                            <img src={getProductImage(item.product?.imageUrl)} alt={item.product?.name} className="w-full h-full object-cover" />
                          ) : (
                            <Droplets className="h-8 w-8 text-primary/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-sm">{item.product?.name}</h3>
                              {item.isSubscription && (
                                <Badge className="mt-1 bg-primary/10 text-primary border-0 text-xs">Monthly Subscription</Badge>
                              )}
                            </div>
                            <span className="font-display font-bold text-sm">${(price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-border rounded-lg">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Order summary */}
              <div>
                <Card className="p-6 bg-card border-border sticky top-24">
                  <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shipping === 0 ? <span className="text-primary">Free</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="font-display">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground mt-3">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
                  )}
                  <Link href="/checkout">
                    <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold" data-testid="button-checkout">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/store">
                    <Button variant="ghost" className="w-full mt-2 text-sm">
                      Continue Shopping
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
