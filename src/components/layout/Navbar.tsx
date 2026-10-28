"use client";

import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, User } from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, loginAsGuest } = useEventContext();
  const router = useRouter();

  const handleDemoClick = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE5DC] bg-[#FAF8F4]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-plum-800 text-white shadow-soft transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-coral-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-plum-900">
              CelebrationAI
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-coral-600">
              Intelligent Event Planner
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5D2962]">
          <a href="#features" className="hover:text-plum-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-plum-900 transition-colors">
            How It Works
          </a>
          <a href="#event-types" className="hover:text-plum-900 transition-colors">
            Celebrations
          </a>
          <a href="#testimonials" className="hover:text-plum-900 transition-colors">
            Stories
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDemoClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-plum-800 bg-lavender-200/80 hover:bg-lavender-200 transition-all border border-lavender-300"
          >
            Explore Demo
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-plum-800 hover:bg-plum-900 shadow-soft hover:shadow-hover transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-semibold text-plum-800 hover:text-plum-950 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/wizard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-plum-800 hover:bg-plum-900 shadow-soft hover:shadow-hover transition-all"
              >
                <span>Plan My Event</span>
                <Sparkles className="h-4 w-4 text-coral-500" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
