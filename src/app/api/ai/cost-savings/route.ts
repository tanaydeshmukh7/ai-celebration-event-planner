import { NextRequest, NextResponse } from "next/server";
import { suggestCostSavings } from "@/lib/ai/gemini";
import { z } from "zod";

const Schema = z.object({
  totalBudget: z.number(),
  currentSpending: z.number(),
  guestCount: z.number(),
  expenses: z.array(
    z.object({
      category: z.string(),
      title: z.string(),
      amount: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    const savings = await suggestCostSavings(data);
    return NextResponse.json({
      success: true,
      savings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate cost savings" },
      { status: 400 }
    );
  }
}
