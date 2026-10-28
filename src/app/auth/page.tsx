"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const { setUser, loginAsGuest } = useEventContext();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  const handleGuestDemo = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // If Supabase is configured, use real Supabase Auth
    if (supabaseConfigured) {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            full_name: fullName || email.split("@")[0],
            avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          });
          setMessage({
            type: "success",
            text: "Account created successfully! Redirecting to dashboard...",
          });
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } else if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || email.split("@")[0],
          });
          router.push("/dashboard");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({
            type: "success",
            text: "Password reset link sent to your email address.",
          });
        }
        setLoading(false);
      }
    } else {
      // Offline / Demo Authentication Fallback
      setTimeout(() => {
        if (mode === "forgot") {
          setMessage({
            type: "success",
            text: "Demo mode: Password reset instructions simulated for " + email,
          });
          setLoading(false);
          return;
        }

        setUser({
          id: "usr-" + Date.now(),
          full_name: fullName || (email ? email.split("@")[0] : "Celebrator"),
          city: "Pune",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        });

        setMessage({
          type: "success",
          text: "Signed in successfully in Demo Mode! Redirecting...",
        });
        setTimeout(() => router.push("/dashboard"), 800);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 -z-10 h-72 w-72 rounded-full bg-lavender-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 -z-10 h-72 w-72 rounded-full bg-coral-100/50 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-plum-800 text-white shadow-soft">
            <Sparkles className="h-5 w-5 text-coral-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-plum-950">
            CelebrationAI
          </span>
        </Link>
        <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-plum-950">
          {mode === "signin" && "Welcome back, Planner"}
          {mode === "signup" && "Create your celebration account"}
          {mode === "forgot" && "Reset your password"}
        </h2>
        <p className="mt-1 text-xs text-[#756B5B]">
          {mode === "signin" && "Sign in to access your master event dashboard and vendors."}
          {mode === "signup" && "Start planning with AI-powered budgets and timelines."}
          {mode === "forgot" && "Enter your email to receive recovery instructions."}
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#EAE5DC] shadow-hover space-y-6">
          {/* Guest One-Click Button */}
          <div>
            <button
              onClick={handleGuestDemo}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-coral-600" />
              <span>Explore as Guest (No Registration Required)</span>
            </button>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ECE7DE]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#998E7D] uppercase font-bold tracking-wider text-[10px]">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-coral-50 text-coral-800 border border-coral-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-plum-900 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#998E7D]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#998E7D]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-plum-900">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] font-semibold text-coral-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#998E7D]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Processing..."
                  : mode === "signin"
                  ? "Sign In to Dashboard"
                  : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Link"}
              </span>
              <ArrowRight className="h-4 w-4 text-coral-400" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center pt-2 border-t border-[#ECE7DE] text-xs text-[#756B5B]">
            {mode === "signin" && (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-bold text-plum-900 hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-bold text-plum-900 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p>
                Remembered your password?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-bold text-plum-900 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Supabase status indicator */}
        <div className="mt-6 text-center text-[11px] text-[#998E7D] flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-plum-800" />
          <span>
            {supabaseConfigured
              ? "Live Supabase Auth Connected"
              : "Zero-Setup Demo Auth Active (No setup needed to test)"}
          </span>
        </div>
      </div>
    </div>
  );
}
