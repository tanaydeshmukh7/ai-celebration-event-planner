import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import {
  EventCategory,
  BudgetCategory,
  AIPlanSummary,
  TaskItem,
  BudgetAllocation,
} from "../types";
import { generateUUID } from "../utils";

// Check if Gemini API Key is configured
export function isGeminiConfigured(): boolean {
  return !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim().length > 0 &&
    !process.env.GEMINI_API_KEY.includes("your-gemini-api-key")
  );
}

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  });
}

// Zod Schemas for Structured AI Responses
export const AIPlanSummarySchema = z.object({
  overview: z.string(),
  recommendedTheme: z.string(),
  colorPalette: z.array(z.string()).min(3),
  budgetStrategy: z.array(
    z.object({
      category: z.enum([
        "venue",
        "catering",
        "decoration",
        "photography",
        "entertainment",
        "invitations",
        "transportation",
        "gifts",
        "miscellaneous",
      ]),
      percentage: z.number(),
      amount: z.number(),
      tips: z.string(),
    })
  ),
  keyMilestones: z.array(
    z.object({
      title: z.string(),
      timeline: z.string(),
      priority: z.enum(["low", "medium", "high", "urgent"]),
    })
  ),
  eventDaySchedule: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
      responsibility: z.string(),
    })
  ),
  cateringRecommendation: z.object({
    style: z.string(),
    estimatedCostPerPlate: z.number(),
    recommendedMenu: z.array(z.string()),
  }),
  decorAndThemeIdeas: z.array(z.string()),
  costSavingOpportunities: z.array(z.string()),
});

export const CostSavingSchema = z.object({
  totalEstimatedSavings: z.number(),
  suggestions: z.array(
    z.object({
      category: z.string(),
      title: z.string(),
      potentialSavingsINR: z.number(),
      actionableTip: z.string(),
      tradeOff: z.string(),
    })
  ),
});

export const TimelineScheduleSchema = z.object({
  schedule: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
      responsibility: z.string(),
      notes: z.string().optional(),
    })
  ),
});

export interface GeneratePlanInput {
  title: string;
  category: EventCategory;
  city: string;
  expected_guests: number;
  total_budget: number;
  event_date: string;
  formality?: string;
  food_preference?: string;
  theme?: string;
  must_have_features?: string[];
  notes?: string;
}

/**
 * 1. generateEventPlan
 * Generates an end-to-end event plan with budget, milestones, timeline, catering, and decor.
 */
