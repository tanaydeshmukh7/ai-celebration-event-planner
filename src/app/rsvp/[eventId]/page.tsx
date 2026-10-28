"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Utensils,
  Heart,
  Send,
} from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { formatDate } from "@/lib/utils";

export default function PublicRSVPPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const { activeEvent, eventsList, addGuest } = useEventContext();

  // Find target event or fallback to activeEvent
  const event =
    eventsList.find((e) => e.id === eventId) || activeEvent;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"accepted" | "declined">("accepted");
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietary, setDietary] = useState<any>("Vegetarian");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      // 1. Post to API route
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          name,
          email,
          phone,
          rsvpStatus,
          plusOnes: Number(plusOnes),
          dietaryPreference: dietary,
          notes,
        }),
      });

      // 2. Add to event context state
      addGuest({
        name,
        email: email || undefined,
        phone: phone || undefined,
        category: "Close Friends",
        rsvp_status: rsvpStatus,
        plus_ones: Number(plusOnes),
        dietary_preference: dietary,
        notes: notes || undefined,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("RSVP error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between py-10 px-4 sm:px-6 selection:bg-lavender-300">
      {/* Brand Header */}
      <div className="text-center max-w-md mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-lavender-200 text-plum-900 border border-lavender-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-coral-500" />
          <span>You're Cordially Invited</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-plum-950">
          {event.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs text-[#756B5B] mt-2">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="h-3.5 w-3.5 text-coral-600" />
            <span>{formatDate(event.event_date)}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-coral-600" />
            <span>{event.venue_name || event.city}</span>
          </span>
        </div>
      </div>

      {/* Main Card */}
      <main className="max-w-lg w-full mx-auto bg-white rounded-3xl border border-[#EAE5DC] p-6 sm:p-8 shadow-hover">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-plum-950">
              {rsvpStatus === "accepted" ? "RSVP Confirmed!" : "Thank You for Letting Us Know"}
            </h2>
            <p className="text-xs text-[#756B5B] leading-relaxed max-w-sm mx-auto">
              {rsvpStatus === "accepted"
                ? `We can't wait to celebrate with you! Your response for ${name} (+${plusOnes} guest) has been safely sent to the host.`
                : `We will miss you at the celebration, ${name}! Your warm wishes have been conveyed.`}
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
              >
                <span>Plan Your Own Event with AI</span>
                <Sparkles className="h-4 w-4 text-coral-400" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1.5">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("accepted")}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    rsvpStatus === "accepted"
                      ? "bg-plum-800 text-white border-plum-800 shadow-sm"
                      : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 text-coral-400" />
                  <span>Joyfully Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    rsvpStatus === "declined"
                      ? "bg-plum-800 text-white border-plum-800 shadow-sm"
                      : "bg-[#FAF8F4] text-[#222126] border-[#DED7CA] hover:bg-white"
                  }`}
                >
                  <XCircle className="h-4 w-4 text-coral-400" />
                  <span>Regretfully Decline</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-plum-900 mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98220 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-plum-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>
            </div>

            {rsvpStatus === "accepted" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1">
                      Plus-Ones Joining You
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={plusOnes}
                      onChange={(e) => setPlusOnes(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-plum-900 mb-1">
                      Dietary Choice
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Pure Veg / Jain">Jain / Swaminarayan</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1">
                Note or Congratulatory Message for the Host
              </label>
              <textarea
                rows={2}
                placeholder="Can't wait to dance! / Wishing you both a lifetime of happiness..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-plum-800 text-white font-bold text-xs hover:bg-plum-900 shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Submitting..." : "Send RSVP"}</span>
              <Send className="h-4 w-4 text-coral-400" />
            </button>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#998E7D] mt-8">
        Powered by CelebrationAI • Intelligent Event Management
      </footer>
    </div>
  );
}
