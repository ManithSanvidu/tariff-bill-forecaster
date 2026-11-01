"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Unable to log in. Please check credentials.");
      }

      const data = await res.json();
      // Store session state
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_info", JSON.stringify(data.user));
      localStorage.setItem("household_id", data.household_id);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans bg-radial-gradient">
      {/* Outer macOS Window Frame */}
      <div className="w-full max-w-md mac-window rounded-2xl overflow-hidden shadow-2xl border border-white/60">
        
        {/* macOS Title Bar with Traffic Light Controls */}
        <div className="bg-[#fcfbfe]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
              Authentication
            </span>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-700 font-medium">
            Exit
          </Link>
        </div>

        {/* Content Box */}
        <div className="p-8 bg-white/95">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#5865F2] to-indigo-400 flex items-center justify-center text-white shadow-md mb-3">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Sign In to Predictor</h1>
            <p className="text-xs text-gray-500 mt-1">
              Access your Sri Lankan utility tariff forecasts and Anti-Slab Alerts
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. household@ceb.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2] bg-gray-50/50"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-bold text-gray-700">Password</label>
                <a href="#" className="text-[11px] text-[#5865F2] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2] bg-gray-50/50"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Don't have an account?</span>
            <Link href="/register" className="font-bold text-[#5865F2] hover:underline">
              Register Residence
            </Link>
          </div>

          <div className="mt-4 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Strict privacy: Household IDs are pseudonymized from personal identity.</span>
          </div>
        </div>

      </div>
    </main>
  );
}
