import express from 'express';

const app = express();
app.use(express.json());

// In-memory data for Vercel serverless (no SQLite)
const products = [
  { id: 1, name: "iO2 Performance Bottle", slug: "performance-bottle", description: "Our flagship 500ml bottle with 25mg/L dissolved oxygen. Engineered for peak athletic performance. The patented MohrO2 process infuses pure oxygen at molecular level for maximum bioavailability. Feel the difference in your next workout, race, or recovery session.", shortDescription: "500ml premium oxygen-enriched water for peak performance", price: 3.99, comparePrice: 4.99, category: "singles", benefit: "performance", imageUrl: "io2-performance-bottle", badge: "Best Seller", rating: 4.9, reviewCount: 2847, stock: 500, unitCount: 1, unitSize: "500ml", accentColor: "#00d4ff", isSubscription: false, subscriptionPrice: null },
  { id: 2, name: "iO2 Recovery Can", slug: "recovery-can", description: "Slim 355ml can designed for post-workout recovery. Same patented oxygen infusion in a portable format.", shortDescription: "355ml post-workout recovery in a portable can", price: 2.99, comparePrice: null, category: "singles", benefit: "recovery", imageUrl: "io2-can", rating: 4.8, reviewCount: 1923, stock: 800, unitCount: 1, unitSize: "355ml", accentColor: "#00ff88", isSubscription: false, subscriptionPrice: null },
  { id: 3, name: "iO2 Nightlife Shot", slug: "nightlife-shot", description: "Concentrated 60ml oxygen shot for nightlife recovery.", shortDescription: "60ml concentrated oxygen shot for nightlife recovery", price: 5.99, comparePrice: null, category: "singles", benefit: "nightlife", imageUrl: "io2-nightlife-shot", badge: "New", rating: 4.7, reviewCount: 843, stock: 600, unitCount: 1, unitSize: "60ml", accentColor: "#a855f7", isSubscription: false, subscriptionPrice: null },
  { id: 4, name: "iO2 Brain Boost", slug: "brain-boost", description: "500ml cognitive performance formula. Enhanced oxygen delivery to support mental clarity, focus, and sustained concentration.", shortDescription: "500ml cognitive clarity and focus formula", price: 4.99, comparePrice: null, category: "singles", benefit: "brain", imageUrl: "io2-brain-boost", rating: 4.8, reviewCount: 1256, stock: 400, unitCount: 1, unitSize: "500ml", accentColor: "#3b82f6", isSubscription: false, subscriptionPrice: null },
  { id: 5, name: "iO2 Athlete Pack", slug: "athlete-pack", description: "12-pack of 500ml Performance Bottles. The preferred choice of professional athletes and trainers.", shortDescription: "12x 500ml Performance Bottles — save 17%", price: 39.99, comparePrice: 47.88, category: "bundles", benefit: "performance", imageUrl: "io2-variety-pack", badge: "Save 17%", rating: 4.9, reviewCount: 967, stock: 200, unitCount: 12, unitSize: "500ml", accentColor: "#00d4ff", isSubscription: false, subscriptionPrice: null },
  { id: 6, name: "iO2 Recovery Bundle", slug: "recovery-bundle", description: "24-pack of 355ml Recovery Cans. Perfect for teams, gyms, and serious athletes.", shortDescription: "24x 355ml Recovery Cans — save 16%", price: 59.99, comparePrice: 71.76, category: "bundles", benefit: "recovery", imageUrl: "io2-can", badge: "Save 16%", rating: 4.8, reviewCount: 634, stock: 150, unitCount: 24, unitSize: "355ml", accentColor: "#00ff88", isSubscription: false, subscriptionPrice: null },
  { id: 7, name: "iO2 Starter Kit", slug: "starter-kit", description: "Try all 4 iO2 formulas plus 2 bonus bottles. The perfect introduction to oxygen-enriched hydration.", shortDescription: "6-variety sampler — try every formula", price: 24.99, comparePrice: 29.93, category: "bundles", benefit: "starter", imageUrl: "io2-variety-pack", badge: "Try All", rating: 4.9, reviewCount: 1578, stock: 300, unitCount: 6, unitSize: "Mixed", accentColor: "#f59e0b", isSubscription: false, subscriptionPrice: null },
  { id: 8, name: "iO2 Monthly Subscription", slug: "monthly-subscription", description: "24 bottles delivered monthly. Subscribe and save 20% vs. one-time purchase. Free shipping on every delivery.", shortDescription: "24 bottles/month — save 20% + free shipping", price: 49.99, comparePrice: 62.50, category: "subscriptions", benefit: "performance", imageUrl: "io2-variety-pack", badge: "Save 20%", rating: 4.9, reviewCount: 2103, stock: 999, isSubscription: true, subscriptionPrice: 49.99, unitCount: 24, unitSize: "500ml", accentColor: "#00d4ff" }
];

