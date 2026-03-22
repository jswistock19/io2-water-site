import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign, Package, Users, ShoppingBag, TrendingUp,
  CheckCircle2, Truck, Clock, XCircle, BarChart3, ArrowUpRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import type { Order, Product } from "@shared/schema";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    delivered: "bg-green-500/10 text-green-600 border-green-500/20",
    shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    pending: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return <Badge variant="outline" className={`${config[status] || config.pending} capitalize text-xs`}>{status}</Badge>;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery<DashboardStats>({ queryKey: ["/api/admin/stats"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/orders"] });
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { toast } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Order status updated" });
    },
  });

  // Mock chart data (would be real analytics in production)
  const revenueData = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 3600 },
    { month: "Mar", revenue: 5200 },
    { month: "Apr", revenue: 4800 },
    { month: "May", revenue: 6100 },
    { month: "Jun", revenue: 7500 },
  ];

  const orderTrend = [
    { day: "Mon", orders: 12 },
    { day: "Tue", orders: 18 },
    { day: "Wed", orders: 15 },
    { day: "Thu", orders: 22 },
    { day: "Fri", orders: 28 },
    { day: "Sat", orders: 35 },
    { day: "Sun", orders: 20 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl tracking-tight" data-testid="text-admin-title">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage products, orders, and analytics</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Customer View</Button>
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, trend: "+23% from last month", color: "text-green-500" },
              { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, trend: "+12% from last month", color: "text-blue-500" },
              { label: "Customers", value: stats?.totalCustomers || 0, icon: Users, trend: "+8% new this month", color: "text-purple-500" },
              { label: "Products", value: stats?.totalProducts || 0, icon: Package, trend: "8 active SKUs", color: "text-orange-500" },
            ].map((stat) => (
              <Card key={stat.label} className="p-5 bg-card border-border" data-testid={`card-admin-stat-${stat.label.toLowerCase().replace(/ /g, '-')}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="font-display font-bold text-2xl">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold">Revenue</h3>
                      <p className="text-xs text-muted-foreground">Monthly revenue trend</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 15%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(210 10% 55%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(210 10% 55%)" />
                      <Tooltip
                        contentStyle={{ background: "hsl(215 25% 9%)", border: "1px solid hsl(215 20% 15%)", borderRadius: "8px", fontSize: "12px" }}
                        labelStyle={{ color: "hsl(195 20% 95%)" }}
                      />
                      <Bar dataKey="revenue" fill="hsl(192 100% 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Orders Trend */}
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold">Order Volume</h3>
                      <p className="text-xs text-muted-foreground">This week's daily orders</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={orderTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 15%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(210 10% 55%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(210 10% 55%)" />
                      <Tooltip
                        contentStyle={{ background: "hsl(215 25% 9%)", border: "1px solid hsl(215 20% 15%)", borderRadius: "8px", fontSize: "12px" }}
                        labelStyle={{ color: "hsl(195 20% 95%)" }}
                      />
                      <Line type="monotone" dataKey="orders" stroke="hsl(192 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(192 100% 50%)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Top products */}
                <Card className="p-6 bg-card border-border lg:col-span-2">
                  <h3 className="font-semibold mb-4">Top Products by Reviews</h3>
                  <div className="space-y-3">
                    {products?.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5).map((product, i) => (
                      <div key={product.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                        <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category} · {product.unitSize}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-sm">${product.price.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{product.reviewCount?.toLocaleString()} reviews</div>
                        </div>
                        {product.badge && <Badge variant="outline" className="text-xs">{product.badge}</Badge>}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">All Orders</h3>
                  <Badge variant="outline">{orders?.length || 0} total</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Order</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Customer</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Date</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Status</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground text-right">Total</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium">#{order.id.toString().padStart(4, '0')}</td>
                          <td className="py-3 text-muted-foreground">{order.shippingName || "—"}</td>
                          <td className="py-3 text-muted-foreground">{order.createdAt}</td>
                          <td className="py-3"><StatusBadge status={order.status} /></td>
                          <td className="py-3 text-right font-display font-bold">${order.total.toFixed(2)}</td>
                          <td className="py-3 text-right">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateStatusMutation.mutate({ id: order.id, status: value })}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Product Inventory</h3>
                  <Badge variant="outline">{products?.length || 0} products</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Product</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Category</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Price</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Stock</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Rating</th>
                        <th className="pb-3 font-semibold text-xs text-muted-foreground">Reviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-0">
                          <td className="py-3">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.unitSize}{product.unitCount && product.unitCount > 1 ? ` × ${product.unitCount}` : ""}</div>
                          </td>
                          <td className="py-3"><Badge variant="outline" className="capitalize text-xs">{product.category}</Badge></td>
                          <td className="py-3 font-display font-bold">${product.price.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={product.stock && product.stock < 50 ? "text-yellow-600 font-medium" : "text-muted-foreground"}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span>{product.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">{product.reviewCount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