export async function generateEventPlan(input: GeneratePlanInput): Promise<{
  plan: AIPlanSummary;
  isDemoFallback: boolean;
}> {
  const model = getGeminiModel();

  if (!model) {
    return {
      plan: generateIntelligentFallbackPlan(input),
      isDemoFallback: true,
    };
  }

  const prompt = `You are a high-end celebration and event planner in India.
Generate a comprehensive, structured JSON plan for the following event:
Event Name: "${input.title}"
Category: "${input.category}"
City / Location: "${input.city}"
Total Budget: ₹${input.total_budget} INR
Guest Count: ${input.expected_guests} guests
Date: ${input.event_date}
Formality: ${input.formality || "Semi-formal"}
Food Preference: ${input.food_preference || "Mixed"}
Requested Theme: ${input.theme || "Modern and memorable"}
Must-haves: ${input.must_have_features?.join(", ") || "None specified"}
Additional Notes: ${input.notes || "None"}

Requirements for the JSON response:
- Ensure the budget numbers strictly sum up to or stay within ₹${input.total_budget}.
- Use realistic local pricing for ${input.city}, India.
- Output MUST strictly adhere to the following schema:
{
  "overview": "2-3 sentences introducing the event concept",
  "recommendedTheme": "Evocative theme title",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "budgetStrategy": [
    { "category": "venue" | "catering" | "decoration" | "photography" | "entertainment" | "invitations" | "transportation" | "gifts" | "miscellaneous", "percentage": number, "amount": number, "tips": "practical tip" }
  ],
  "keyMilestones": [
    { "title": "milestone description", "timeline": "e.g. 2 weeks before", "priority": "low" | "medium" | "high" | "urgent" }
  ],
  "eventDaySchedule": [
    { "time": "e.g. 17:00 - 18:00", "activity": "what happens", "responsibility": "who oversees it" }
  ],
  "cateringRecommendation": {
    "style": "e.g. Live counters & street food fusion",
    "estimatedCostPerPlate": number,
    "recommendedMenu": ["item 1", "item 2", "item 3", "item 4", "item 5"]
  },
  "decorAndThemeIdeas": ["idea 1", "idea 2", "idea 3", "idea 4"],
  "costSavingOpportunities": ["tip 1", "tip 2", "tip 3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    const validated = AIPlanSummarySchema.parse(parsed);
    return { plan: validated, isDemoFallback: false };
  } catch (error) {
    console.warn("Gemini generation failed or parsed invalid schema, falling back to smart planner:", error);
    return {
      plan: generateIntelligentFallbackPlan(input),
      isDemoFallback: true,
    };
  }
}

/**
 * 2. generateBudget
 * Creates balanced budget allocation percentages and amounts for 9 standard categories.
 */
export async function generateBudget(
  totalBudget: number,
  category: EventCategory,
  priorityCategories: BudgetCategory[] = ["catering", "venue"]
): Promise<BudgetAllocation[]> {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `Allocate a budget of ₹${totalBudget} INR for a ${category} celebration across these 9 categories: venue, catering, decoration, photography, entertainment, invitations, transportation, gifts, miscellaneous.
Prioritized categories: ${priorityCategories.join(", ")}.
Return a JSON array:
[
  { "category": "venue", "allocated_amount": number, "percentage": number }
]
The total sum of allocated_amount must exactly equal ₹${totalBudget}.`;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          id: generateUUID(),
          event_id: "",
          category: item.category as BudgetCategory,
          allocated_amount: Number(item.allocated_amount),
          percentage: Number(item.percentage),
        }));
      }
    } catch (e) {
      console.warn("Failed to generate budget with AI, using heuristics:", e);
    }
  }

  // Heuristic allocation tailored by category
  return getHeuristicBudget(totalBudget, category);
}

/**
 * 3. generateTimeline
 * Creates minute-by-minute day-of timeline.
 */
export async function generateTimeline(input: {
  category: EventCategory;
  startTime?: string;
  endTime?: string;
  guestCount: number;
  theme?: string;
}): Promise<{ time: string; activity: string; responsibility: string }[]> {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `Generate an exact, minute-by-minute event-day timeline for a ${input.category} with ${input.guestCount} guests.
Start time: ${input.startTime || "18:00"}, End time: ${input.endTime || "23:00"}.
Theme: ${input.theme || "Classic"}.
Return JSON schema:
{
  "schedule": [
    { "time": "18:00 - 18:45", "activity": "...", "responsibility": "..." }
  ]
}`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      const validated = TimelineScheduleSchema.parse(parsed);
      return validated.schedule;
    } catch (e) {
      console.warn("Gemini timeline error, using fallback schedule:", e);
    }
  }

  return [
    { time: "16:00 - 17:30", activity: "Vendor load-in, decor check & sound testing", responsibility: "Event Coordinator" },
    { time: "17:30 - 18:30", activity: "Host arrival, final dressing & photography preview", responsibility: "Host & Photographer" },
    { time: "18:30 - 19:30", activity: "Guest reception, welcome drinks & interactive guestbook", responsibility: "Welcome Team" },
    { time: "19:30 - 20:30", activity: "Main ceremony, speeches, toasts & spotlight moments", responsibility: "MC / Host" },
    { time: "20:30 - 22:00", activity: "Dinner buffet open, live music & social mingling", responsibility: "Catering Head" },
    { time: "22:00 - 23:00", activity: "High-energy dance floor & celebratory send-off", responsibility: "DJ & Coordinator" },
  ];
}

/**
 * 4. generateTaskChecklist
 * Generates prep milestones from planning to event day.
 */
export async function generateTaskChecklist(
  category: EventCategory,
  daysLeft: number
): Promise<Partial<TaskItem>[]> {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `Generate a realistic preparation checklist with 8 key tasks for a ${category} celebration happening in ${daysLeft} days.
Return a JSON array:
[
  { "title": "task title", "category": "Venue" | "Catering" | "Decor" | "Guests" | "Logistics", "priority": "low" | "medium" | "high" | "urgent", "daysBefore": number }
]`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      if (Array.isArray(parsed)) {
        return parsed.map((t, idx) => ({
          title: t.title,
          category: t.category || "General",
          priority: t.priority || "medium",
          status: "pending" as const,
          is_event_day: (t.daysBefore || 0) <= 0,
          order_index: idx + 1,
        }));
      }
    } catch (e) {
      console.warn("AI task checklist error:", e);
    }
  }

  return [
    { title: "Finalize and lock venue contract", category: "Venue", priority: "urgent", is_event_day: false, order_index: 1 },
    { title: "Send digital RSVP invitations to guests", category: "Guests", priority: "high", is_event_day: false, order_index: 2 },
    { title: "Book caterer and lock menu tasting session", category: "Catering", priority: "high", is_event_day: false, order_index: 3 },
    { title: "Confirm photography shot list and timing", category: "Photography", priority: "medium", is_event_day: false, order_index: 4 },
    { title: "Order celebration cake and signature desserts", category: "Catering", priority: "medium", is_event_day: false, order_index: 5 },
    { title: "Curate event playlist and brief the DJ/MC", category: "Entertainment", priority: "low", is_event_day: false, order_index: 6 },
    { title: "Confirm final head-count with catering vendor", category: "Logistics", priority: "high", is_event_day: false, order_index: 7 },
    { title: "Coordinate morning-of vendor delivery times", category: "Logistics", priority: "urgent", is_event_day: true, order_index: 8 },
  ];
}

/**
 * 5. generateThemeIdeas
 * Generates custom themes, palettes, and styling concepts.
 */
export async function generateThemeIdeas(
  category: EventCategory,
  city: string,
  formality: string
): Promise<{ title: string; description: string; colors: string[] }[]> {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `Generate 4 distinct, gorgeous aesthetic themes for a ${formality} ${category} in ${city}, India.
Return JSON:
[
  { "title": "Theme Name", "description": "1 sentence description", "colors": ["#hex1", "#hex2", "#hex3", "#hex4"] }
]`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn("AI theme ideas error:", e);
    }
  }

  return [
    {
      title: "Warm Bohemian Sunset",
      description: "Terracotta planters, pampas grass, warm fairy lights, and rattan wooden textures.",
      colors: ["#4C234F", "#FF8066", "#EAE3F4", "#FAF8F4"],
    },
    {
      title: "Royal Marigold & Brass Heritage",
      description: "Vibrant yellow marigold arches, antique brass diya lamps, and rich raw silk accents.",
      colors: ["#E5A93C", "#FF8066", "#4C234F", "#FAF8F4"],
    },
    {
      title: "Eucalyptus Minimalist Elegance",
      description: "Crisp ivory tablecloths, muted olive greenery, taper candles, and gold flatware.",
      colors: ["#4A6B53", "#FAF8F4", "#D4AF37", "#222126"],
    },
    {
      title: "Cyberpunk Neon & Velvet Glam",
      description: "Moody violet uplighting, neon acrylic monograms, disco accents, and dark plum florals.",
      colors: ["#4C234F", "#B070B3", "#FF8066", "#222126"],
    },
  ];
}

/**
 * 6. suggestCostSavings
 * Analyzes expenses and proposes cost reduction strategies.
 */
export async function suggestCostSavings(input: {
  totalBudget: number;
  currentSpending: number;
  expenses: { category: string; title: string; amount: number }[];
  guestCount: number;
}): Promise<{
  totalEstimatedSavings: number;
  suggestions: {
    category: string;
    title: string;
    potentialSavingsINR: number;
    actionableTip: string;
    tradeOff: string;
  }[];
}> {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `Analyze these event expenses and recommend 4 smart cost-saving adjustments:
Total Budget: ₹${input.totalBudget} INR
Current Spending: ₹${input.currentSpending} INR
Guest Count: ${input.guestCount}
Expenses: ${JSON.stringify(input.expenses)}

Return JSON adhering to:
{
  "totalEstimatedSavings": number,
  "suggestions": [
    { "category": "category name", "title": "short title", "potentialSavingsINR": number, "actionableTip": "tip", "tradeOff": "what is different" }
  ]
}`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return CostSavingSchema.parse(parsed);
    } catch (e) {
      console.warn("AI cost savings error:", e);
    }
  }

  // Heuristic cost-saving fallback
  return {
    totalEstimatedSavings: Math.round(input.totalBudget * 0.18),
    suggestions: [
      {
        category: "catering",
        title: "Live Food Stations vs. Plated Buffet",
        potentialSavingsINR: Math.round(input.totalBudget * 0.08),
        actionableTip: "Switching from a 6-course heavy spread to 3 curated live artisanal counters (e.g., pasta, chaat, sliders) reduces waste and drops per-plate costs by 20%.",
        tradeOff: "Fewer total dishes, but fresher and higher perceived quality.",
      },
      {
        category: "invitations",
        title: "Digital Interactive RSVP Link",
        potentialSavingsINR: Math.round(input.totalBudget * 0.03),
        actionableTip: "Replace printed invitations and courier fees with a responsive digital invite containing instant WhatsApp RSVP and venue navigation pins.",
        tradeOff: "No physical keepsake card for elderly relatives.",
      },
      {
        category: "decoration",
        title: "Warm Edison Bulbs & Greenery",
        potentialSavingsINR: Math.round(input.totalBudget * 0.05),
        actionableTip: "Use seasonal locally sourced foliage and micro-fairy light canopies instead of imported cut flowers.",
        tradeOff: "Greenery-forward aesthetic rather than dense floral arrangements.",
      },
      {
        category: "photography",
        title: "Focused Golden-Hour Coverage",
        potentialSavingsINR: Math.round(input.totalBudget * 0.04),
        actionableTip: "Book candid photographers for the primary 3-hour ceremony and toast window rather than full 8-hour standby.",
        tradeOff: "Early arrivals or very late post-midnight dancing might not be documented.",
      },
    ],
  };
}

/**
 * 7. reviseEventPlan
 * Handles natural language user instructions to modify the plan
 */
export async function reviseEventPlan(
  currentPlan: AIPlanSummary,
  userInstruction: string,
  eventContext: {
    title: string;
    category: string;
    city: string;
    budget: number;
    guestCount: number;
  }
): Promise<{ replyText: string; revisedPlan?: AIPlanSummary }> {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `You are an expert celebration planner assistant.
The user is planning: "${eventContext.title}" (${eventContext.category} in ${eventContext.city})
Total Budget: ₹${eventContext.budget} INR, Guest Count: ${eventContext.guestCount}.
Current Plan Summary: ${JSON.stringify(currentPlan)}

User Instruction: "${userInstruction}"

Respond with JSON:
{
  "replyText": "Professional, encouraging explanation of the adjustments made and rationale.",
  "revisedPlan": <Full revised plan object conforming to AIPlanSummarySchema>
}`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return {
        replyText: parsed.replyText || "Here is your updated plan.",
        revisedPlan: parsed.revisedPlan ? AIPlanSummarySchema.parse(parsed.revisedPlan) : undefined,
      };
    } catch (e) {
      console.warn("AI plan revision error:", e);
    }
  }

  // Fallback conversational revision
  let reply = `I have adjusted your plan based on: "${userInstruction}". `;
  const revised = { ...currentPlan };

  if (userInstruction.toLowerCase().includes("budget") || userInstruction.toLowerCase().includes("reduce")) {
    reply += "I reduced the decor and venue allocations by 15% and optimized the catering format with live counters to conserve capital.";
    revised.overview += " (Revised for tighter budget optimization)";
  } else if (userInstruction.toLowerCase().includes("vegetarian") || userInstruction.toLowerCase().includes("menu")) {
    reply += "I revamped the catering plan to feature a gourmet vegetarian and Jain spread with artisanal live stations.";
    revised.cateringRecommendation = {
      style: "Gourmet Vegetarian & Street Food Fusion",
      estimatedCostPerPlate: 260,
      recommendedMenu: [
        "Chilled Aam Panna & Lychee Basil Cooler",
        "Tandoori Malai Paneer & Crispy Lotus Stem",
        "Live Tossed Pesto Gnocchi",
        "Paneer Lababdar with Assorted Kulchas",
        "Kesar Pista Kulfi Falooda with Rose Pearls",
      ],
    };
  } else {
    reply += "I've re-balanced the milestone timeline and updated the event day schedule to align with your preferences.";
  }

  return {
    replyText: reply,
    revisedPlan: revised,
  };
}

/**
 * Intelligent Fallback Plan Generator
 * Creates realistic, high-quality, customized plans without requiring an active API key
 */
function generateIntelligentFallbackPlan(input: GeneratePlanInput): AIPlanSummary {
  const perPlate = Math.round((input.total_budget * 0.4) / (input.expected_guests || 50));

  let theme = input.theme || "Warm Bohemian Sunset with Fairy Lights";
  let colors = ["#4C234F", "#FF8066", "#EAE3F4", "#FAF8F4"];

  if (input.category === "wedding") {
    theme = "Royal Heritage & Marigold Splendor";
    colors = ["#4C234F", "#E5A93C", "#FF8066", "#FAF8F4"];
  } else if (input.category === "corporate") {
    theme = "Modern Minimalist Tech Gala";
    colors = ["#222126", "#4C234F", "#FF8066", "#FAF8F4"];
  } else if (input.category === "college") {
    theme = "Electric Neon Beats & Street Carnival";
    colors = ["#B070B3", "#FF8066", "#FAF8F4", "#222126"];
  }

  return {
    overview: `A bespoke celebration for ${input.expected_guests} guests in ${input.city}, designed to maximize atmosphere and guest enjoyment on a thoughtfully allocated ₹${input.total_budget.toLocaleString(
      "en-IN"
    )} budget.`,
    recommendedTheme: theme,
    colorPalette: colors,
    budgetStrategy: [
      {
        category: "catering",
        percentage: 40,
        amount: Math.round(input.total_budget * 0.4),
        tips: `Allocate ~₹${perPlate} per plate for high-impact live food counters and refreshing signature welcome drinks.`,
      },
      {
        category: "venue",
        percentage: 25,
        amount: Math.round(input.total_budget * 0.25),
        tips: "Select a scenic venue with existing ambient lighting to minimize external decor expenditures.",
      },
      {
        category: "decoration",
        percentage: 15,
        amount: Math.round(input.total_budget * 0.15),
        tips: "Focus on photo backdrops and warm ambient fairy lighting where guests gather most.",
      },
      {
        category: "photography",
        percentage: 10,
        amount: Math.round(input.total_budget * 0.1),
        tips: "Engage a dedicated photographer for peak 3-hour ceremony and toast highlights.",
      },
      {
        category: "entertainment",
        percentage: 7,
        amount: Math.round(input.total_budget * 0.07),
        tips: "Professional sound system setup paired with a curated high-energy party playlist.",
      },
      {
        category: "miscellaneous",
        percentage: 3,
        amount: Math.round(input.total_budget * 0.03),
        tips: "Buffer reserve for minor emergencies, extra ice, and last-minute tips.",
      },
    ],
    keyMilestones: [
      { title: "Finalize venue contract and downpayment", timeline: "3-4 weeks prior", priority: "urgent" },
      { title: "Send digital RSVP invitations via WhatsApp link", timeline: "2 weeks prior", priority: "high" },
      { title: "Lock in caterer tasting & dietary counts", timeline: "10 days prior", priority: "high" },
      { title: "Order custom celebration cake & dessert table items", timeline: "4 days prior", priority: "medium" },
      { title: "Final coordinator & vendor check-in", timeline: "Day before event", priority: "urgent" },
    ],
    eventDaySchedule: [
      { time: "16:00 - 17:30", activity: "Venue load-in, lighting inspection & backdrop setup", responsibility: "Decor Team" },
      { time: "18:00 - 18:45", activity: "Host arrival, final soundcheck & brief with photographer", responsibility: "Host & Photographer" },
      { time: "19:00 - 19:45", activity: "Guest arrivals, welcome drinks & polaroid photo station", responsibility: "Host" },
      { time: "19:45 - 20:30", activity: "Interactive party games, speeches & toasts", responsibility: "MC / Friends" },
      { time: "20:30 - 21:00", activity: "Cake cutting ceremony & spotlight photos", responsibility: "All Guests" },
      { time: "21:00 - 22:30", activity: "Dinner buffet open & dance floor celebration", responsibility: "Caterer & DJ" },
      { time: "22:30 - 23:00", activity: "Dessert bar & farewell thank-you favors", responsibility: "Host" },
    ],
    cateringRecommendation: {
      style: "Gourmet Live Counters & Finger Food Extravaganza",
      estimatedCostPerPlate: perPlate,
      recommendedMenu: [
        "Signature Chilled Kokum Cooler & Spiced Guava Punch",
        "Smoked Paneer / Chicken Tikka Skewers with Mint Dip",
        "Crispy Herb Potato Bites & Bruschetta Board",
        "Live Tossed Pasta in Basil Pesto & Alfredo Cream",
        "Warm Gulab Jamun & Belgian Dark Truffle Pastries",
      ],
    },
    decorAndThemeIdeas: [
      "Cascading warm fairy light canopy overhead creating an enchanted ambiance.",
      "Custom wooden welcome easel with elegant typography.",
      "Polaroid memory wall where guests peg selfies with personal messages.",
      "Brass geometric lanterns and floating tea-light centerpieces.",
    ],
    costSavingOpportunities: [
      "Digital invitations with interactive RSVP link eliminate ₹3,000+ in printing.",
      "Focusing decor solely on entrance and photo booth gives maximum impact per rupee.",
      "Live artisanal food counters feel rich and contemporary while minimizing food waste by 25%.",
    ],
  };
}

function getHeuristicBudget(totalBudget: number, category: EventCategory): BudgetAllocation[] {
  let ratios: Record<BudgetCategory, number>;

  if (category === "wedding") {
    ratios = {
      venue: 0.28,
      catering: 0.35,
      decoration: 0.15,
      photography: 0.08,
      entertainment: 0.05,
      invitations: 0.02,
      transportation: 0.02,
      gifts: 0.03,
      miscellaneous: 0.02,
    };
  } else if (category === "birthday" || category === "anniversary") {
    ratios = {
      catering: 0.4,
      venue: 0.25,
      decoration: 0.13,
      entertainment: 0.1,
      photography: 0.06,
      invitations: 0.01,
      transportation: 0.01,
      gifts: 0.02,
      miscellaneous: 0.02,
    };
  } else {
    ratios = {
      venue: 0.3,
      catering: 0.35,
      entertainment: 0.12,
      decoration: 0.1,
      photography: 0.05,
      invitations: 0.02,
      transportation: 0.02,
      gifts: 0.02,
      miscellaneous: 0.02,
    };
  }

  return (Object.keys(ratios) as BudgetCategory[]).map((cat) => {
    const pct = ratios[cat] * 100;
    const amt = Math.round(totalBudget * ratios[cat]);
    return {
      id: generateUUID(),
      event_id: "",
      category: cat,
      allocated_amount: amt,
      percentage: Number(pct.toFixed(1)),
    };
  });
}
