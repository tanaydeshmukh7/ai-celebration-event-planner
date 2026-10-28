"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  BotMessageSquare,
  Wallet,
  CalendarCheck2,
  Store,
  Users2,
  Palette,
  FileSpreadsheet,
  PlusCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { useState } from "react";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Workspace", href: "/dashboard/ai-workspace", icon: BotMessageSquare, badge: "AI" },
  { name: "Budget Manager", href: "/dashboard/budget", icon: Wallet },
  { name: "Timeline & Tasks", href: "/dashboard/timeline", icon: CalendarCheck2 },
  { name: "Vendor Directory", href: "/dashboard/vendors", icon: Store },
  { name: "Guests & RSVP", href: "/dashboard/guests", icon: Users2 },
  { name: "Inspiration Studio", href: "/dashboard/inspiration", icon: Palette },
  { name: "Reports & Export", href: "/dashboard/reports", icon: FileSpreadsheet },
];

export function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { activeEvent, eventsList, setActiveEventId, isDemoMode } = useEventContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-[#EAE5DC] bg-[#FAF8F4] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-[#EAE5DC] px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum-800 text-white shadow-soft">
              <Sparkles className="h-5 w-5 text-coral-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-plum-900 leading-tight">
                CelebrationAI
              </span>
              <span className="text-[10px] uppercase font-semibold text-coral-600 tracking-wider">
                Event Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Active Event Switcher */}
        <div className="p-4 border-b border-[#EAE5DC]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#998E7D] mb-1.5 block">
            Active Event
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[#DED7CA] bg-white text-left hover:border-plum-800 transition-all shadow-sm"
            >
              <div className="truncate">
                <div className="font-serif text-sm font-bold text-plum-900 truncate">
                  {activeEvent.title}
                </div>
                <div className="text-xs text-[#756B5B] capitalize">
                  {activeEvent.category} • {activeEvent.city}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[#756B5B] shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-[#DED7CA] bg-white p-1.5 shadow-hover z-30">
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {eventsList.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        setActiveEventId(evt.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        evt.id === activeEvent.id
                          ? "bg-plum-800 text-white font-semibold"
                          : "text-[#222126] hover:bg-warmgray-100"
                      }`}
                    >
                      <div className="truncate">{evt.title}</div>
                      <div
                        className={`text-[10px] ${
                          evt.id === activeEvent.id ? "text-lavender-200" : "text-[#998E7D]"
                        }`}
                      >
                        {evt.category} • ₹{evt.total_budget.toLocaleString("en-IN")}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#ECE7DE] mt-1 pt-1">
                  <Link
                    href="/wizard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-plum-800 hover:bg-lavender-100 rounded-lg transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-coral-600" />
                    <span>Create New Event</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-plum-800 text-white shadow-soft font-semibold"
                    : "text-[#5D2962] hover:bg-lavender-200/50 hover:text-plum-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? "text-coral-400" : "text-[#756B5B] group-hover:text-plum-800"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-coral-500 text-white"
                        : "bg-coral-100 text-coral-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Shareable Public RSVP Button */}
          <div className="pt-4 mt-4 border-t border-[#EAE5DC]">
            <Link
              href={`/rsvp/${activeEvent.id}`}
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-plum-900 bg-lavender-200/70 hover:bg-lavender-200 border border-lavender-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <span>Public RSVP Page</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-coral-600" />
            </Link>
          </div>
        </div>

        {/* Footer / Demo badge */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF8F4]">
          {isDemoMode && (
            <div className="rounded-xl border border-coral-200 bg-coral-50/70 p-3 text-xs text-coral-900">
              <div className="font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-coral-500 animate-pulse" />
                Demo Mode Active
              </div>
              <p className="text-[11px] text-coral-800/80 mt-1 leading-snug">
                Data persists in your browser. Real Supabase & Gemini API keys can be connected via .env.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
