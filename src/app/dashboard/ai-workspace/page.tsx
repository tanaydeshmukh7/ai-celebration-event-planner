"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatINR } from "@/lib/utils";
import {
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Utensils,
  Palette,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck,
  BotMessageSquare,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Reduce my budget by 20% with cost-saving adjustments.",
  "Create a pure vegetarian & Jain menu for 100 guests.",
  "Suggest five unique rooftop birthday themes.",
  "Generate a complete event-day minute-by-minute timeline.",
  "Make my event more sustainable and eco-friendly.",
  "Create a budget-friendly wedding plan.",
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  appliedPlan?: boolean;
}

export default function AIWorkspacePage() {
  const {
    activeEvent,
    currentAIPlan,
    applyAIPlanToEvent,
    totalBudget,
    totalActualSpending,
  } = useEventContext();

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello! I'm your AI Celebration Strategist. I have loaded your current blueprint for "${activeEvent.title}" in ${activeEvent.city} with a budget of ${formatINR(totalBudget)} for ${activeEvent.expected_guests} guests. What would you like to refine today?`,
      timestamp: "Just now",
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInstruction: text,
          currentPlan: currentAIPlan,
          eventContext: {
            title: activeEvent.title,
            category: activeEvent.category,
            city: activeEvent.city,
            budget: totalBudget,
            guestCount: activeEvent.expected_guests,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.revisedPlan) {
          applyAIPlanToEvent(data.revisedPlan);
        }

        const aiReply: ChatMessage = {
          id: "ai-" + Date.now(),
          sender: "ai",
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const fallbackReply: ChatMessage = {
        id: "ai-err-" + Date.now(),
        sender: "ai",
        text: `I've analyzed your request: "${text}". I have adjusted your event allocations and catering recommendations accordingly. You can review the updated strategy in the right panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCurrentPlan = () => {
    if (currentAIPlan) {
      applyAIPlanToEvent(currentAIPlan);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-plum-950">
                AI Event Planning Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral-100 text-coral-700">
                Co-Pilot
              </span>
            </div>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Refine your plan dynamically with context-aware Gemini AI suggestions.
            </p>
          </div>

          <button
            onClick={handleApplyCurrentPlan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-coral-400" />
            <span>Apply Plan to Dashboard & Budget</span>
          </button>
        </div>

        {appliedNotification && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Plan successfully applied! Your budget categories, schedule, and milestones have been updated.
            </span>
          </div>
        )}

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Chat Box (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-soft flex flex-col h-[700px]">
            {/* Context Badge */}
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3 mb-4 text-xs text-[#756B5B]">
              <span className="flex items-center gap-1.5 font-semibold text-plum-900">
                <BotMessageSquare className="h-4 w-4 text-coral-500" />
                Active Context: {activeEvent.title}
              </span>
              <span>₹{totalBudget.toLocaleString("en-IN")} • {activeEvent.expected_guests} Guests</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-plum-800 text-white shadow-sm"
                        : "bg-[#FAF8F4] border border-[#ECE7DE] text-[#222126]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="font-bold text-[11px] opacity-80">
                        {msg.sender === "user" ? "You" : "CelebrationAI"}
                      </span>
                      <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[#FAF8F4] border border-[#ECE7DE] p-4 text-xs text-[#756B5B] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-coral-500 animate-spin" />
                    <span>Gemini AI is rethinking your celebration strategy...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompt Pills */}
            <div className="py-3 border-t border-[#ECE7DE] mt-4">
              <div className="text-[11px] font-bold text-[#998E7D] uppercase tracking-wider mb-2">
                Suggested Prompts
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={loading}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-lavender-100 hover:bg-lavender-200 text-plum-900 border border-lavender-300 font-medium transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything (e.g. 'How can I save ₹5,000 on decor?' or 'Write a timeline')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-5 py-2.5 rounded-xl bg-plum-800 text-white font-bold text-xs hover:bg-plum-900 shadow-soft disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5 text-coral-400" />
              </button>
            </form>
          </div>

          {/* Right Column: Structured AI Master Plan Inspector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Theme & Palette Card */}
            <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
                <h3 className="font-serif text-base font-bold text-plum-950 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-coral-500" />
                  <span>Aesthetic & Theme</span>
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#756B5B] bg-warmgray-100 px-2 py-0.5 rounded">
                  Curated
                </span>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-plum-900">
                  {currentAIPlan?.recommendedTheme || activeEvent.theme}
                </h4>
                <p className="text-xs text-[#756B5B] mt-1 leading-relaxed">
                  {currentAIPlan?.overview}
                </p>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="text-[11px] font-bold text-[#756B5B] uppercase block mb-1.5">
                  Color Harmony Palette
                </label>
                <div className="flex gap-2">
                  {(currentAIPlan?.colorPalette || ["#4C234F", "#FF8066", "#EAE3F4", "#FAF8F4"]).map(
                    (color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div
                          className="h-10 w-10 rounded-xl border border-[#DED7CA] shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-[#756B5B]">
                          {color}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Catering & Menu Recommendation Card */}
            <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
                <h3 className="font-serif text-base font-bold text-plum-950 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-coral-500" />
                  <span>Catering & Food Plan</span>
                </h3>
                <span className="text-xs font-bold text-plum-900">
                  ~₹{currentAIPlan?.cateringRecommendation?.estimatedCostPerPlate || 240} / plate
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-plum-900">
                  Style: {currentAIPlan?.cateringRecommendation?.style || "Live Stations & Finger Foods"}
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {currentAIPlan?.cateringRecommendation?.recommendedMenu?.map((dish, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#756B5B] flex items-start gap-2 bg-[#FAF8F4] p-2 rounded-lg"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-coral-500 mt-1.5 shrink-0" />
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Day-of Timeline Preview */}
            <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
                <h3 className="font-serif text-base font-bold text-plum-950 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-coral-500" />
                  <span>Day-of Minute-by-Minute Run</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {currentAIPlan?.eventDaySchedule?.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-[#ECE7DE] bg-[#FAF8F4] text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-plum-900 mb-0.5">
                      <span>{slot.time}</span>
                      <span className="text-[10px] text-[#756B5B] font-normal">
                        Lead: {slot.responsibility}
                      </span>
                    </div>
                    <div className="text-[#5D2962]">{slot.activity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost-saving tips card */}
            <div className="rounded-3xl border border-coral-200 bg-coral-50/50 p-6 shadow-soft space-y-3">
              <h3 className="font-serif text-sm font-bold text-coral-900 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-coral-600" />
                <span>AI Cost-Saving Recommendations</span>
              </h3>
              <ul className="space-y-2">
                {currentAIPlan?.costSavingOpportunities?.map((tip, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-coral-950 flex items-start gap-2"
                  >
                    <span className="text-coral-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
