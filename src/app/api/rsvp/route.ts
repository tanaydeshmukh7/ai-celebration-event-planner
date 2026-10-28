import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RSVPSchema = z.object({
  eventId: z.string(),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  rsvpStatus: z.enum(["accepted", "declined"]),
  plusOnes: z.number().min(0).max(10).default(0),
  dietaryPreference: z.enum([
    "Vegetarian",
    "Non-Vegetarian",
    "Pure Veg / Jain",
    "Vegan",
    "Gluten-Free",
    "Halal",
  ]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = RSVPSchema.parse(body);

    // In a live Supabase setup with service role or public insert policy, this writes to the `guests` table.
    // For demo/offline mode, we return success with a created guest object so the client can save or update state.
    const createdGuest = {
      id: "gst-" + Date.now(),
      event_id: data.eventId,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      category: "Close Friends",
      rsvp_status: data.rsvpStatus,
      plus_ones: data.plusOnes,
      dietary_preference: data.dietaryPreference,
      notes: data.notes,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "RSVP recorded successfully",
      guest: createdGuest,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit RSVP" },
      { status: 400 }
    );
  }
}
