import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  products, insertProductSchema, type InsertProduct, type Product,
  users, type InsertUser, type User,
  orders, type InsertOrder, type Order,
  orderItems, type InsertOrderItem, type OrderItem,
  subscriptions, type InsertSubscription, type Subscription,
  cartItems, type InsertCartItem, type CartItem,
  reviews, type InsertReview, type Review,
  contactMessages, type InsertContactMessage, type ContactMessage,
} from "@shared/schema";

const sqlite = new Database("io2.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price REAL NOT NULL,
    compare_price REAL,
    category TEXT NOT NULL,
    benefit TEXT NOT NULL,
    image_url TEXT,
    badge TEXT,
    rating REAL DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    is_subscription INTEGER DEFAULT 0,
    subscription_price REAL,
    unit_count INTEGER DEFAULT 1,
    unit_size TEXT,
    accent_color TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total REAL NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    shipping_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    promo_code TEXT,
    discount REAL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    is_subscription INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    frequency TEXT NOT NULL DEFAULT 'monthly',
    quantity INTEGER NOT NULL DEFAULT 1,
    next_delivery TEXT,
    price_per_delivery REAL NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    is_subscription INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    verified INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Seed products if empty
const productCount = db.select({ count: sql<number>`count(*)` }).from(products).get();
if (!productCount || productCount.count === 0) {
  const seedProducts: InsertProduct[] = [
    {
      name: "iO2 Precision Crafted — 12 FL OZ Can",
      slug: "performance-bottle",
      description: "Our flagship 12 fl oz (355ml) can — Precision Crafted Elevated Dissolved Oxygen Water. Engineered for peak performance, recovery, and daily use. Produced at 60+ mg/L dissolved oxygen using our patented oxygen dissolution technology. Zero sugar, zero caffeine, zero artificial additives. ~9.0 pH alkaline profile. Plastic-free production process using stainless steel only.",
      shortDescription: "12 fl oz precision crafted elevated dissolved oxygen water — 60+ mg/L, ~9.0 pH",
      price: 2.69,
      comparePrice: 3.99,
      category: "singles",
      benefit: "performance",
      imageUrl: "io2-can-original",
      badge: "Best Seller",
      rating: 4.9,
      reviewCount: 2847,
      stock: 500,
      unitCount: 1,
      unitSize: "12 fl oz",
      accentColor: "#00d4ff",
    },
    {
      name: "iO2 Precision Crafted — 4-Pack (PakTech)",
      slug: "recovery-can",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — PakTech 4-Pack. 4 x 12 fl oz cans. Perfect for gyms, fitness facilities, and wholesale. The same patented oxygen dissolution technology in a portable, performance-ready format. Zero sugar, zero caffeine, zero artificial additives. Non-GMO. BPA-Free. Recyclable packaging.",
      shortDescription: "PakTech 4-Pack — 4 × 12 fl oz precision crafted elevated dissolved oxygen water",
      price: 10.75,
      category: "singles",
      benefit: "recovery",
      imageUrl: "io2-can",
      badge: "Gym Favorite",
      rating: 4.8,
      reviewCount: 1923,
      stock: 800,
      unitCount: 4,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — Performance 12-Pack",
      slug: "nightlife-shot",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — Performance 12-Pack. 12 x 12 fl oz cans. Stock your fridge, gym, or training facility. Engineered for athletes and active lifestyle consumers. 60+ mg/L dissolved oxygen consistently measured. Zero sugar, zero caffeine, zero artificial additives. ~9.0 pH. Physician endorsed.",
      shortDescription: "12-Pack — 12 × 12 fl oz precision crafted elevated dissolved oxygen water",
      price: 42.00,
      comparePrice: 47.88,
      category: "singles",
      benefit: "performance",
      imageUrl: "io2-variety-pack",
      badge: "Save 12%",
      rating: 4.9,
      reviewCount: 843,
      stock: 600,
      unitCount: 12,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — Member 12-Pack",
      slug: "brain-boost",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — Member 12-Pack. 12 x 12 fl oz cans at the member price. $34.99 member vs. $42.00 retail. Subscribe and save. Perfect for daily hydration, athletic training, mental performance, and recovery. Non-GMO, BPA-Free, No Artificial Additives, Recyclable Packaging.",
      shortDescription: "Member 12-Pack — $34.99 member price (save vs. $42.00 retail)",
      price: 34.99,
      comparePrice: 42.00,
      category: "singles",
      benefit: "performance",
      imageUrl: "io2-brain-boost",
      badge: "Member Price",
      rating: 4.8,
      reviewCount: 1256,
      stock: 400,
      unitCount: 12,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — 24-Pack (Case)",
      slug: "athlete-pack",
      imageUrl: "io2-variety-pack",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — 24-Pack full case. The preferred choice for serious athletes, gyms, and retail partners. 24 x 12 fl oz cans. Produced at 60+ mg/L dissolved oxygen. Zero sugar, zero caffeine, zero artificial additives. ~9.0 pH. Physician endorsed. Non-GMO. BPA-Free.",
      shortDescription: "24-Pack case — 24 × 12 fl oz precision crafted elevated dissolved oxygen water",
      price: 59.99,
      comparePrice: 71.76,
      category: "bundles",
      benefit: "performance",
      badge: "Best Value",
      rating: 4.9,
      reviewCount: 967,
      stock: 200,
      unitCount: 24,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — Wholesale Case (48-Pack)",
      slug: "recovery-bundle",
      imageUrl: "io2-can",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — Wholesale 48-Pack. Perfect for gyms, health retailers, wellness facilities, and distribution partners. 48 x 12 fl oz cans. Maximum bulk savings. Each can delivers the same patented oxygen dissolution technology at 60+ mg/L dissolved oxygen.",
      shortDescription: "Wholesale 48-Pack — 48 × 12 fl oz for gyms, retailers & distribution",
      price: 99.99,
      comparePrice: 143.52,
      category: "bundles",
      benefit: "wholesale",
      badge: "Wholesale",
      rating: 4.8,
      reviewCount: 634,
      stock: 150,
      unitCount: 48,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — Founding Member Starter Pack",
      slug: "starter-kit",
      imageUrl: "io2-variety-pack",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — Founding Member Starter Pack. The perfect introduction to oxygen-enhanced hydration. 6 x 12 fl oz cans. Join our founding circle for early access and exclusive updates. Includes a free iO2 branded item with your first order. Zero sugar, zero caffeine, zero artificial additives.",
      shortDescription: "Founding Member Starter Pack — 6 × 12 fl oz + founding circle access",
      price: 16.14,
      comparePrice: 24.99,
      category: "bundles",
      benefit: "starter",
      badge: "Founding Member",
      rating: 4.9,
      reviewCount: 1578,
      stock: 300,
      unitCount: 6,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    },
    {
      name: "iO2 Precision Crafted — Monthly Subscription (24-Pack)",
      slug: "monthly-subscription",
      imageUrl: "io2-variety-pack",
      description: "iO2 Precision Crafted Elevated Dissolved Oxygen Water — Monthly Subscription. 24 x 12 fl oz cans delivered monthly. Subscribe and save 20% vs. one-time purchase. Free shipping on every delivery. Pause, skip, or cancel anytime. Includes a free iO2 branded item with your first delivery. Make elevated hydration as natural as breakfast.",
      shortDescription: "Monthly subscription — 24 × 12 fl oz, save 20% + free shipping",
      price: 49.99,
      comparePrice: 64.56,
      category: "subscriptions",
      benefit: "performance",
      badge: "Save 20%",
      rating: 4.9,
      reviewCount: 2103,
      stock: 999,
      isSubscription: true,
      subscriptionPrice: 49.99,
      unitCount: 24,
      unitSize: "12 fl oz",
      accentColor: "#1d4ed8",
    }
  ];

  for (const p of seedProducts) {
    db.insert(products).values(p).run();
  }
}

// Seed reviews if empty
const reviewCount = db.select({ count: sql<number>`count(*)` }).from(reviews).get();
if (!reviewCount || reviewCount.count === 0) {
  const seedReviews: InsertReview[] = [
    { productId: 1, name: "Marcus T.", rating: 5, title: "Game changer for my training", body: "NFL strength coach here. My athletes noticed the difference within the first week. Recovery times are down, and performance metrics are trending up across the board. We've made iO2 standard in our facility.", verified: true, createdAt: "2026-03-01" },
    { productId: 1, name: "Dr. Sarah K.", rating: 5, title: "Clinically impressive", body: "As a functional medicine practitioner, I'm careful about what I recommend. The dissolved oxygen levels in iO2 are genuinely higher than competitors. I've seen measurable improvements in patient SpO2 levels post-consumption.", verified: true, createdAt: "2026-02-15" },
    { productId: 2, name: "Jordan M.", rating: 5, title: "Recovery game on point", body: "I train CrossFit 6 days a week. The Recovery Can is my go-to after every WOD. Less soreness, faster recovery between sessions. The slim can fits perfectly in my gym bag.", verified: true, createdAt: "2026-03-10" },
    { productId: 3, name: "Ashley R.", rating: 5, title: "Finally, hangover help that works", body: "I keep a pack in my fridge for weekends. One before going out, one before bed. The difference the next morning is night and day. No more wasted Sundays.", verified: true, createdAt: "2026-02-28" },
    { productId: 4, name: "David L.", rating: 5, title: "Better than any nootropic", body: "Software engineer working 12-hour days. Replaced my afternoon coffee with Brain Boost. More sustained focus without the jitters or crash. My code quality actually improved.", verified: true, createdAt: "2026-03-05" },
    { productId: 5, name: "Coach Williams", rating: 5, title: "Team-approved hydration", body: "Ordered the Athlete Pack for our D1 track team. The athletes love it. We've seen PR improvements across multiple events since making the switch. Reordering monthly.", verified: true, createdAt: "2026-03-12" },
  ];
  for (const r of seedReviews) {
    db.insert(reviews).values(r).run();
  }
}

// Seed admin user
const adminExists = db.select().from(users).where(eq(users.email, "admin@io2water.com")).get();
if (!adminExists) {
  db.insert(users).values({
    email: "admin@io2water.com",
    name: "Admin",
    passwordHash: "admin123",
    role: "admin",
  }).run();
}

// Seed demo orders
const orderCount = db.select({ count: sql<number>`count(*)` }).from(orders).get();
if (!orderCount || orderCount.count === 0) {
  const demoOrders = [
    { userId: 1, status: "delivered", total: 87.97, subtotal: 79.97, shipping: 0, tax: 8.00, shippingName: "John Smith", shippingAddress: "123 Main St", shippingCity: "Bowling Green", shippingState: "KY", shippingZip: "42101", createdAt: "2026-03-15" },
    { userId: 1, status: "shipped", total: 54.99, subtotal: 49.99, shipping: 0, tax: 5.00, shippingName: "John Smith", shippingAddress: "123 Main St", shippingCity: "Bowling Green", shippingState: "KY", shippingZip: "42101", createdAt: "2026-03-18" },
    { userId: 1, status: "processing", total: 27.49, subtotal: 24.99, shipping: 0, tax: 2.50, shippingName: "John Smith", shippingAddress: "123 Main St", shippingCity: "Bowling Green", shippingState: "KY", shippingZip: "42101", createdAt: "2026-03-20" },
  ];
  for (const o of demoOrders) {
    db.insert(orders).values(o).run();
  }
  // Order items
  db.insert(orderItems).values({ orderId: 1, productId: 5, productName: "iO2 Athlete Pack", quantity: 1, price: 39.99 }).run();
  db.insert(orderItems).values({ orderId: 1, productId: 1, productName: "iO2 Performance Bottle", quantity: 10, price: 39.98 }).run();
  db.insert(orderItems).values({ orderId: 2, productId: 8, productName: "iO2 Monthly Subscription", quantity: 1, price: 49.99, isSubscription: true }).run();
  db.insert(orderItems).values({ orderId: 3, productId: 7, productName: "iO2 Starter Kit", quantity: 1, price: 24.99 }).run();
}

// Seed subscription
const subCount = db.select({ count: sql<number>`count(*)` }).from(subscriptions).get();
if (!subCount || subCount.count === 0) {
  db.insert(subscriptions).values({
    userId: 1,
    productId: 8,
    status: "active",
    frequency: "monthly",
    quantity: 1,
    nextDelivery: "2026-04-18",
    pricePerDelivery: 49.99,
    createdAt: "2026-03-18",
  }).run();
}

export interface IStorage {
  // Products
  getProducts(): Product[];
  getProductById(id: number): Product | undefined;
  getProductBySlug(slug: string): Product | undefined;
  getProductsByCategory(category: string): Product[];
  createProduct(product: InsertProduct): Product;
  updateProduct(id: number, product: Partial<InsertProduct>): Product | undefined;
  deleteProduct(id: number): void;

  // Users
  getUserById(id: number): User | undefined;
  getUserByEmail(email: string): User | undefined;
  createUser(user: InsertUser): User;

  // Orders
  getOrders(): Order[];
  getOrdersByUser(userId: number): Order[];
  getOrderById(id: number): Order | undefined;
  createOrder(order: InsertOrder): Order;
  updateOrderStatus(id: number, status: string): Order | undefined;

  // Order Items
  getOrderItems(orderId: number): OrderItem[];
  createOrderItem(item: InsertOrderItem): OrderItem;

  // Subscriptions
  getSubscriptionsByUser(userId: number): Subscription[];
  createSubscription(sub: InsertSubscription): Subscription;
  updateSubscriptionStatus(id: number, status: string): void;

  // Cart
  getCartItems(sessionId: string): (CartItem & { product?: Product })[];
  addToCart(item: InsertCartItem): CartItem;
  updateCartItemQuantity(id: number, quantity: number): void;
  removeCartItem(id: number): void;
  clearCart(sessionId: string): void;

  // Reviews
  getReviewsByProduct(productId: number): Review[];
  createReview(review: InsertReview): Review;

  // Contact
  createContactMessage(msg: InsertContactMessage): ContactMessage;

  // Dashboard stats
  getDashboardStats(): { totalRevenue: number; totalOrders: number; totalCustomers: number; totalProducts: number };
}

export class DatabaseStorage implements IStorage {
  getProducts(): Product[] {
    return db.select().from(products).all();
  }
  getProductById(id: number): Product | undefined {
    return db.select().from(products).where(eq(products.id, id)).get();
  }
  getProductBySlug(slug: string): Product | undefined {
    return db.select().from(products).where(eq(products.slug, slug)).get();
  }
  getProductsByCategory(category: string): Product[] {
    return db.select().from(products).where(eq(products.category, category)).all();
  }
  createProduct(product: InsertProduct): Product {
    return db.insert(products).values(product).returning().get();
  }
  updateProduct(id: number, product: Partial<InsertProduct>): Product | undefined {
    return db.update(products).set(product).where(eq(products.id, id)).returning().get();
  }
  deleteProduct(id: number): void {
    db.delete(products).where(eq(products.id, id)).run();
  }

  getUserById(id: number): User | undefined {
    return db.select().from(users).where(eq(users.id, id)).get();
  }
  getUserByEmail(email: string): User | undefined {
    return db.select().from(users).where(eq(users.email, email)).get();
  }
  createUser(user: InsertUser): User {
    return db.insert(users).values(user).returning().get();
  }

  getOrders(): Order[] {
    return db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  }
  getOrdersByUser(userId: number): Order[] {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).all();
  }
  getOrderById(id: number): Order | undefined {
    return db.select().from(orders).where(eq(orders.id, id)).get();
  }
  createOrder(order: InsertOrder): Order {
    return db.insert(orders).values(order).returning().get();
  }
  updateOrderStatus(id: number, status: string): Order | undefined {
    return db.update(orders).set({ status }).where(eq(orders.id, id)).returning().get();
  }

  getOrderItems(orderId: number): OrderItem[] {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).all();
  }
  createOrderItem(item: InsertOrderItem): OrderItem {
    return db.insert(orderItems).values(item).returning().get();
  }

  getSubscriptionsByUser(userId: number): Subscription[] {
    return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).all();
  }
  createSubscription(sub: InsertSubscription): Subscription {
    return db.insert(subscriptions).values(sub).returning().get();
  }
  updateSubscriptionStatus(id: number, status: string): void {
    db.update(subscriptions).set({ status }).where(eq(subscriptions.id, id)).run();
  }

  getCartItems(sessionId: string): (CartItem & { product?: Product })[] {
    const items = db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId)).all();
    return items.map(item => {
      const product = this.getProductById(item.productId);
      return { ...item, product };
    });
  }
  addToCart(item: InsertCartItem): CartItem {
    // Check if already in cart
    const existing = db.select().from(cartItems)
      .where(and(
        eq(cartItems.sessionId, item.sessionId),
        eq(cartItems.productId, item.productId),
        eq(cartItems.isSubscription, item.isSubscription ?? false)
      )).get();
    if (existing) {
      db.update(cartItems).set({ quantity: existing.quantity + (item.quantity || 1) }).where(eq(cartItems.id, existing.id)).run();
      return db.select().from(cartItems).where(eq(cartItems.id, existing.id)).get()!;
    }
    return db.insert(cartItems).values(item).returning().get();
  }
  updateCartItemQuantity(id: number, quantity: number): void {
    db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).run();
  }
  removeCartItem(id: number): void {
    db.delete(cartItems).where(eq(cartItems.id, id)).run();
  }
  clearCart(sessionId: string): void {
    db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).run();
  }

  getReviewsByProduct(productId: number): Review[] {
    return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt)).all();
  }
  createReview(review: InsertReview): Review {
    return db.insert(reviews).values(review).returning().get();
  }

  createContactMessage(msg: InsertContactMessage): ContactMessage {
    return db.insert(contactMessages).values(msg).returning().get();
  }

  getDashboardStats() {
    const totalRevenue = db.select({ sum: sql<number>`COALESCE(sum(total), 0)` }).from(orders).get()?.sum || 0;
    const totalOrders = db.select({ count: sql<number>`count(*)` }).from(orders).get()?.count || 0;
    const totalCustomers = db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "customer")).get()?.count || 0;
    const totalProducts = db.select({ count: sql<number>`count(*)` }).from(products).get()?.count || 0;
    return { totalRevenue, totalOrders, totalCustomers, totalProducts };
  }
}

export const storage = new DatabaseStorage();
