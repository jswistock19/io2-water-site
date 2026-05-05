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
  Droplets, Zap, Brain, Star, Shield, Truck, ArrowRight,
  FlaskConical, Activity, Heart, Building2, Globe, CheckCircle2,
  ChevronRight, Award, Beaker, Leaf, Package, Users, TrendingUp,
  Clock, Target, BarChart3, RefreshCcw
} from "lucide-react";
import type { Product } from "@shared/schema";
import { useState } from "react";
import io2CanImage from "@assets/io2-can-original.jpg";
import { getProductImage } from "@/lib/product-images";

export default function Landing() {
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [emailSignup, setEmailSignup] = useState("");

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40" />
        <div className="absolute top-20 right-0 w-[700px] h-[700px] bg-blue-100/30 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="mb-6 border-blue-300/60 text-blue-700 font-medium px-4 py-1.5 bg-blue-50" data-testid="badge-hero">
                Patented Oxygen Dissolution Technology
              </Badge>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 text-gray-900" data-testid="text-hero-title">
                Next-Generation{" "}
                <span className="text-gradient-cyan">Functional Hydration.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-4">
                Elevated dissolved oxygen hydration — engineered for performance, recovery, and daily use. Zero sugar. Zero caffeine. Zero artificial additives.
              </p>
              <p className="text-base text-gray-500 max-w-2xl mb-8 italic">
                "Water and oxygen — united at a level nature alone cannot achieve."
              </p>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-12">
                <Link href="/store">
                  <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-800 font-semibold px-8 h-12 text-base" data-testid="button-hero-shop">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 h-12 text-base border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-hero-science"
                >
                  Our Science
                </Button>
              </div>

              {/* Key badges */}
              <div className="flex flex-wrap gap-2">
                {["Zero Sugar", "Zero Caffeine", "Clean Label", "Elevated Dissolved O₂", "New Category"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-72 md:w-96">
                <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-3xl scale-110" />
                <img
                  src={io2CanImage}
                  alt="iO2 Precision Crafted — Elevated Dissolved Oxygen Water"
                  className="relative w-full h-auto drop-shadow-2xl"
                  data-testid="img-hero-can"
                />
              </div>
            </div>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-blue-700" data-testid="text-stat-oxygen">60+ mg/L</div>
              <div className="text-xs text-gray-500 mt-1">Dissolved O₂</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-gray-900" data-testid="text-stat-additives">0g</div>
              <div className="text-xs text-gray-500 mt-1">Sugar / Caffeine / Additives</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-gray-900" data-testid="text-stat-patent">~9.0 pH</div>
              <div className="text-xs text-gray-500 mt-1">Alkaline Profile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Physician Endorsed</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span>Patented Technology</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-blue-600" />
              <span>Plastic-Free Production Process</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Free Shipping $50+</span>
            </div>
          </div>
        </div>
      </section>

      {/* A New Category */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">A New Category</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-6 text-gray-900">
                Water and oxygen — united at a level nature alone cannot achieve.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                iO2 is engineered to be the first to unite the two essentials for life at elevated dissolved oxygen concentrations, crafted to set a new standard in hydration. Formulated to support what you'd want from a sports or energy drink — sustained energy, hydration, and recovery — with zero sugar, zero caffeine, and zero artificial additives.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-6 py-2 mb-6">
                <p className="text-blue-900 italic text-base leading-relaxed">
                  "Our proprietary patented process is crafted to mimic nature — then amplify it — producing elevated dissolved oxygen concentrations intended to go far beyond what nature alone achieves."
                </p>
              </blockquote>
              <p className="text-sm text-gray-500">
                The entire iO2 creation process is plastic-free — only <strong>stainless steel</strong> is used from start to finish, ensuring every drop stays pure exactly as nature intended.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Droplets, label: "Elevated Dissolved O₂", value: "60+ mg/L", sub: "vs. ~8–10 in tap water" },
                { icon: Leaf, label: "Zero Sugar / Caffeine", value: "0g", sub: "No artificial additives" },
                { icon: Shield, label: "Alkaline pH", value: "~9.0 pH", sub: "Balanced alkaline profile" },
                { icon: Award, label: "Patented Tech", value: "FDA Instrument", sub: "510k #K131253 validated" },
              ].map(item => (
                <Card key={item.label} className="p-6 bg-white border border-gray-100 shadow-sm text-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="font-display font-bold text-xl text-blue-700 mb-1">{item.value}</div>
                  <div className="font-semibold text-xs text-gray-800 mb-1">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">Why Oxygen Matters</h2>
            <p className="text-blue-200 max-w-xl mx-auto text-sm">Your body is designed to use it. Oxygen is central to everything.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Supports Energy Production*", desc: "Oxygen is central to the body's natural energy processes. ATP — your body's energy currency — powers movement, focus, and recovery." },
              { icon: Brain, title: "Supports Mental Clarity & Focus*", desc: "The brain relies on consistent oxygen availability. iO2 is engineered to support the body's natural oxygen levels and cellular respiration." },
              { icon: Heart, title: "Supports Overall Well-Being*", desc: "Oxygen underpins virtually every natural body process. With sufficient oxygen, the body produces energy far more efficiently." },
            ].map(item => (
              <Card key={item.title} className="p-6 bg-white/10 border-white/20 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-blue-100 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-blue-200/70 text-xs mt-8">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </section>

      {/* Science */}
      <section id="science" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">The Science</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Advanced Dissolved Oxygen Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our proprietary oxygen dissolution technology produces water at 60+ mg/L dissolved oxygen — sustained beyond opening through engineered barrier packaging.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Droplets, step: "01", title: "Purification Phase", desc: "Water undergoes advanced purification to create a pristine, contaminant-free foundation for dissolved oxygen integration." },
              { icon: FlaskConical, step: "02", title: "Controlled Oxygen Dissolution", desc: "Oxygen dissolution technology engineered to elevate dissolved oxygen levels under controlled conditions for maximum bioavailability." },
              { icon: Shield, step: "03", title: "Stabilization", desc: "Proprietary stabilization approach designed to maintain dissolved oxygen within the product over time — sustained beyond opening." },
              { icon: Beaker, step: "04", title: "Preservation Packaging", desc: "Engineered barrier packaging protects dissolved oxygen and preserves product integrity through consumption and beyond opening." },
            ].map((item) => (
              <Card key={item.step} className="p-8 bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-display font-bold text-3xl text-gray-200">{item.step}</span>
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* Key Tech Components */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 bg-blue-50 border-blue-100">
              <h3 className="font-display font-bold text-lg mb-4 text-gray-900">Key Technology Components</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Controlled oxygen dissolution technology",
                  "Engineered barrier packaging",
                  "Proprietary stabilization approach",
                  "Scalable production process",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <h3 className="font-display font-bold text-lg mb-4 text-gray-900">Clinical Validation</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>HUMON near-infrared spectroscopy data showing <strong>+15–22% muscle oxygen improvement</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Directed tcpO2 tissue testing — FDA-cleared instrument: Perimed PeriFlux 6000 (510k #K131253)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Physician endorsements on file — V. Jerome Mirkil, M.D., Board Certified Physician</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Validated using standard dissolved oxygen testing methods</span>
                </div>
              </div>
            </Card>
          </div>

          {/* How iO2 Works — Body diagram section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <h3 className="font-display font-bold text-xl mb-2 text-center text-gray-900">How iO2 Is Designed to Work</h3>
            <p className="text-center text-gray-500 text-sm mb-10">Designed to support oxygen availability in the body</p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "You Drink It", desc: "Ultra-purified water engineered to sustain elevated dissolved oxygen beyond opening." },
                { step: "2", title: "Stomach & Small Intestine", desc: "The oxygen-rich water moves through the digestive system." },
                { step: "3", title: "Oxygen Becomes Available", desc: "Dissolved oxygen moves across the intestinal environment where absorption may occur." },
                { step: "4", title: "Oxygen Available for the Body", desc: "Oxygen becomes available to support the body's natural processes.*" },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center mx-auto mb-3 text-sm">{item.step}</div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-8">*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Oxygen absorption and utilization may vary based on individual physiology and conditions.</p>
          </div>

          {/* iO2 vs Regular Water Comparison */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
            <h3 className="font-display font-bold text-xl mb-8 text-center text-gray-900">iO2 vs. Regular Water</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm font-semibold text-blue-700 mb-3 uppercase tracking-wider">iO2 Water</div>
                <div className="space-y-3">
                  {[
                    "60+ mg/L dissolved oxygen (vs. ~8–10 mg/L in tap water)",
                    "Proprietary oxygen dissolution technology",
                    "Physician endorsed — data on file",
                    "Zero sugar, zero caffeine, zero artificial additives",
                    "Engineered barrier packaging sustains O₂ beyond opening",
                    "Balanced ~9.0 pH alkaline profile",
                    "100% plastic-free production process (stainless steel only)",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Typical Bottled Water</div>
                <div className="space-y-3">
                  {[
                    "~8–10 mg/L dissolved oxygen",
                    "No special oxygen process",
                    "No clinical validation",
                    "May contain additives or flavoring",
                    "Oxygen dissipates quickly after opening",
                    "Standard or acidic pH",
                    "Standard plastic production",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3 text-sm text-gray-400">
                      <div className="h-4 w-4 rounded-full border border-gray-300 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Ritual */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Daily Ritual</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Make it as natural as breakfast.</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Oxygen isn't occasional. Neither should your hydration be. iO2 is crafted to be part of your daily wellness routine — as natural and essential as eating well.*
              </p>
              <div className="space-y-4">
                {[
                  { num: "1", icon: "🌅", title: "Morning — Wake your cells", desc: "Start before coffee. Hydrate with intention, not just habit." },
                  { num: "2", icon: "🏃", title: "Movement — Fuel what matters", desc: "Workout, walk, or long workday — oxygen supports it all." },
                  { num: "3", icon: "🔄", title: "Recovery — Nature does the rest", desc: "Give your body the oxygen it needs to restore and reset.*" },
                  { num: "4", icon: "📅", title: "Every day — Not just some days", desc: "A daily standard, not a special occasion." },
                ].map(item => (
                  <div key={item.num} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">{item.num}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-6">*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="col-span-2 p-6 bg-blue-50 border-blue-100">
                <div className="text-4xl font-display font-bold text-blue-700 mb-1">60+</div>
                <div className="text-sm font-semibold text-gray-700">mg/L Dissolved Oxygen</div>
                <div className="text-xs text-gray-500 mt-1">Produced at 60+ mg/L dissolved oxygen vs. ~8–10 in tap water</div>
              </Card>
              <Card className="p-6 bg-white border border-gray-100 shadow-sm text-center">
                <div className="text-3xl font-display font-bold text-gray-900 mb-1">0g</div>
                <div className="text-xs text-gray-500">Sugar, caffeine, or artificial additives</div>
              </Card>
              <Card className="p-6 bg-white border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-display font-bold text-blue-700 mb-1">~9.0</div>
                <div className="text-xs text-gray-500">pH Alkaline Profile</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Who It's For</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Built for Performance</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              iO2 is designed for athletes, health professionals, biohackers, and anyone committed to a performance-driven, wellness-focused lifestyle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Athletes", desc: "Peak athletic output. Elevated dissolved oxygen supports muscles during training and competition without stimulants or sugar.", color: "from-blue-100 to-blue-50" },
              { icon: Heart, title: "Recovery", desc: "Faster post-workout recovery. Oxygen plays a critical role in cellular energy production and physiological repair.", color: "from-sky-100 to-sky-50" },
              { icon: Brain, title: "Biohackers", desc: "Sustained, proactive hydration for daily health integration. A clean alternative to stimulant-heavy drinks with real functional benefits.", color: "from-indigo-100 to-indigo-50" },
              { icon: Activity, title: "Active Lifestyle", desc: "Designed for health professionals, premium consumers, performance lifestyles, and wellness-focused communities.", color: "from-blue-100 to-indigo-50" },
            ].map((item) => (
              <Link key={item.title} href="/store">
                <Card className="p-6 bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}>
                    <item.icon className="h-7 w-7 text-blue-700" />
                  </div>
                  <h3 className="font-display font-bold text-base mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Old vs New model */}
          <div className="mt-16 bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
            <h3 className="font-display font-bold text-xl mb-2 text-center text-gray-900">Consumer Behaviour is Changing</h3>
            <p className="text-center text-gray-500 text-sm mb-10">A fundamental shift from reactive, stimulant-driven consumption to intentional, performance-focused hydration.</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-center font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">Old Model</div>
                <div className="space-y-3">
                  {["Sugar-heavy formulations", "Artificial additives", "Stimulant-driven energy", "Occasional consumption", "Reactive hydration"].map(item => (
                    <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-100 text-sm text-gray-400">
                      <div className="h-2 w-2 rounded-full bg-gray-200" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-center font-bold text-blue-700 mb-4 uppercase tracking-wider text-sm">New Model — iO2</div>
                <div className="space-y-3">
                  {["Clean-label ingredients", "Functional performance benefits", "Sustained, daily use", "Performance-driven hydration", "Proactive wellness integration"].map(item => (
                    <div key={item} className="flex items-center gap-3 py-2 border-b border-blue-50 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Store</Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-gray-900">Our Products</h2>
            </div>
            <Link href="/store">
              <Button variant="outline" className="hidden sm:flex border-blue-200 text-blue-700 hover:bg-blue-50" data-testid="button-view-all">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/store/${product.slug}`}>
                <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group h-full" data-testid={`card-product-${product.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center relative">
                    <Droplets className="h-16 w-16 text-blue-300" />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-blue-700 text-white text-xs">{product.badge}</Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-sm mb-1 text-gray-900 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    {product.unitSize && (
                      <p className="text-xs text-gray-400 mt-1">{product.unitSize}{product.unitCount && product.unitCount > 1 ? ` × ${product.unitCount}` : ""}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-0 font-medium">Single Can</Badge>
              <div className="font-display font-bold text-3xl text-gray-900 mb-1">$2.69</div>
              <div className="text-sm text-gray-500 mb-4">Per can — 20% of sales</div>
              <div className="text-xs text-gray-400">Available at grocery retail: Target, Walmart, Kroger, Safeway via UNFI/KeHE</div>
            </Card>
            <Card className="p-8 bg-blue-50 border border-blue-200">
              <Badge className="mb-4 bg-blue-700 text-white border-0 font-medium">DTC 12-Pack</Badge>
              <div className="font-display font-bold text-3xl text-blue-700 mb-1">$42.00</div>
              <div className="text-sm text-gray-600 mb-1">$34.99 member price</div>
              <div className="text-sm text-gray-500 mb-4">50% of sales channel</div>
              <div className="text-xs text-gray-500">DrinkiO2.com + Amazon FBA · Subscription programs</div>
            </Card>
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-0 font-medium">PakTech 4-Pack</Badge>
              <div className="font-display font-bold text-3xl text-gray-900 mb-1">$10.75</div>
              <div className="text-sm text-gray-500 mb-4">30% of sales — Gym/Wholesale</div>
              <div className="text-xs text-gray-400">LA Fitness, Equinox, Planet Fitness + Canada, UK, Australia expansion</div>
            </Card>
          </div>

          {/* CTA cards */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-blue-700 to-blue-800 border-0 text-white">
              <Badge className="mb-4 bg-white/20 text-white border-0">Save 20%</Badge>
              <h3 className="font-display font-bold text-xl mb-2">Subscribe & Save</h3>
              <p className="text-sm text-blue-100 mb-6">24 bottles delivered monthly. Free shipping. Pause or cancel anytime. Free branded bottle with first order.</p>
              <Link href="/store">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold" data-testid="button-subscribe-cta">
                  Start Subscription <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">Best Value</Badge>
              <h3 className="font-display font-bold text-xl mb-2 text-gray-900">Bundle & Save</h3>
              <p className="text-sm text-gray-500 mb-6">Mix and match your favorites. DTC 12-Pack from $42.00. PakTech 4-Pack at $10.75. National distribution expanding.</p>
              <Link href="/store">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" data-testid="button-bundles-cta">
                  View Bundles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Market Opportunity</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">A Rapidly Expanding Global Market</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Functional hydration is one of the fastest-growing beverage categories, projected to exceed $250B globally by 2030.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { company: "Celsius", value: "$10B", label: "Market Cap" },
              { company: "BODYARMOR", value: "$5.6B", label: "Acquisition" },
              { company: "Vitaminwater", value: "$4.1B", label: "Acquisition" },
              { company: "Liquid Death", value: "$1.4B", label: "Valuation" },
            ].map(item => (
              <Card key={item.company} className="p-6 bg-white border border-gray-100 shadow-sm text-center">
                <div className="font-display font-bold text-2xl text-blue-700 mb-1">{item.value}</div>
                <div className="font-semibold text-sm text-gray-900">{item.company}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Cultural Shift", desc: "Preventative wellness has moved into daily consumer behaviour — no longer a niche trend but a mainstream lifestyle expectation." },
              { icon: RefreshCcw, title: "Post-COVID Awareness", desc: "Health, immunity, and performance are now top-of-mind globally — creating lasting demand for products that support physiological wellbeing." },
              { icon: Leaf, title: "Clean Consumption", desc: "Consumers moving away from sugar and stimulants — seeking clean-label alternatives that deliver functional benefits without compromise." },
            ].map(item => (
              <Card key={item.title} className="p-6 bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-base mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale / B2B */}
      <section id="wholesale" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Wholesale & B2B</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Partner With iO2</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              iO2 serves performance communities, wellness retailers, fitness environments, and health professionals committed to clean functional hydration.
            </p>
          </div>

          {/* Go-to-Market phases */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { phase: "Phase 01", title: "Community Adoption", items: ["Athletes & performance communities", "Fitness & recovery environments", "Key opinion leaders"] },
              { phase: "Phase 02", title: "Retail Expansion", items: ["Health-focused grocery", "Premium & specialty retail", "Regional market penetration"] },
              { phase: "Phase 03", title: "National Scale", items: ["National retail partnerships", "Strategic distribution networks", "Scaled brand awareness"] },
            ].map(item => (
              <Card key={item.phase} className="p-6 bg-white border border-gray-100 shadow-sm">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-2">{item.phase}</div>
                <h3 className="font-display font-bold text-lg mb-4 text-gray-900">{item.title}</h3>
                <div className="space-y-2">
                  {item.items.map(i => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowRight className="h-3 w-3 text-blue-500" /> {i}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-blue-700 rounded-2xl p-6 text-center text-white mb-12">
            <p className="font-semibold text-sm">Depth-first strategy driving retention, brand credibility, and scalable growth.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Medical & Clinical", desc: "Hospitals, rehab centers, and clinical practices. Clean, stimulant-free hydration for patient care environments." },
              { icon: Activity, title: "Fitness & Wellness", desc: "Gyms, studios, recovery centers, and training facilities. Premium hydration for performance-driven communities." },
              { icon: Building2, title: "Specialty Retail", desc: "Premium grocery, wellness retailers, and specialty distributors. Health-focused consumer channels." },
              { icon: Globe, title: "Distribution Partners", desc: "Seeking strategic distribution partnerships across mass retail, convenience, and national channels." },
            ].map((item) => (
              <Card key={item.title} className="p-6 bg-white border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                <item.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-base mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Early Validation</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Demonstrated Product Performance</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Real-world testing, clinical endorsements, and athlete data confirm iO2's differentiated position.</p>
          </div>

          {/* Performance stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: "18 PRs", label: "Shannon Weldon — single gravel ride with iO2" },
              { stat: "60+ mg/L", label: "Dissolved oxygen — consistently measured" },
              { stat: "+20%", label: "Climbing speed increase — Darryn Padfield" },
            ].map(item => (
              <Card key={item.stat} className="p-6 bg-white border border-gray-100 shadow-sm text-center">
                <div className="font-display font-bold text-3xl text-blue-700 mb-2">{item.stat}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Darryn Padfield", role: "Cyclist", text: "HR was lower than normal, breathing steady — 20% increase in climbing speed. Once you've tried iO2 you won't want regular water again.", rating: 5 },
              { name: "Shannon Weldon", role: "Gravel Racer", text: "With the water, I could keep a steady breath the entire ride. My legs felt great, like they were in auto-drive. 18 PRs set in a single gravel ride with iO2.", rating: 5 },
              { name: "Krista Papp", role: "Endurance Athlete", text: "The experience was repeatable every time. My physical training is up-leveled in ways I wasn't sure was possible.", rating: 5 },
            ].map((review) => (
              <Card key={review.name} className="p-6 bg-white border border-gray-100 shadow-sm">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-400">{review.role}</div>
                </div>
                <Badge variant="outline" className="mt-3 text-xs border-blue-100 text-blue-600">Verified User</Badge>
              </Card>
            ))}
          </div>

          {/* Physician + HUMON data */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-white border border-blue-100 shadow-sm">
              <Award className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Physician Endorsement</h3>
              <p className="text-base text-gray-700 mb-3 italic">
                "It is my opinion that your product represents a significant breakthrough in oxygen delivery."
              </p>
              <p className="text-sm text-gray-500">V. Jerome Mirkil, M.D. — Board Certified Physician</p>
            </Card>
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <BarChart3 className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">HUMON Hex — Muscle Oxygen Data</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-400 uppercase pb-1 border-b border-gray-100">
                  <span>Metric</span><span>Without iO2</span><span className="text-blue-600">With iO2</span>
                </div>
                {[
                  ["Min SMo2", "55%", "70% ↑"],
                  ["Avg SMo2", "67%", "75% ↑"],
                  ["Max SMo2", "73%", "79% ↑"],
                ].map(([m, without, with_io2]) => (
                  <div key={m} className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-gray-50">
                    <span className="text-gray-600">{m}</span>
                    <span className="text-gray-400">{without}</span>
                    <span className="text-blue-600 font-semibold">{with_io2}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Near-infrared spectroscopy · Same athlete, same conditions · Dec 2019</p>
            </Card>
          </div>

          {/* Our Standards */}
          <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Our Promise</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Premium ingredients. Thoughtful innovation. Elevated hydration. iO2 is built for those who demand more from what they drink.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Our Standards</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Non-GMO", "BPA-Free", "No Artificial Additives", "Recyclable Packaging", "Plastic-Free Process", "Clean Label"].map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section id="team" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Leadership</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">The Team</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Deep expertise in beverage manufacturing, strategic partnerships, brand development, and scientific validation — positioned to scale iO2.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                name: "Jonathan Pierce",
                role: "Co-Founder & Head of Production",
                color: "bg-blue-700",
                desc: "40+ years in the global water industry. Oversees manufacturing strategy, production infrastructure, quality control, & supply chain logistics.",
                tags: ["Production", "Quality", "Supply Chain"],
              },
              {
                name: "Susie Sears-Pierce",
                role: "Co-Founder & Head of Operations & Fulfillment",
                color: "bg-blue-600",
                desc: "Leads internal operations, fulfillment logistics, and administrative management. Ensures operational efficiency across the organization.",
                tags: ["Operations", "Logistics", "Admin"],
              },
            ].map(member => (
              <Card key={member.name} className="p-6 bg-white border border-gray-100 shadow-sm flex items-start gap-5">
                <div className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center flex-shrink-0`}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-base text-gray-900">{member.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-3">{member.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map(t => <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{t}</span>)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Advisory Board */}
          <Card className="p-6 bg-blue-50 border border-blue-100">
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-3">Advisory Board</div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">Jonathan Dyer</h3>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">Founder, A&L Laboratory | Senior Scientific Advisor — Water Chemistry & Quality Systems</p>
                <p className="text-sm text-gray-600">40+ years in water chemistry and laboratory systems. Leads dissolved oxygen validation, testing protocols, and quality system development to ensure product integrity compliance, and independent validation of iO2 core technology.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Water Chemistry", "Validation", "Quality Systems"].map(t => <span key={t} className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded-full border border-blue-200">{t}</span>)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">FAQ</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-gray-900">Common Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "What makes iO2 different from regular water?", a: "iO2 is produced at 60+ mg/L dissolved oxygen — verified using standard dissolved oxygen testing methods. Tap water contains approximately 8–10 mg/L. Our proprietary oxygen dissolution technology is engineered for maximum bioavailability with sustained O₂ levels beyond opening, thanks to engineered barrier packaging." },
              { q: "What is the pH of iO2 Water?", a: "iO2 has a balanced ~9.0 pH alkaline profile, delivering a smooth taste alongside elevated dissolved oxygen. Clean formulation with no sugar, no caffeine, and no artificial additives." },
              { q: "How does oxygen-enriched water work?", a: "Oxygen plays a critical role in cellular respiration. ATP — the body's primary energy molecule — is produced through aerobic respiration, a well-established biological process. iO2 is engineered to deliver dissolved oxygen at concentrations far beyond ordinary water — nature does the rest. Oxygen absorption may vary.*" },
              { q: "Is there clinical evidence?", a: "iO2 has physician endorsements on file, consistent return behavior from users, and HUMON near-infrared spectroscopy data showing +15–22% muscle oxygen improvement. Directed tcpO2 tissue testing using an FDA-cleared instrument (Perimed PeriFlux 6000, 510k #K131253) is also on file. iO2 does not make specific health claims beyond established scientific principles." },
              { q: "What is the production process?", a: "iO2 uses a four-stage process: advanced water purification, controlled oxygen dissolution technology, proprietary stabilization, and engineered barrier packaging. The entire production process is plastic-free — only stainless steel is used from start to finish." },
              { q: "How should I store iO2?", a: "Store in a cool place away from direct sunlight. Our engineered barrier packaging is designed to preserve dissolved oxygen and maintain product integrity. Once opened, consume promptly for the best experience." },
              { q: "How does the subscription work?", a: "Subscribe to receive 24 bottles monthly at 20% off retail price. Free shipping on every delivery. You can pause, skip, or cancel anytime from your dashboard. Your first order includes a free iO2 branded water bottle." },
              { q: "Where is iO2 available?", a: "iO2 is available direct-to-consumer at DrinkiO2.com with subscription programs. We are actively expanding into specialty retail, health-focused grocery, fitness facilities, and national distribution channels. Contact us for wholesale inquiries." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm" data-testid={`accordion-faq-${i}`}>
                <AccordionTrigger className="text-sm font-semibold text-left py-5 hover:no-underline text-gray-900">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 pb-5 leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-xs text-gray-400 mt-8">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-20 bg-blue-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">Be among the first to experience iO₂.</h2>
          <p className="text-blue-200 mb-8">Join our founding circle for early access, exclusive updates, and a front-row seat to something new in hydration.</p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); toast({ title: "You're in!", description: "We'll be in touch soon." }); setEmailSignup(""); }}>
            <Input
              type="email"
              placeholder="Your email address"
              value={emailSignup}
              onChange={e => setEmailSignup(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 flex-1"
            />
            <Button type="submit" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold whitespace-nowrap">
              Get Updates
            </Button>
          </form>
          <p className="text-blue-300 text-xs mt-4">No spam, ever. Just meaningful updates from the iO2 team.</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 text-xs uppercase tracking-widest bg-blue-50">Contact</Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-gray-500">Questions about iO2? Wholesale inquiries? We'd love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <Globe className="h-6 w-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Order & Find iO2</h3>
              <p className="text-sm text-gray-500 mb-2">Find a store near you or order online.</p>
              <a href="https://DrinkiO2.com" className="text-sm text-blue-600 font-medium hover:underline">DrinkiO2.com →</a>
            </Card>
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <Package className="h-6 w-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Wholesale & Partnerships</h3>
              <p className="text-sm text-gray-500 mb-2">Let's build something powerful together.</p>
              <a href="mailto:hello@drinkiO2.com" className="text-sm text-blue-600 font-medium hover:underline">hello@drinkiO2.com →</a>
            </Card>
          </div>
          <Card className="p-8 bg-white border border-gray-100 shadow-sm">
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
              <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800" disabled={contactMutation.isPending} data-testid="button-contact-submit">
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
