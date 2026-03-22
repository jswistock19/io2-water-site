import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Package, TrendingUp, Droplets, RefreshCw, Calendar, Clock,
  CheckCircle2, Truck, XCircle, Pause, Play, ArrowRight,
  Activity, Brain, Zap, Heart, Star, Shield
} from "lucide-react";
import type { Order, Subscription, Product } from "@shared/schema";

interface SubscriptionWithProduct extends Subscription {
  product?: Product;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
    delivered: { className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
    shipped: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Truck },
    processing: { className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
    pending: { className: "bg-muted text-muted-foreground border-border", icon: Clock },
    cancelled: { className: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
    active: { className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
    paused: { className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Pause },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <Badge variant="outline" className={`${c.className} capitalize`}>
      <Icon className="h-3 w-3 mr-1" />{status}
    </Badge>
  );
}

function HealthScore() {
  const scores = [
    { label: "Hydration", value: 82, icon: Droplets, color: "text-cyan-500" },
    { label: "Recovery", value: 74, icon: Heart, color: "text-green-500" },
    { label: "Performance", value: 91, icon: Zap, color: "text-yellow-500" },
    { label: "Cognitive", value: 88, icon: Brain, color: "text-blue-500" },
  ];

  const overall = Math.round(scores.reduce((sum, s) => sum + s.value, 0) / scores.length);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-sm">Your Health Score</h3>
          <p className="text-xs text-muted-foreground">Based on your iO2 usage patterns</p>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-3xl text-primary" data-testid="text-health-score">{overall}</div>
          <div className="text-xs text-muted-foreground">/100</div>
        </div>
      </div>
      <div className="space-y-4">
        {scores.map((score) => (
          <div key={score.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <score.icon className={`h-4 w-4 ${score.color}`} />
                <span className="text-sm">{score.label}</span>
              </div>
              <span className="text-sm font-medium">{score.value}</span>
            </div>
            <Progress value={score.value} className="h-2" />
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/5 rounded-xl">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Pro tip:</span> Increase your hydration score by drinking iO2 30 minutes before workouts. Consistent daily intake improves all metrics over time.
        </p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({ queryKey: ["/api/orders"] });
  const { data: subscriptions } = useQuery<SubscriptionWithProduct[]>({ queryKey: ["/api/subscriptions"] });
  const { toast } = useToast();

  const updateSubMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/subscriptions/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      toast({ title: "Subscription updated" });
    },
  });

  const recentOrders = orders?.slice(0, 5) || [];
  const activeSubscriptions = subscriptions?.filter(s => s.status === "active") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl tracking-tight" data-testid="text-dashboard-title">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your orders, subscriptions, and health metrics</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm" data-testid="link-admin">Admin Panel</Button>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: orders?.length || 0, icon: Package, trend: "+12% this month" },
              { label: "Active Subscriptions", value: activeSubscriptions.length, icon: RefreshCw, trend: "Next delivery Apr 18" },
              { label: "Total Saved", value: "$42.50", icon: TrendingUp, trend: "via subscriptions" },
              { label: "Bottles Consumed", value: "84", icon: Droplets, trend: "This quarter" },
            ].map((stat) => (
              <Card key={stat.label} className="p-5 bg-card border-border" data-testid={`card-stat-${stat.label.toLowerCase().replace(/ /g, '-')}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="font-display font-bold text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent orders */}
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Recent Orders</h3>
                      <Button variant="ghost" size="sm" className="text-primary text-xs">View All</Button>
                    </div>
                    {recentOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">No orders yet. <Link href="/store" className="text-primary">Start shopping</Link></p>
                    ) : (
                      <div className="space-y-3">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Order #{order.id.toString().padStart(4, '0')}</div>
                                <div className="text-xs text-muted-foreground">{order.createdAt}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-sm">${order.total.toFixed(2)}</span>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Active Subscriptions */}
                  <Card className="p-6 bg-card border-border">
                    <h3 className="font-semibold mb-4">Active Subscriptions</h3>
                    {activeSubscriptions.length === 0 ? (
                      <div className="text-center py-6">
                        <RefreshCw className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">No active subscriptions</p>
                        <Link href="/store">
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Subscribe & Save 20%
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeSubscriptions.map((sub) => (
                          <div key={sub.id} className="p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold text-sm">{sub.product?.name || "Subscription"}</div>
                                <div className="text-xs text-muted-foreground">{sub.frequency} · {sub.quantity} unit(s)</div>
                              </div>
                              <StatusBadge status={sub.status} />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Next delivery: {sub.nextDelivery}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm">${sub.pricePerDelivery.toFixed(2)}/mo</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-7"
                                  onClick={() => updateSubMutation.mutate({ id: sub.id, status: "paused" })}
                                >
                                  <Pause className="h-3 w-3 mr-1" /> Pause
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Health Score sidebar */}
                <div>
                  <HealthScore />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-4">Order History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Order</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Date</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Status</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Ship To</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium">#{order.id.toString().padStart(4, '0')}</td>
                          <td className="py-3 text-muted-foreground">{order.createdAt}</td>
                          <td className="py-3"><StatusBadge status={order.status} /></td>
                          <td className="py-3 text-muted-foreground">{order.shippingCity}, {order.shippingState}</td>
                          <td className="py-3 text-right font-display font-bold">${order.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(!orders || orders.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <div className="space-y-4">
                {subscriptions?.map((sub) => (
                  <Card key={sub.id} className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{sub.product?.name || "Subscription"}</h3>
                        <p className="text-sm text-muted-foreground">{sub.frequency} delivery · {sub.quantity} unit(s)</p>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge status={sub.status} />
                          <span className="text-xs text-muted-foreground">Since {sub.createdAt}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-xl">${sub.pricePerDelivery.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                        <div className="flex gap-2 mt-3">
                          {sub.status === "active" ? (
                            <>
                              <Button variant="outline" size="sm" onClick={() => updateSubMutation.mutate({ id: sub.id, status: "paused" })}>
                                <Pause className="h-3 w-3 mr-1" /> Pause
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive" onClick={() => updateSubMutation.mutate({ id: sub.id, status: "cancelled" })}>
                                Cancel
                              </Button>
                            </>
                          ) : sub.status === "paused" ? (
                            <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => updateSubMutation.mutate({ id: sub.id, status: "active" })}>
                              <Play className="h-3 w-3 mr-1" /> Resume
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {sub.nextDelivery && sub.status === "active" && (
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Next delivery scheduled for <span className="font-semibold">{sub.nextDelivery}</span></span>
                      </div>
                    )}
                  </Card>
                ))}
                {(!subscriptions || subscriptions.length === 0) && (
                  <Card className="p-12 text-center bg-card border-border">
                    <RefreshCw className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-xl mb-2">No subscriptions yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Subscribe to save 20% on every delivery with free shipping.</p>
                    <Link href="/store"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Subscription Plans</Button></Link>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
