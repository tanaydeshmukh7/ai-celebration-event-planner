"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEventContext } from "@/lib/store/event-context";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Wallet,
  Store,
  Users2,
  Clock,
  ShieldCheck,
  Zap,
  TrendingDown,
  Gift,
  Building2,
  GraduationCap,
  HeartHandshake,
  Cake,
  Heart,
  ChevronRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

const EVENT_TYPES = [
  {
    title: "Indian Weddings",
    category: "wedding",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Sangeet, Mehendi, Mandap decor, and multi-day ceremonies orchestrated with precision.",
    budgetSample: "₹5,00,000+",
  },
  {
    title: "Milestone Birthdays",
    category: "birthday",
    icon: Cake,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    description: "From 1st birthdays to the big 30th and 50th jubilees. Themed decor and live entertainment.",
    budgetSample: "₹30,000 - ₹1,50,000",
  },
  {
    title: "Silver & Golden Anniversaries",
    category: "anniversary",
    icon: Gift,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    description: "Intimate family banquets, nostalgic video timelines, and champagne toasts.",
    budgetSample: "₹75,000 - ₹3,00,000",
  },
  {
    title: "Corporate Summits & Galas",
    category: "corporate",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    description: "Product launches, annual awards, and executive retreats with strict budget governance.",
    budgetSample: "₹1,50,000 - ₹10,00,000",
  },
  {
    title: "College Festivals & Fests",
    category: "college",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    description: "Artist line-ups, campus stages, sponsor zones, and student coordination timelines.",
    budgetSample: "₹1,00,000 - ₹6,00,000",
  },
  {
    title: "Community Gatherings",
    category: "community",
    icon: HeartHandshake,
    image: "https://images.unsplash.com/photo-1545232979-fbf675038c1a?auto=format&fit=crop&w=800&q=80",
    description: "Festival celebrations, society get-togethers, and charity galas planned smoothly.",
    budgetSample: "₹40,000 - ₹2,00,000",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Event Strategy Engine",
    description:
      "Transform simple prompts like '₹30,000 birthday in Pune for 50 people' into complete budgets, timelines, themes, and vendor requirements.",
  },
  {
    icon: Wallet,
    title: "Smart INR Budget Manager",
    description:
      "Auto-allocate budgets across 9 event categories, log deposits, track paid vs pending balances, and get AI-powered cost-saving alternatives.",
  },
  {
    icon: Clock,
    title: "Minute-by-Minute Itineraries",
    description:
      "Avoid day-of chaos with automated countdowns, deadline conflict warnings, and chronological event-day stage schedules.",
  },
  {
    icon: Store,
    title: "Vetted Vendor Comparison",
    description:
      "Browse curated Indian banquet halls, caterers, photographers, and decorators. Compare quotes side-by-side and manage booking deposits.",
  },
  {
    icon: Users2,
    title: "Guest List & WhatsApp RSVPs",
    description:
      "Share personalized RSVP links, track dietary restrictions (Jain, Veg, Vegan), and auto-calculate precise catering portions.",
  },
  {
    icon: Zap,
    title: "Dynamic Plan Rebalancing",
    description:
      "Need to cut budget by 20% or add 30 guests? Simply tell the AI and it recalculates your expenses and timelines immediately.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Share Your Vision",
    description:
      "Enter your event type, guest count, city, and INR budget in our streamlined 4-step wizard.",
  },
  {
    step: "02",
    title: "AI Crafts the Master Plan",
    description:
      "Gemini generates category-wise allocations, milestone checklists, custom themes, and venue suggestions.",
  },
  {
    step: "03",
    title: "Coordinate & Celebrate",
    description:
      "Track expenses, manage RSVPs, communicate with vendors, and follow the live day-of timeline with zero stress.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Planned my brother's 30th birthday in Pune on a tight ₹30,000 budget. The AI suggested a live pasta bar instead of a formal dinner, saving us ₹8,000 while delighting all 50 guests!",
    author: "Rohan Deshmukh",
    role: "Birthday Host",
    city: "Pune",
    badge: "Sample Verified Story",
  },
  {
    quote:
      "Managing 350 wedding guests across 3 days felt impossible until CelebrationAI split our budget and created separate timelines for Sangeet and Reception. Truly a lifesaver.",
    author: "Sneha & Varun Iyer",
    role: "Newlyweds",
    city: "Mumbai",
    badge: "Sample Verified Story",
  },
  {
    quote:
      "Our university cultural fest needed sponsorship tracking and sound vendor quotes. We generated the entire day-of itinerary in minutes.",
    author: "Aditya Mehta",
    role: "College Fest Convenor",
    city: "Bengaluru",
    badge: "Sample Verified Story",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { loginAsGuest, activeEvent } = useEventContext();

  const handleExploreDemo = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col selection:bg-lavender-300 selection:text-plum-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-lavender-200/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -z-10 h-80 w-80 rounded-full bg-coral-100/40 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-plum-200 bg-lavender-100/80 px-4 py-1.5 text-xs font-semibold text-plum-900 shadow-sm">
              <Sparkles className="h-4 w-4 text-coral-500 animate-pulse" />
              <span>Next-Gen Celebration Intelligence with Gemini AI</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-plum-950 leading-[1.15]">
              Every Celebration, <br />
              <span className="italic font-normal text-coral-600">
                Beautifully Planned.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-xl text-[#5D2962] leading-relaxed max-w-2xl mx-auto">
              Transform your celebration ideas into complete, actionable master plans.
              Intelligent Indian rupee budget breakdowns, day-of timelines, vetted vendors,
              and live guest RSVPs — available 24/7.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/wizard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-hover hover:scale-[1.02] transition-all"
              >
                <span>Plan My Event</span>
                <ArrowRight className="h-5 w-5 text-coral-400" />
              </Link>

              <button
                onClick={handleExploreDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-plum-900 bg-white hover:bg-warmgray-50 border border-[#DED7CA] shadow-soft transition-all"
              >
                <Sparkles className="h-5 w-5 text-coral-500" />
                <span>Explore Live Demo (Pune Bash)</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#756B5B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-coral-600" />
                <span>No credit card required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-coral-600" />
                <span>Instant INR budget allocation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-coral-600" />
                <span>Real-time RSVP link generator</span>
              </span>
            </div>
          </div>

          {/* Interactive Dashboard Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-[#EAE5DC] bg-white p-4 sm:p-6 shadow-hover overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold text-plum-900 font-serif">
                  Aarav's 30th Milestone Birthday Bash • Skyline Rooftop, Pune
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-coral-100 text-coral-700 font-bold">
                23 Days to Go
              </span>
            </div>

            {/* Quick Stat Pill Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl bg-[#FAF8F4] p-4 border border-[#ECE7DE]">
                <div className="text-xs text-[#756B5B] font-medium">Total Budget</div>
                <div className="text-xl font-bold font-serif text-plum-900 mt-1">₹30,000</div>
                <div className="text-[11px] text-green-700 font-semibold mt-0.5">₹2,700 within target</div>
              </div>
              <div className="rounded-2xl bg-[#FAF8F4] p-4 border border-[#ECE7DE]">
                <div className="text-xs text-[#756B5B] font-medium">Guests Attending</div>
                <div className="text-xl font-bold font-serif text-plum-900 mt-1">11 Confirmed</div>
                <div className="text-[11px] text-[#756B5B] mt-0.5">50 Expected capacity</div>
              </div>
              <div className="rounded-2xl bg-[#FAF8F4] p-4 border border-[#ECE7DE]">
                <div className="text-xs text-[#756B5B] font-medium">Task Readiness</div>
                <div className="text-xl font-bold font-serif text-plum-900 mt-1">45% Done</div>
                <div className="text-[11px] text-coral-600 font-semibold mt-0.5">5 Pending milestones</div>
              </div>
              <div className="rounded-2xl bg-[#FAF8F4] p-4 border border-[#ECE7DE]">
                <div className="text-xs text-[#756B5B] font-medium">Curated Theme</div>
                <div className="text-xl font-bold font-serif text-plum-900 mt-1 truncate">Boho Rooftop</div>
                <div className="flex gap-1 mt-1">
                  <span className="h-3 w-3 rounded-full bg-[#4C234F]" />
                  <span className="h-3 w-3 rounded-full bg-[#FF8066]" />
                  <span className="h-3 w-3 rounded-full bg-[#EAE3F4]" />
                </div>
              </div>
            </div>

            {/* Interactive snippet banner */}
            <div className="rounded-2xl bg-lavender-100/70 p-4 border border-lavender-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-plum-800 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-coral-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-plum-900">
                    Live AI Recommendation Loaded
                  </h4>
                  <p className="text-xs text-[#756B5B]">
                    "Finger foods & live pasta stations will save ₹8,000 vs. formal sit-down dinner."
                  </p>
                </div>
              </div>
              <button
                onClick={handleExploreDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-sm shrink-0"
              >
                Launch Dashboard Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Showcase */}
      <section id="event-types" className="py-20 bg-[#F7F4EE] border-y border-[#EAE5DC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Celebration Formats
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum-950">
              Tailored for Every Milestone
            </h2>
            <p className="text-sm text-[#756B5B]">
              Whether an intimate birthday in Pune or a 500-guest sangeet in Jaipur,
              our AI customizes vendors, timelines, and budgets to your scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.category}
                  className="group rounded-3xl bg-white border border-[#EAE5DC] overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-warmgray-200">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 rounded-xl bg-plum-900/80 backdrop-blur-sm p-2 text-white">
                      <Icon className="h-5 w-5 text-coral-400" />
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-plum-900 shadow-sm">
                      {type.budgetSample}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-plum-950 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-xs text-[#756B5B] leading-relaxed mb-4">
                        {type.description}
                      </p>
                    </div>

                    <Link
                      href={`/wizard?category=${type.category}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-plum-800 hover:text-coral-600 transition-colors"
                    >
                      <span>Plan this celebration</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Powerful Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum-950">
              Everything Needed for a Flawless Event
            </h2>
            <p className="text-sm text-[#756B5B]">
              Say goodbye to messy spreadsheets, fragmented WhatsApp chats, and forgotten vendor deposits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-[#EAE5DC] bg-white p-8 shadow-soft hover:shadow-hover transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-200 text-plum-800 mb-6">
                    <Icon className="h-6 w-6 text-coral-600" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-plum-950 mb-2.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#756B5B] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Steps: How It Works */}
      <section id="how-it-works" className="py-20 bg-plum-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-coral-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-lavender-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
              Effortless Planning
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              How CelebrationAI Works
            </h2>
            <p className="text-sm text-lavender-200">
              From raw concept to confirmed guests in under three minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="rounded-3xl border border-plum-800/80 bg-plum-900/40 p-8 backdrop-blur-sm relative"
              >
                <div className="font-serif text-4xl font-bold text-coral-500/80 mb-4">
                  {step.step}
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-lavender-200/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-plum-950 bg-coral-500 hover:bg-coral-400 shadow-hover transition-all"
            >
              <span>Start Planning Your Event</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28 bg-[#FAF8F4]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Community Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum-950">
              Celebrations Turned Unforgettable
            </h2>
            <p className="text-sm text-[#756B5B]">
              Read how real planners and hosts bring their dream parties to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#EAE5DC] bg-white p-8 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-lavender-100 text-plum-900 text-[10px] font-bold uppercase tracking-wider mb-4">
                    {t.badge}
                  </div>
                  <p className="text-sm text-[#222126] italic leading-relaxed mb-6 font-serif">
                    "{t.quote}"
                  </p>
                </div>
                <div className="border-t border-[#ECE7DE] pt-4">
                  <div className="font-bold text-xs text-plum-950">{t.author}</div>
                  <div className="text-[11px] text-[#756B5B]">
                    {t.role} • {t.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-plum-800 p-8 sm:p-14 text-white text-center shadow-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-coral-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Ready to Plan Your Next Unforgettable Event?
              </h2>
              <p className="text-sm sm:text-base text-lavender-200">
                Join thousands of hosts saving hours of coordination and thousands of rupees with intelligent planning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/wizard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-plum-950 bg-white hover:bg-lavender-100 shadow-md transition-all"
                >
                  <span>Launch Event Wizard</span>
                  <Sparkles className="h-4 w-4 text-coral-600" />
                </Link>
                <button
                  onClick={handleExploreDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-plum-900/60 hover:bg-plum-900 border border-plum-700 transition-all"
                >
                  <span>Explore Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
