import { NextRequest, NextResponse } from "next/server";
import { generateEventPlan } from "@/lib/ai/gemini";
import { z } from "zod";

const RequestSchema = z.object({
  title: z.string().min(2),
  category: z.enum([
    "wedding",
    "birthday",
    "anniversary",
    "corporate",
    "college",
    "community",
    "other",
  ]),
  city: z.string().min(2),
  expected_guests: z.number().positive(),
  total_budget: z.number().nonnegative(),
  event_date: z.string(),
  formality: z.string().optional(),
  food_preference: z.string().optional(),
  theme: z.string().optional(),
  must_have_features: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RequestSchema.parse(body);

    const result = await generateEventPlan(validated);
    return NextResponse.json({
      success: true,
      plan: result.plan,
      isDemoFallback: result.isDemoFallback,
    });
  } catch (error: any) {
    console.error("AI Plan Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate event plan",
      },
      { status: 400 }
    );
  }
}
