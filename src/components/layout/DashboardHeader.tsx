"use client";

import { useState } from "react";
import {
  Menu,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  User,
  LogOut,
  MapPin,
} from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { formatDate, daysUntil } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardHeader({
  onOpenSidebar,
  onOpenQuickAction,
}: {
  onOpenSidebar: () => void;
  onOpenQuickAction?: (action: "expense" | "task" | "guest") => void;
}) {
  const { activeEvent, user, logout } = useEventContext();
  const router = useRouter();
  const [userDropdown, setUserDropdown] = useState(false);

  const countdown = daysUntil(activeEvent.event_date);

  const handleSignOut = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#EAE5DC] bg-[#FAF8F4]/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Menu & Event Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-plum-900 hover:bg-warmgray-200 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-plum-950 truncate max-w-[200px] sm:max-w-md">
              {activeEvent.title}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lavender-200 text-plum-900 border border-lavender-300 capitalize">
              {activeEvent.category}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#756B5B] mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-coral-500" />
              <span>{formatDate(activeEvent.event_date)}</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-coral-500" />
              <span>{activeEvent.city}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-plum-800">
              <Clock className="h-3.5 w-3.5 text-coral-600" />
              <span>
                {countdown.isPast
                  ? "Celebration concluded"
                  : `${countdown.days} days to go`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Action Buttons */}
        <Link
          href="/wizard"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-coral-600" />
          <span>New Event</span>
        </Link>

        <Link
          href="/dashboard/ai-workspace"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-coral-400" />
          <span className="hidden sm:inline">Ask AI Planner</span>
          <span className="sm:hidden">AI</span>
        </Link>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-plum-800 transition-all"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="h-9 w-9 rounded-full object-cover border border-[#DED7CA]"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-plum-800 text-white font-bold text-xs">
                {user?.full_name?.charAt(0) || "U"}
              </div>
            )}
          </button>

          {userDropdown && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#DED7CA] bg-white p-2 shadow-hover z-40">
              <div className="px-3 py-2 border-b border-[#ECE7DE]">
                <p className="text-xs font-bold text-plum-900">{user?.full_name || "Guest User"}</p>
                <p className="text-[11px] text-[#756B5B] truncate">{user?.city || "Pune, India"}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/reports"
                  onClick={() => setUserDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#222126] hover:bg-warmgray-100 rounded-lg"
                >
                  <span>Event Summary & Export</span>
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setUserDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#222126] hover:bg-warmgray-100 rounded-lg"
                >
                  <span>Switch Account / Sign In</span>
                </Link>
              </div>

              <div className="border-t border-[#ECE7DE] pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral-600 hover:bg-coral-50 rounded-lg font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
