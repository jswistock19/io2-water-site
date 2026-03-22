# IO2 Water — Full Build Plan

## Brand Identity
- **Name**: iO2 Water (by Oxira)
- **Tagline**: "Don't Just Hydrate. Oxygenate."
- **Color Palette**: Deep navy/dark backgrounds (#0a0f1a), electric cyan accent (#00d4ff), lighter cyan for hover (#33ddff), white text. Dark-first brand.
- **Typography**: Cabinet Grotesk (display/headings), Satoshi (body) — both from Fontshare
- **Tone**: Premium performance water brand. Think AG1 meets Tesla. Clinical credibility + aspirational lifestyle.

## Pages & Routes

### Public-Facing (no auth required)
1. **Landing Page** (`/`) — Hero with product render, 3 stats (25mg/L O₂, 0 Additives, Patented), science section, benefits grid, featured products, wholesale CTA, testimonials, FAQ, contact form
2. **Store** (`/store`) — Full product catalog with filtering (by category: Singles, Bundles, Subscriptions), product cards with "Add to Cart", subscription toggle (save 20%)
3. **Product Detail** (`/store/:id`) — Product image, description, variant selector (size), quantity, subscription option, add to cart, reviews, related products

### Authenticated (customer)
4. **Cart** (`/cart`) — Line items, quantity adjustment, remove, subtotal, promo code, checkout button
5. **Checkout** (`/checkout`) — Shipping info form, payment placeholder, order summary
6. **Dashboard** (`/dashboard`) — Overview: recent orders, subscription status, hydration tracker, health score (inspired by RealMart's Real Score concept)
7. **Orders** (`/dashboard/orders`) — Order history table with status badges
8. **Subscriptions** (`/dashboard/subscriptions`) — Active subscriptions, skip/pause/cancel, delivery schedule
9. **Profile** (`/dashboard/profile`) — Edit name, email, shipping address

### Admin
10. **Admin Dashboard** (`/admin`) — Revenue chart, order count, top products, customer count KPIs
11. **Admin Products** (`/admin/products`) — CRUD product management table
12. **Admin Orders** (`/admin/orders`) — All orders table with status management

## Products (Seed Data)
1. iO2 Performance Bottle (500ml) — $3.99
2. iO2 Recovery Can (355ml) — $2.99
3. iO2 Nightlife Shot (60ml) — $5.99
4. iO2 Brain Boost (500ml) — $4.99
5. iO2 Athlete Pack (12x 500ml) — $39.99
6. iO2 Recovery Bundle (24x 355ml) — $59.99
7. iO2 Starter Kit (6-variety) — $24.99
8. iO2 Monthly Subscription (24 bottles) — $49.99/mo

## Key Features to Include
- From RealMart: Category browsing, Prime-style membership comparison, dark mode, trust badges, seller tiers
- From Real-PT: Premium ocean/clinical photography feel, transparent pricing, membership tiers, veteran programs
- From AG1: Subscription-first design, social proof counters, free welcome gift
- From Liquid IV: Shop by benefit, build your own bundle, per-unit pricing
- From DASH Water: Product-matched color backgrounds, "choose your plan" language, referral CTA
- From Waiakea: Origin story (oxygen source), purity/lab report section, rewards bar
