"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Droplets,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Camera,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  CloudSun,
  Layers,
  ChevronRight,
  UserCheck,
  LogOut
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user_info");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("household_id");
    } catch (e) {}
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans selection:bg-[#5865F2] selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-300/25 blur-[100px]" />
      </div>

      {/* Navigation Bar in macOS Glassmorphism Style */}
      <nav className="sticky top-4 z-40 max-w-5xl mx-auto px-4">
        <div className="mac-window rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5865F2] to-indigo-400 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-gray-900">
                TariffArbitrage<span className="text-[#5865F2]">.lk</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <Link href="/how-it-works" className="hover:text-gray-900 transition">How It Works</Link>
            <Link href="/anti-slab" className="hover:text-gray-900 transition">Anti-Slab Alert</Link>
            <a href="https://www.pucsl.gov.lk/electricity/tariff/domestic/" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition">PUCSL Tariffs</a>
          </div>

          <div className="flex items-center space-x-2.5">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                >
                  <span>Dashboard ({currentUser.name})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold shadow-sm transition"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white/70 hover:bg-white text-xs font-semibold text-gray-700 shadow-sm transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold shadow-md flex items-center space-x-1 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5865F2] text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Designed for Sri Lankan Households • CEB & NWSDB Compatible</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Predict your month-end bill. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] via-indigo-600 to-purple-600">
            Never cross a costly tariff slab.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          In Sri Lanka, using just <strong>1 extra unit</strong> can jump your electricity bill by over <strong>Rs. 1,400</strong>. 
          Our ML forecaster tracks sparse meter readings and issues an Anti-Slab Alert before you cross expensive tier boundaries.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-bold shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Free Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white/80 hover:bg-white text-sm font-semibold text-gray-700 shadow-sm transition"
          >
            View Live Demo Window
          </Link>
        </div>

        {/* Hero macOS App Preview Window */}
        <div className="mt-12 max-w-4xl mx-auto mac-window rounded-2xl overflow-hidden shadow-2xl border border-white/80 text-left">
          <div className="bg-[#fcfbfe]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                Live Arbitrage Preview • Colombo Residence
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Anti-Slab Active
            </span>
          </div>

          <div className="p-6 bg-white/90 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl md:col-span-2">
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Anti-Slab Alert: 60-Unit Threshold</span>
              </div>
              <p className="text-sm font-medium text-gray-800 mt-2">
                "You are on track for about 64 units. Using about <strong>0.25 fewer units per day</strong> for the next 16 days keeps you in the lower block and saves about <strong>Rs. 1,422</strong>."
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Predicted End-of-Month</span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">Rs. 3,042</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">Target if kept ≤60: Rs. 1,620</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-amber-500 h-2 rounded-full w-[82%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principle & Architecture Highlights */}
      <section id="features" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Engineered with Uncompromising Determinism
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Machine Learning predicts consumption units only. Official tariff matrices calculate every rupee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="mac-window p-6 rounded-2xl border border-white/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5865F2] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Deterministic Engine</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Never lets black-box ML hallucinate financial bills. Tariffs follow versioned JSON blocks with exact slab step boundaries.
            </p>
          </div>

          {/* Card 2 */}
          <div className="mac-window p-6 rounded-2xl border border-white/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Weather Disaggregation</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Integrates Open-Meteo cooling degree days (CDD) to tell you exactly how many extra units a heatwave or dry spell will add.
            </p>
          </div>

          {/* Card 3 */}
          <div className="mac-window p-6 rounded-2xl border border-white/70 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">OCR Assist + User Confirm</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Scan your meter with input assistance, but readings are strictly confirmed by you before any save to ensure flawless records.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/70 py-8 px-4 text-center text-xs text-gray-500 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 Tiered Utility Tariff Arbitrage & Disaggregation Predictor.</p>
          <div className="flex space-x-4">
            <Link href="/how-it-works" className="hover:text-gray-900 font-medium">How It Works</Link>
            <Link href="/anti-slab" className="hover:text-gray-900 font-medium">Anti-Slab Alert</Link>
            <Link href="/login" className="hover:text-gray-900 font-medium">Sign In</Link>
            <Link href="/register" className="hover:text-gray-900 font-medium">Register</Link>
            <Link href="/dashboard" className="hover:text-gray-900 font-medium">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
