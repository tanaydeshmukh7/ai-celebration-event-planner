import { NextRequest, NextResponse } from "next/server";
import { reviseEventPlan } from "@/lib/ai/gemini";
import { z } from "zod";

const Schema = z.object({
  userInstruction: z.string().min(2),
  currentPlan: z.any(),
  eventContext: z.object({
    title: z.string(),
    category: z.string(),
    city: z.string(),
    budget: z.number(),
    guestCount: z.number(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInstruction, currentPlan, eventContext } = Schema.parse(body);

    const result = await reviseEventPlan(currentPlan, userInstruction, eventContext);
    return NextResponse.json({
      success: true,
      replyText: result.replyText,
      revisedPlan: result.revisedPlan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process revision" },
      { status: 400 }
    );
  }
}
