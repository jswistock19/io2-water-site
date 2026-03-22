import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Droplets, Zap, Brain, Moon, Star, Shield, Truck, ArrowRight,
  FlaskConical, Activity, Heart, Users, Building2, Globe, CheckCircle2,
  ChevronRight, Award, Beaker
} from "lucide-react";
import type { Product } from "@shared/schema";
import { useState } from "react";

export default function Landing() {
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    },
  });

  const featuredProducts = products?.filter(p => p.category === "singles").slice(0, 4) || [];
  const bundles = products?.filter(p => p.category === "bundles") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary font-medium px-4 py-1.5" data-testid="badge-hero">
                Patented MohrO2 Technology
              </Badge>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 text-foreground" data-testid="text-hero-title">
                Don't Just Hydrate.{" "}
                <span className="text-gradient-cyan">Oxygenate.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                Premium oxygen-enriched water with 25mg/L dissolved O₂. Zero additives. Patented process. Fuel your performance, recovery, and clarity.
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-12">
                <Link href="/store">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-12 text-base" data-testid="button-hero-shop">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 h-12 text-base"
                  onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-hero-science"
                >
                  Our Science
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-72 md:w-96">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-110" />
                <img
                  src="/assets/io2-can-original.jpg"
                  alt="iO2 Water Can"
                  className="relative w-full h-auto drop-shadow-2xl"
                  data-testid="img-hero-can"
                />
              </div>
            </div>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12">
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-primary" data-testid="text-stat-oxygen">25mg/L</div>
              <div className="text-xs text-muted-foreground mt-1">Dissolved O₂</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground" data-testid="text-stat-additives">Zero</div>
              <div className="text-xs text-muted-foreground mt-1">Additives</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground" data-testid="text-stat-patent">Patented</div>
              <div className="text-xs text-muted-foreground mt-1">MohrO2 Process</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}
              </div>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>from 12,000+ reviews</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Clinically Validated</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free Shipping $50+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Science */}
      <section id="science" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">The Science</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">How iO2 Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our patented MohrO2 process infuses pure oxygen at the molecular level, achieving 25mg/L dissolved oxygen — 5x higher than typical bottled water.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Droplets, step: "01", title: "Drink", desc: "Consume iO2's oxygen-enriched water. Each bottle delivers 25mg/L dissolved O₂ through our patented infusion process." },
              { icon: Activity, step: "02", title: "Absorb", desc: "Dissolved oxygen is absorbed through your GI tract directly into your bloodstream, bypassing normal respiratory limitations." },
              { icon: Zap, step: "03", title: "Perform", desc: "Enhanced cellular oxygenation powers your muscles, brain, and recovery systems. Feel the difference in every rep, every rep." },
            ].map((item) => (
              <Card key={item.step} className="p-8 bg-card border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-display font-bold text-3xl text-muted-foreground/30">{item.step}</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* Comparison */}
          <div className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-12">
            <h3 className="font-display font-bold text-xl mb-6 text-center">iO2 vs. Regular Water</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">iO2 Water</div>
                <div className="space-y-3">
                  {["25mg/L dissolved oxygen", "Patented MohrO2 process", "Proven in clinical trials", "Zero additives or preservatives", "Shelf-stable oxygen retention"].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Typical Bottled Water</div>
                <div className="space-y-3">
                  {["5-8mg/L dissolved oxygen", "No special process", "No clinical validation", "May contain additives", "Oxygen dissipates quickly"].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border border-muted-foreground/30 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 md:py-28 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">Benefits</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">Shop by Benefit</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every formula in the iO2 lineup targets a specific performance goal. Choose yours.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Performance", desc: "Peak athletic output. More oxygen to muscles during training and competition.", color: "from-cyan-500/20 to-blue-500/20", link: "performance" },
              { icon: Heart, title: "Recovery", desc: "Faster post-workout recovery. Reduce soreness and accelerate muscle repair.", color: "from-green-500/20 to-emerald-500/20", link: "recovery" },
              { icon: Brain, title: "Brain Boost", desc: "Sharper focus and sustained clarity. Fuel your cognitive performance.", color: "from-blue-500/20 to-indigo-500/20", link: "brain" },
              { icon: Moon, title: "Nightlife", desc: "Recovery before, during, and after a night out. Wake up feeling human.", color: "from-purple-500/20 to-pink-500/20", link: "nightlife" },
            ].map((item) => (
              <Link key={item.title} href="/store">
                <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}>
                    <item.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-base mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop {item.title} <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">Store</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Top Picks</h2>
            </div>
            <Link href="/store">
              <Button variant="outline" className="hidden sm:flex" data-testid="button-view-all">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/store/${product.slug}`}>
                <Card className="overflow-hidden bg-card border-border hover:border-primary/30 transition-all cursor-pointer group h-full" data-testid={`card-product-${product.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                    <Droplets className="h-16 w-16 text-primary/30" />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">{product.badge}</Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-lg">${product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                    </div>
                    {product.unitSize && (
                      <p className="text-xs text-muted-foreground mt-1">{product.unitSize}{product.unitCount && product.unitCount > 1 ? ` × ${product.unitCount}` : ""}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Bundle / Subscription CTA */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <Badge className="mb-4 bg-primary/20 text-primary border-0">Save 20%</Badge>
              <h3 className="font-display font-bold text-xl mb-2">Subscribe & Save</h3>
              <p className="text-sm text-muted-foreground mb-6">24 bottles delivered monthly. Free shipping. Pause or cancel anytime. Free branded bottle with first order.</p>
              <Link href="/store">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-subscribe-cta">
                  Start Subscription <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
            <Card className="p-8 bg-card border-border">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Best Value</Badge>
              <h3 className="font-display font-bold text-xl mb-2">Bundle & Save</h3>
              <p className="text-sm text-muted-foreground mb-6">Mix and match your favorites. Athlete Pack (12-pack) from $39.99. Recovery Bundle (24-pack) from $59.99.</p>
              <Link href="/store">
                <Button variant="outline" data-testid="button-bundles-cta">
                  View Bundles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Wholesale / B2B */}
      <section id="wholesale" className="py-20 md:py-28 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">Wholesale & B2B</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">Partner With iO2</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From medical clinics to professional sports teams, iO2 Water serves four distinct market segments.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Medical & Clinical", desc: "Hospitals, rehab centers, and clinical practices. HBOT complementary, post-surgical recovery." },
              { icon: Activity, title: "Athletic & Performance", desc: "Pro teams, collegiate athletics, gyms, and training facilities. Bulk pricing available." },
              { icon: Building2, title: "Hospitality & Nightlife", desc: "Hotels, bars, nightclubs, spas, and wellness resorts. White-label options available." },
              { icon: Globe, title: "International Licensing", desc: "Territory licensing from $10K-$250K. Per-bottle royalties. Full brand & production support." },
            ].map((item) => (
              <Card key={item.title} className="p-6 bg-card border-border">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">Reviews</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marcus T.", role: "NFL Strength Coach", text: "My athletes noticed the difference within the first week. Recovery times are down, and performance metrics are trending up across the board.", rating: 5 },
              { name: "Dr. Sarah K.", role: "Functional Medicine", text: "The dissolved oxygen levels in iO2 are genuinely higher than competitors. I've seen measurable improvements in patient SpO2 levels post-consumption.", rating: 5 },
              { name: "Jordan M.", role: "CrossFit Athlete", text: "Less soreness, faster recovery between sessions. The Recovery Can is my go-to after every WOD. The slim can fits perfectly in my gym bag.", rating: 5 },
            ].map((review) => (
              <Card key={review.name} className="p-6 bg-card border-border">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
                <Badge variant="outline" className="mt-3 text-xs border-primary/20 text-primary">Verified Purchase</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">FAQ</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Common Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "What makes iO2 different from regular water?", a: "iO2 Water contains 25mg/L of dissolved oxygen — roughly 5x more than typical bottled water. Our patented MohrO2 process infuses oxygen at the molecular level for maximum stability and bioavailability." },
              { q: "How does oxygen-enriched water work?", a: "When you drink iO2, dissolved oxygen is absorbed through your gastrointestinal tract directly into your bloodstream. This supplemental oxygen supports cellular energy production, muscle recovery, and cognitive function." },
              { q: "Is there clinical evidence?", a: "Yes. Multiple studies have shown oxygen-enriched water can improve blood oxygen saturation. In one notable case, a COPD patient's SpO2 improved from 75% to 93%. We publish our lab reports for transparency." },
              { q: "How should I store iO2?", a: "Store in a cool place away from direct sunlight. Our patented process ensures the oxygen remains dissolved — the bottles are shelf-stable for 12+ months. Once opened, consume within 24 hours for maximum benefit." },
              { q: "Is iO2 safe for everyone?", a: "iO2 is purified water with dissolved oxygen — no additives, no preservatives, no artificial ingredients. It is safe for general consumption. However, as with any product, consult your physician if you have specific health concerns." },
              { q: "How does the subscription work?", a: "Subscribe to receive 24 bottles monthly at 20% off retail price. Free shipping on every delivery. You can pause, skip, or cancel anytime from your dashboard. Your first order includes a free iO2 branded water bottle." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-6" data-testid={`accordion-faq-${i}`}>
                <AccordionTrigger className="text-sm font-semibold text-left py-5 hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs uppercase tracking-widest">Contact</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">Get In Touch</h2>
            <p className="text-muted-foreground">Questions about iO2? Wholesale inquiries? We'd love to hear from you.</p>
          </div>
          <Card className="p-8 bg-card border-border">
            <form onSubmit={(e) => { e.preventDefault(); contactMutation.mutate(contactForm); }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                  required
                  data-testid="input-contact-name"
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                  required
                  data-testid="input-contact-email"
                />
              </div>
              <Input
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(f => ({ ...f, subject: e.target.value }))}
                data-testid="input-contact-subject"
              />
              <Textarea
                placeholder="Your message..."
                value={contactForm.message}
                onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                required
                data-testid="input-contact-message"
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={contactMutation.isPending} data-testid="button-contact-submit">
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <div className="font-semibold text-foreground mb-1">Travis Basham, Founder</div>
                <div>travis@io2water.com</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">Jonathan Swistock, VP Operations</div>
                <div>jonathan@io2water.com</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
