import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Droplets, Star, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@shared/schema";
import { useState } from "react";
import { getProductImage } from "@/lib/product-images";

function ProductCard({ product }: { product: Product }) {
  const { addToCart, isAdding } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, product.isSubscription || false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const pricePerUnit = product.unitCount && product.unitCount > 1
    ? (product.price / product.unitCount).toFixed(2)
    : null;

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/30 transition-all group h-full flex flex-col" data-testid={`card-product-${product.id}`}>
      <Link href={`/store/${product.slug}`} className="block">
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
          {getProductImage(product.imageUrl) ? (
            <img src={getProductImage(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Droplets className="h-12 w-12 text-primary/30" />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <Badge className="bg-primary text-primary-foreground text-xs whitespace-nowrap w-fit">{product.badge}</Badge>
            )}
            {product.isSubscription && (
              <Badge className="bg-green-600 text-white text-xs whitespace-nowrap w-fit">Subscription</Badge>
            )}
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/store/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount?.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-lg">${product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-xs text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>
            {pricePerUnit && (
              <p className="text-xs text-muted-foreground">${pricePerUnit}/unit · {product.unitSize} × {product.unitCount}</p>
            )}
            {product.isSubscription && (
              <p className="text-xs text-primary font-medium">/month · Free Shipping</p>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            className={`transition-all ${added ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90"} text-primary-foreground`}
            data-testid={`button-add-${product.id}`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Store() {
  const { data: products, isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  const singles = products?.filter(p => p.category === "singles") || [];
  const bundles = products?.filter(p => p.category === "bundles") || [];
  const subs = products?.filter(p => p.category === "subscriptions") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2" data-testid="text-store-title">The iO2 Store</h1>
            <p className="text-muted-foreground">Premium oxygen-enriched water. Choose your formula, choose your plan.</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8 bg-muted">
              <TabsTrigger value="all" data-testid="tab-all">All Products</TabsTrigger>
              <TabsTrigger value="singles" data-testid="tab-singles">Singles</TabsTrigger>
              <TabsTrigger value="bundles" data-testid="tab-bundles">Bundles</TabsTrigger>
              <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">Subscribe & Save</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>

            <TabsContent value="singles">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {singles.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>

            <TabsContent value="bundles">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>

            <TabsContent value="subscriptions">
              <div className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
                <h3 className="font-display font-bold text-xl mb-2">Why Subscribe?</h3>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div className="text-sm"><span className="font-semibold text-primary">Save 20%</span> vs. one-time purchase</div>
                  <div className="text-sm"><span className="font-semibold text-primary">Free Shipping</span> on every delivery</div>
                  <div className="text-sm"><span className="font-semibold text-primary">Free Bottle</span> with your first order</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subs.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <Card key={i} className="overflow-hidden bg-card">
                  <div className="aspect-[4/3] bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-full" />
                    <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
