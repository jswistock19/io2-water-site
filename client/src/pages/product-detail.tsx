import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplets, Star, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw, CheckCircle2 } from "lucide-react";
import type { Product, Review } from "@shared/schema";
import { useState } from "react";

export default function ProductDetail() {
  const params = useParams();
  const id = params.id;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews", product?.id],
    enabled: !!product?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-12 bg-muted rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl mb-4">Product Not Found</h1>
          <Link href="/store"><Button>Back to Store</Button></Link>
        </div>
      </div>
    );
  }

  const effectivePrice = isSubscription && product.subscriptionPrice
    ? product.subscriptionPrice
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/store" className="hover:text-foreground">Store</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Droplets className="h-24 w-24 text-primary/30" />
              )}
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{product.badge}</Badge>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Reviews count */}
              {product.reviewCount && product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-3" data-testid="text-review-count">
                  <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}</div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
              )}

              <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-2" data-testid="text-product-name">{product.name}</h1>
              <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-bold text-3xl" data-testid="text-product-price">${effectivePrice.toFixed(2)}</span>
                  {product.comparePrice && (
                    <span className="text-lg text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</span>
                  )}
                  {isSubscription && <Badge className="bg-primary/10 text-primary border-0">Save 20%</Badge>}
                </div>
                {product.unitCount && product.unitCount > 1 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ${(effectivePrice / product.unitCount).toFixed(2)}/bottle · {product.unitSize} × {product.unitCount}
                  </p>
                )}
              </div>

              {/* Subscription toggle */}
              {product.subscriptionPrice && (
                <div className="mb-6 space-y-3">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${!isSubscription ? "border-primary bg-primary/5" : "border-border"}`}
                    data-testid="button-onetime"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">One-time Purchase</div>
                        <div className="text-xs text-muted-foreground">Ships in 2-3 business days</div>
                      </div>
                      <span className="font-display font-bold">${product.price.toFixed(2)}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${isSubscription ? "border-primary bg-primary/5" : "border-border"}`}
                    data-testid="button-subscribe"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          Subscribe & Save 20%
                          <Badge className="bg-primary text-primary-foreground text-xs">Recommended</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Free shipping · Cancel anytime</div>
                      </div>
                      <span className="font-display font-bold text-primary">${product.subscriptionPrice.toFixed(2)}</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} data-testid="button-qty-minus">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-sm" data-testid="text-quantity">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} data-testid="button-qty-plus">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                  onClick={() => addToCart(product.id, quantity, isSubscription)}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart — ${(effectivePrice * quantity).toFixed(2)}
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Truck, text: "Free shipping $50+" },
                  { icon: Shield, text: "Clinically validated" },
                  { icon: RefreshCw, text: "Easy returns" },
                ].map((badge) => (
                  <div key={badge.text} className="flex flex-col items-center text-center gap-2 p-3 bg-muted/50 rounded-xl">
                    <badge.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{badge.text}</span>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-sm mb-3">About this product</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          {reviews && reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display font-bold text-xl mb-6">Customer Reviews</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-5 bg-card border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}</div>
                      {review.verified && <Badge variant="outline" className="text-xs border-primary/20 text-primary">Verified</Badge>}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{review.body}</p>
                    <div className="text-xs text-muted-foreground">{review.name} · {review.createdAt}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
