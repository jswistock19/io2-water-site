import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProductSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export function registerRoutes(server: Server, app: Express) {
  // Stable session ID for demo (no cookie/localStorage available in sandbox)
  const DEMO_SESSION_ID = "io2-demo-session";
  function getSessionId(_req: any): string {
    return DEMO_SESSION_ID;
  }

  // ===== PRODUCTS =====
  app.get("/api/products", (_req, res) => {
    const prods = storage.getProducts();
    res.json(prods);
  });

  app.get("/api/products/category/:category", (req, res) => {
    const prods = storage.getProductsByCategory(req.params.category);
    res.json(prods);
  });

  app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const product = storage.getProductBySlug(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.json(product);
    }
    const product = storage.getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = storage.createProduct(data);
      res.status(201).json(product);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const product = storage.updateProduct(id, req.body);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.deleteProduct(id);
    res.json({ success: true });
  });

  // ===== CART =====
  app.get("/api/cart", (req, res) => {
    const sessionId = getSessionId(req);
    const items = storage.getCartItems(sessionId);
    const subtotal = items.reduce((sum, item) => {
      const price = item.isSubscription && item.product?.subscriptionPrice
        ? item.product.subscriptionPrice
        : (item.product?.price || 0);
      return sum + price * item.quantity;
    }, 0);
    res.json({ items, subtotal, itemCount: items.reduce((sum, i) => sum + i.quantity, 0) });
  });

  app.post("/api/cart", (req, res) => {
    const sessionId = getSessionId(req);
    const { productId, quantity = 1, isSubscription = false } = req.body;
    if (!productId) return res.status(400).json({ error: "productId required" });
    const item = storage.addToCart({ sessionId, productId, quantity, isSubscription });
    const items = storage.getCartItems(sessionId);
    const subtotal = items.reduce((sum, i) => {
      const price = i.isSubscription && i.product?.subscriptionPrice
        ? i.product.subscriptionPrice
        : (i.product?.price || 0);
      return sum + price * i.quantity;
    }, 0);
    res.json({ item, items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  });

  app.patch("/api/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    if (quantity < 1) {
      storage.removeCartItem(id);
    } else {
      storage.updateCartItemQuantity(id, quantity);
    }
    const sessionId = getSessionId(req);
    const items = storage.getCartItems(sessionId);
    const subtotal = items.reduce((sum, i) => {
      const price = i.isSubscription && i.product?.subscriptionPrice
        ? i.product.subscriptionPrice
        : (i.product?.price || 0);
      return sum + price * i.quantity;
    }, 0);
    res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  });

  app.delete("/api/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.removeCartItem(id);
    const sessionId = getSessionId(req);
    const items = storage.getCartItems(sessionId);
    const subtotal = items.reduce((sum, i) => {
      const price = i.isSubscription && i.product?.subscriptionPrice
        ? i.product.subscriptionPrice
        : (i.product?.price || 0);
      return sum + price * i.quantity;
    }, 0);
    res.json({ items, subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  });

  // ===== CHECKOUT =====
  app.post("/api/checkout", (req, res) => {
    const sessionId = getSessionId(req);
    const items = storage.getCartItems(sessionId);
    if (items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const { name, address, city, state, zip, email } = req.body;
    const subtotal = items.reduce((sum, i) => {
      const price = i.isSubscription && i.product?.subscriptionPrice
        ? i.product.subscriptionPrice
        : (i.product?.price || 0);
      return sum + price * i.quantity;
    }, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Create or find user
    let user = storage.getUserByEmail(email);
    if (!user) {
      user = storage.createUser({ email, name, passwordHash: "temp", role: "customer" });
    }

    const order = storage.createOrder({
      userId: user.id,
      status: "processing",
      total,
      subtotal,
      shipping,
      tax,
      shippingName: name,
      shippingAddress: address,
      shippingCity: city,
      shippingState: state,
      shippingZip: zip,
      createdAt: new Date().toISOString().split("T")[0],
    });

    // Create order items
    for (const item of items) {
      storage.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        productName: item.product?.name || "Unknown",
        quantity: item.quantity,
        price: item.isSubscription && item.product?.subscriptionPrice
          ? item.product.subscriptionPrice
          : (item.product?.price || 0),
        isSubscription: item.isSubscription,
      });

      // Create subscription if needed
      if (item.isSubscription && item.product) {
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);
        storage.createSubscription({
          userId: user.id,
          productId: item.productId,
          status: "active",
          frequency: "monthly",
          quantity: item.quantity,
          nextDelivery: nextDate.toISOString().split("T")[0],
          pricePerDelivery: item.product.subscriptionPrice || item.product.price,
          createdAt: new Date().toISOString().split("T")[0],
        });
      }
    }

    storage.clearCart(sessionId);
    res.json({ order, message: "Order placed successfully" });
  });

  // ===== ORDERS =====
  app.get("/api/orders", (_req, res) => {
    const allOrders = storage.getOrders();
    res.json(allOrders);
  });

  app.get("/api/orders/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const order = storage.getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const items = storage.getOrderItems(id);
    res.json({ ...order, items });
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const order = storage.updateOrderStatus(id, status);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  // ===== SUBSCRIPTIONS =====
  app.get("/api/subscriptions", (req, res) => {
    // For demo, use userId 1
    const subs = storage.getSubscriptionsByUser(1);
    const enriched = subs.map(s => {
      const product = storage.getProductById(s.productId);
      return { ...s, product };
    });
    res.json(enriched);
  });

  app.patch("/api/subscriptions/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    storage.updateSubscriptionStatus(id, status);
    res.json({ success: true });
  });

  // ===== REVIEWS =====
  app.get("/api/reviews/:productId", (req, res) => {
    const productId = parseInt(req.params.productId);
    const productReviews = storage.getReviewsByProduct(productId);
    res.json(productReviews);
  });

  app.post("/api/reviews", (req, res) => {
    try {
      const data = insertReviewSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString().split("T")[0],
      });
      const review = storage.createReview(data);
      res.status(201).json(review);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ===== CONTACT =====
  app.post("/api/contact", (req, res) => {
    try {
      const data = insertContactMessageSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString().split("T")[0],
      });
      const msg = storage.createContactMessage(data);
      res.status(201).json({ message: "Message sent successfully", id: msg.id });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ===== DASHBOARD STATS =====
  app.get("/api/admin/stats", (_req, res) => {
    const stats = storage.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/admin/recent-orders", (_req, res) => {
    const allOrders = storage.getOrders().slice(0, 10);
    res.json(allOrders);
  });
}
