import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#EAE5DC] bg-[#F7F4EE] py-16 text-[#222126]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum-800 text-white shadow-soft">
                <Sparkles className="h-5 w-5 text-coral-500" />
              </div>
              <span className="font-serif text-xl font-bold text-plum-900">
                CelebrationAI
              </span>
            </div>
            <p className="text-sm text-[#756B5B] leading-relaxed">
              Every celebration, beautifully planned. AI-driven budget allocations, vendor shortlists, minute-by-minute itineraries, and dynamic guest RSVPs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-plum-900 text-base mb-4">
              Celebrations
            </h4>
            <ul className="space-y-2 text-sm text-[#756B5B]">
              <li><Link href="/wizard?category=wedding" className="hover:text-plum-900 transition-colors">Indian Weddings</Link></li>
              <li><Link href="/wizard?category=birthday" className="hover:text-plum-900 transition-colors">Milestone Birthdays</Link></li>
              <li><Link href="/wizard?category=anniversary" className="hover:text-plum-900 transition-colors">Silver & Golden Anniversaries</Link></li>
              <li><Link href="/wizard?category=corporate" className="hover:text-plum-900 transition-colors">Corporate Galas & Summits</Link></li>
              <li><Link href="/wizard?category=college" className="hover:text-plum-900 transition-colors">College Festivals & Proms</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-serif font-bold text-plum-900 text-base mb-4">
              Planning Tools
            </h4>
            <ul className="space-y-2 text-sm text-[#756B5B]">
              <li><Link href="/dashboard/ai-workspace" className="hover:text-plum-900 transition-colors">AI Planning Workspace</Link></li>
              <li><Link href="/dashboard/budget" className="hover:text-plum-900 transition-colors">INR Budget Manager</Link></li>
              <li><Link href="/dashboard/timeline" className="hover:text-plum-900 transition-colors">Day-of Itinerary & Tasks</Link></li>
              <li><Link href="/dashboard/vendors" className="hover:text-plum-900 transition-colors">Vendor Directory & Comparison</Link></li>
              <li><Link href="/dashboard/guests" className="hover:text-plum-900 transition-colors">Guest List & Public RSVP</Link></li>
              <li><Link href="/dashboard/inspiration" className="hover:text-plum-900 transition-colors">Inspiration Studio</Link></li>
            </ul>
          </div>

          {/* Contact / Note */}
          <div>
            <h4 className="font-serif font-bold text-plum-900 text-base mb-4">
              Tech Stack & Guarantee
            </h4>
            <p className="text-sm text-[#756B5B] leading-relaxed">
              Crafted with Next.js App Router, Tailwind CSS, Supabase PostgreSQL, and Google Gemini AI. Built for hackathon demonstration with seamless zero-credential guest mode.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-plum-800 bg-lavender-200/60 px-3 py-1.5 rounded-full font-medium">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 text-coral-500 fill-coral-500 inline" />
              <span>for Celebrators</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#EAE5DC] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#998E7D] gap-4">
          <p>© {new Date().getFullYear()} CelebrationAI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-[#998E7D]">Privacy Policy</span>
            <span className="text-[#998E7D]">Terms of Service</span>
            <span className="text-coral-600 font-medium">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
