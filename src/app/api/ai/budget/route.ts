import { NextRequest, NextResponse } from "next/server";
import { generateBudget } from "@/lib/ai/gemini";
import { z } from "zod";

const Schema = z.object({
  total_budget: z.number().positive(),
  category: z.enum([
    "wedding",
    "birthday",
    "anniversary",
    "corporate",
    "college",
    "community",
    "other",
  ]),
  priority_categories: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { total_budget, category, priority_categories } = Schema.parse(body);

    const allocations = await generateBudget(
      total_budget,
      category,
      (priority_categories as any) || ["catering", "venue"]
    );

    return NextResponse.json({
      success: true,
      allocations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate budget" },
      { status: 400 }
    );
  }
}