const reviews = [
  { id: 1, productId: 1, name: "Marcus T.", rating: 5, title: "Game changer for my training", body: "NFL strength coach here. My athletes noticed the difference within the first week. Recovery times are down, and performance metrics are trending up across the board.", verified: true, createdAt: "2026-03-01" },
  { id: 2, productId: 1, name: "Dr. Sarah K.", rating: 5, title: "Clinically impressive", body: "As a functional medicine practitioner, I'm careful about what I recommend. The dissolved oxygen levels in iO2 are genuinely higher than competitors.", verified: true, createdAt: "2026-02-15" },
  { id: 3, productId: 2, name: "Jordan M.", rating: 5, title: "Recovery game on point", body: "I train CrossFit 6 days a week. The Recovery Can is my go-to after every WOD.", verified: true, createdAt: "2026-03-10" },
  { id: 4, productId: 3, name: "Alex R.", rating: 4, title: "Great for nights out", body: "Keeps me sharp and helps with recovery the next day. The 60ml format is perfect.", verified: true, createdAt: "2026-02-28" },
  { id: 5, productId: 4, name: "Dr. Lisa W.", rating: 5, title: "Noticeable cognitive boost", body: "I drink the Brain Boost before long surgeries. The clarity difference is real.", verified: true, createdAt: "2026-03-05" },
  { id: 6, productId: 7, name: "Mike D.", rating: 5, title: "Perfect way to try everything", body: "Got the Starter Kit to figure out which formula I liked best. Now I'm subscribed to the Performance Bottle.", verified: true, createdAt: "2026-03-12" },
];

let cartItems = [];
let cartIdCounter = 1;

app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/category/:cat', (req, res) => res.json(products.filter(p => p.category === req.params.cat)));
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const p = isNaN(id) ? products.find(p => p.slug === req.params.id) : products.find(p => p.id === id);
  p ? res.json(p) : res.status(404).json({ error: "Not found" });
});

app.get('/api/cart', (req, res) => {
  const items = cartItems.map(ci => ({ ...ci, product: products.find(p => p.id === ci.productId) }));
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1, isSubscription = false } = req.body;
  const existing = cartItems.find(i => i.productId === productId && i.isSubscription === isSubscription);
  if (existing) existing.quantity += quantity;
  else cartItems.push({ id: cartIdCounter++, sessionId: "demo", productId, quantity, isSubscription });
  const items = cartItems.map(ci => ({ ...ci, product: products.find(p => p.id === ci.productId) }));
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
});

app.patch('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  if (quantity < 1) cartItems = cartItems.filter(i => i.id !== id);
  else { const item = cartItems.find(i => i.id === id); if (item) item.quantity = quantity; }
  const items = cartItems.map(ci => ({ ...ci, product: products.find(p => p.id === ci.productId) }));
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cartItems = cartItems.filter(i => i.id !== id);
  const items = cartItems.map(ci => ({ ...ci, product: products.find(p => p.id === ci.productId) }));
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
});

app.post('/api/checkout', (req, res) => {
  cartItems = [];
  res.json({ order: { id: Math.floor(Math.random() * 10000) }, message: "Order placed successfully" });
});

app.get('/api/orders', (req, res) => res.json([
  { id: 1, userId: 1, status: "delivered", total: 45.97, subtotal: 39.98, shipping: 0, tax: 5.99, shippingName: "John Smith", createdAt: "2026-03-15" },
  { id: 2, userId: 1, status: "shipped", total: 32.96, subtotal: 28.96, shipping: 0, tax: 4.00, shippingName: "Sarah Johnson", createdAt: "2026-03-18" },
  { id: 3, userId: 1, status: "processing", total: 54.99, subtotal: 49.99, shipping: 0, tax: 5.00, shippingName: "Mike Williams", createdAt: "2026-03-20" }
]));

app.get('/api/subscriptions', (req, res) => res.json([
  { id: 1, userId: 1, productId: 1, status: "active", frequency: "monthly", quantity: 24, nextDelivery: "2026-04-18", pricePerDelivery: 49.99, createdAt: "2026-02-18", product: products[0] }
]));

app.patch('/api/subscriptions/:id', (req, res) => res.json({ success: true }));

app.get('/api/reviews/:productId', (req, res) => {
  const pid = parseInt(req.params.productId);
  res.json(reviews.filter(r => r.productId === pid));
});

app.post('/api/contact', (req, res) => res.status(201).json({ message: "Message sent successfully", id: 1 }));

app.get('/api/admin/stats', (req, res) => res.json({
  totalRevenue: 127450, orderCount: 3247, customerCount: 2891, subscriptionCount: 847,
  revenueByMonth: [{ month: "Jan", revenue: 15200 }, { month: "Feb", revenue: 22400 }, { month: "Mar", revenue: 31850 }],
  ordersByMonth: [{ month: "Jan", orders: 412 }, { month: "Feb", orders: 589 }, { month: "Mar", orders: 847 }],
  topProducts: products.slice(0, 4).map(p => ({ ...p, totalSold: Math.floor(Math.random() * 500 + 100) }))
}));

app.get('/api/admin/recent-orders', (req, res) => res.json([
  { id: 1, userId: 1, status: "delivered", total: 45.97, subtotal: 39.98, shipping: 0, tax: 5.99, shippingName: "John Smith", createdAt: "2026-03-15" },
  { id: 2, userId: 1, status: "shipped", total: 32.96, subtotal: 28.96, shipping: 0, tax: 4.00, shippingName: "Sarah Johnson", createdAt: "2026-03-18" },
  { id: 3, userId: 1, status: "processing", total: 54.99, subtotal: 49.99, shipping: 0, tax: 5.00, shippingName: "Mike Williams", createdAt: "2026-03-20" }
]));

export default app;
