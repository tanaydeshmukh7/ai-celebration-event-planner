"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users2,
  Wallet,
  Palette,
  CheckCircle2,
  Utensils,
  Layers,
  Heart,
  Loader2,
} from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import {
  EventCategory,
  BudgetFlexibility,
  Formality,
  FoodPreference,
  PlanningIntensity,
  DIYPreference,
  BudgetCategory,
} from "@/lib/types";

const CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: "Birthday Party", value: "birthday" },
  { label: "Indian Wedding", value: "wedding" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Corporate Event", value: "corporate" },
  { label: "College Fest", value: "college" },
  { label: "Community Gathering", value: "community" },
  { label: "Other Celebration", value: "other" },
];

const MUST_HAVE_OPTIONS = [
  "Live DJ / Acoustic Band",
  "Custom Photo Booth & Props",
  "Signature Mocktail / Cocktail Bar",
  "Cinematic Drone Photography",
  "Interactive Live Cooking Counters",
  "Ambient Fairy Light Canopy",
  "Custom Birthday / Wedding Cake",
  "Digital WhatsApp RSVP Page",
];

function WizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as EventCategory) || "birthday";

  const { createEvent, applyAIPlanToEvent } = useEventContext();

  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState("Analyzing event requirements...");

  // Form State
  // Step 1: Basics
  const [title, setTitle] = useState("Milestone Birthday Celebration");
  const [category, setCategory] = useState<EventCategory>(initialCategory);
  const [eventDate, setEventDate] = useState("2026-11-28");
  const [city, setCity] = useState("Pune");
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [expectedGuests, setExpectedGuests] = useState(50);

  // Step 2: Budget
  const [totalBudget, setTotalBudget] = useState(30000);
  const [budgetFlexibility, setBudgetFlexibility] = useState<BudgetFlexibility>("flexible");
  const [priorityCategories, setPriorityCategories] = useState<BudgetCategory[]>([
    "catering",
    "venue",
    "decoration",
    "entertainment",
  ]);

  // Step 3: Style & Preferences
  const [theme, setTheme] = useState("Warm Bohemian Rooftop Sunset with Fairy Lights");
  const [formality, setFormality] = useState<Formality>("Semi-formal");
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("Mixed");
  const [culturalRequirements, setCulturalRequirements] = useState(
    "Separate vegetarian and Jain counter requested"
  );

  // Step 4: Planning Preferences
  const [diyPreference, setDiyPreference] = useState<DIYPreference>("Balanced");
  const [planningIntensity, setPlanningIntensity] = useState<PlanningIntensity>("Moderate");
  const [mustHaves, setMustHaves] = useState<string[]>([
    "Live DJ / Acoustic Band",
    "Custom Photo Booth & Props",
  ]);
  const [notes, setNotes] = useState(
    "Looking for a memorable evening celebration overlooking the city."
  );

  const togglePriority = (cat: BudgetCategory) => {
    setPriorityCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMustHave = (item: string) => {
    setMustHaves((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    setGenerating(true);

    try {
      setGenerationPhase("Synthesizing INR budget allocation & cost strategies...");
      // 1. Create the event record in local state/database
      const newEvent = createEvent({
        title,
        category,
        event_date: eventDate,
        city,
        is_outdoor: isOutdoor,
        expected_guests: expectedGuests,
        total_budget: totalBudget,
        budget_flexibility: budgetFlexibility,
        priority_categories: priorityCategories,
        theme,
        color_palette: ["#4C234F", "#FF8066", "#EAE3F4", "#FAF8F4"],
        formality,
        food_preference: foodPreference,
        cultural_requirements: culturalRequirements,
        planning_intensity: planningIntensity,
        diy_preference: diyPreference,
        must_have_features: mustHaves,
        notes,
        status: "planning",
      });

      // 2. Call AI API for end-to-end plan generation
      setGenerationPhase("Consulting Gemini AI for vendor needs and event-day timeline...");
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          city,
          expected_guests: expectedGuests,
          total_budget: totalBudget,
          event_date: eventDate,
          formality,
          food_preference: foodPreference,
          theme,
          must_have_features: mustHaves,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setGenerationPhase("Finalizing master schedule and checklist...");
        applyAIPlanToEvent(data.plan);
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err) {
      console.error("Wizard AI Generation Error:", err);
      // Still forward to dashboard with heuristic plan
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between selection:bg-lavender-300">
      {/* Top Header */}
      <header className="border-b border-[#EAE5DC] bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-plum-800 text-white flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-coral-500" />
            </div>
            <span className="font-serif font-bold text-plum-950 text-base">
              CelebrationAI Wizard
            </span>
          </Link>

          <span className="text-xs font-semibold text-[#756B5B]">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main Wizard Form Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Progress Bar */}
        <div className="w-full bg-[#ECE7DE] h-2 rounded-full overflow-hidden mb-8">
          <div
            className="bg-plum-800 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {generating ? (
          <div className="bg-white rounded-3xl border border-[#EAE5DC] p-12 text-center shadow-hover space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-lavender-200 flex items-center justify-center animate-spin">
                  <Sparkles className="h-8 w-8 text-coral-600" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-plum-950">
                Crafting Your Custom Celebration Plan
              </h3>
              <p className="text-sm text-plum-800 font-medium animate-pulse">
                {generationPhase}
              </p>
              <p className="text-xs text-[#756B5B] max-w-md mx-auto">
                Allocating ₹{totalBudget.toLocaleString("en-IN")} across 9 categories,
                building an event-day timeline, and matching local {city} catering solutions.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#EAE5DC] p-6 sm:p-10 shadow-soft">
            {/* Step 1: Event Basics */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-plum-950">
                    Tell us about your celebration
                  </h2>
                  <p className="text-xs text-[#756B5B] mt-1">
                    Every grand celebration starts with simple details.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1.5">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Aarav's 30th Milestone Birthday Bash"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as EventCategory)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Host City / Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Expected Guests *
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={5000}
                        required
                        value={expectedGuests}
                        onChange={(e) => setExpectedGuests(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-2">
                      Venue Environment
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsOutdoor(false)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          !isOutdoor
                            ? "bg-plum-800 text-white border-plum-800 shadow-sm"
                            : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                        }`}
                      >
                        Indoor (Banquet, Restaurant, Hall)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOutdoor(true)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          isOutdoor
                            ? "bg-plum-800 text-white border-plum-800 shadow-sm"
                            : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                        }`}
                      >
                        Outdoor (Rooftop, Lawn, Poolside)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-plum-950">
                    Budget & Spending Strategy
                  </h2>
                  <p className="text-xs text-[#756B5B] mt-1">
                    Enter your total planned amount in Indian Rupees (INR).
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1.5">
                      Total Planned Budget (₹ INR) *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-sm font-bold text-[#756B5B]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={5000}
                        step={1000}
                        required
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-base font-bold text-plum-950"
                      />
                    </div>
                    <div className="text-[11px] text-[#756B5B] mt-1">
                      Per person estimate: ~₹{Math.round(totalBudget / expectedGuests)} per guest
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-2">
                      Budget Flexibility
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["strict", "flexible", "open"] as BudgetFlexibility[]).map((flex) => (
                        <button
                          key={flex}
                          type="button"
                          onClick={() => setBudgetFlexibility(flex)}
                          className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                            budgetFlexibility === flex
                              ? "bg-plum-800 text-white border-plum-800 shadow-sm"
                              : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                          }`}
                        >
                          {flex}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-2">
                      Priority Categories (Select where you want maximum impact)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "catering", label: "Food & Catering" },
                        { id: "venue", label: "Venue & Atmosphere" },
                        { id: "decoration", label: "Floral & Decor" },
                        { id: "entertainment", label: "DJ & Music" },
                        { id: "photography", label: "Photography & Video" },
                        { id: "gifts", label: "Return Gifts & Favors" },
                      ].map((item) => {
                        const active = priorityCategories.includes(item.id as BudgetCategory);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => togglePriority(item.id as BudgetCategory)}
                            className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                              active
                                ? "bg-lavender-200 border-plum-800 text-plum-900 font-bold"
                                : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                            }`}
                          >
                            <span>{item.label}</span>
                            {active && <CheckCircle2 className="h-4 w-4 text-coral-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Style and Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-plum-950">
                    Style, Food & Ambiance
                  </h2>
                  <p className="text-xs text-[#756B5B] mt-1">
                    Guide our AI to recommend matching decoration and catering styles.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1.5">
                      Desired Theme or Vibe
                    </label>
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="e.g. Warm Bohemian Rooftop with Fairy Lights"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Formality
                      </label>
                      <select
                        value={formality}
                        onChange={(e) => setFormality(e.target.value as Formality)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      >
                        <option value="Casual">Casual & Relaxed</option>
                        <option value="Semi-formal">Semi-formal / Festive</option>
                        <option value="Formal">Formal & Elegant</option>
                        <option value="Black Tie">Black Tie Gala</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Food Preference
                      </label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value as FoodPreference)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      >
                        <option value="Vegetarian">Pure Vegetarian</option>
                        <option value="Mixed">Mixed (Veg & Non-Veg)</option>
                        <option value="Pure Veg / Jain">Jain / Swaminarayan Friendly</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Vegetarian">Non-Vegetarian Focused</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1.5">
                      Cultural or Dietary Requirements
                    </label>
                    <input
                      type="text"
                      value={culturalRequirements}
                      onChange={(e) => setCulturalRequirements(e.target.value)}
                      placeholder="e.g. Halal meat, separate Jain buffet table, senior citizen wheelchair access"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Planning Preferences & Must-Haves */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-plum-950">
                    Planning Approach & Must-Haves
                  </h2>
                  <p className="text-xs text-[#756B5B] mt-1">
                    Final details before generating your personalized event blueprint.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        DIY vs. Professional Vendors
                      </label>
                      <select
                        value={diyPreference}
                        onChange={(e) => setDiyPreference(e.target.value as DIYPreference)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      >
                        <option value="Balanced">Balanced (Some DIY, key pros)</option>
                        <option value="Full Professional">Full Professional Vendors</option>
                        <option value="Full DIY">Mostly DIY & Friends helping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-plum-900 mb-1.5">
                        Planning Intensity
                      </label>
                      <select
                        value={planningIntensity}
                        onChange={(e) => setPlanningIntensity(e.target.value as PlanningIntensity)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                      >
                        <option value="Moderate">Moderate (Key milestones)</option>
                        <option value="Detail-oriented">Detail-oriented (Minute-by-minute)</option>
                        <option value="Relaxed">Relaxed (Low stress essentials)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-2">
                      Must-Have Elements
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {MUST_HAVE_OPTIONS.map((item) => {
                        const active = mustHaves.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleMustHave(item)}
                            className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                              active
                                ? "bg-lavender-200 border-plum-800 text-plum-900 font-bold"
                                : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                            }`}
                          >
                            <span>{item}</span>
                            {active && <CheckCircle2 className="h-4 w-4 text-coral-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1.5">
                      Additional Notes or Special Requests
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requests or context for the AI..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-[#ECE7DE] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-hover hover:scale-105 transition-all"
                >
                  <Sparkles className="h-4 w-4 text-coral-500" />
                  <span>Generate My AI Master Plan</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Wizard Footer */}
      <footer className="py-4 text-center text-xs text-[#998E7D] border-t border-[#EAE5DC] bg-white">
        CelebrationAI • Generates budget, timeline, vendor comparison & guest RSVPs
      </footer>
    </div>
  );
}

export default function EventWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center text-xs text-[#756B5B]">
          Loading Event Wizard...
        </div>
      }
    >
      <WizardForm />
    </Suspense>
  );
}
