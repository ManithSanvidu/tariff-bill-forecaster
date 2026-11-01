"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

import { API_BASE_URL } from "../lib/api";

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
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Unable to log in. Please check credentials.");
      }

      const data = await res.json();
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
    <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans hero-scenic-backdrop">
      <div className="w-full max-w-md apple-dock-card overflow-hidden shadow-2xl p-8 sm:p-9 relative">
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-black tracking-tight">Sign In to TariffPredict</h1>
          <p className="text-xs text-gray-500 mt-1.5">
            Access your household forecasts, meter readings, and Anti-Slab Alerts
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center space-x-2">
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
                className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white/80"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block font-bold text-gray-700">Password</label>
              <a href="#" className="text-[11px] text-gray-500 hover:text-black hover:underline">
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
                className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white/80"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-btn-black py-3 text-xs flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-black/[0.06] text-center text-xs text-gray-500">
          Don't have a registered meter?{" "}
          <Link href="/register" className="font-bold text-black hover:underline">
            Register Household
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-black transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
