"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Camera,
  Layers,
  ChevronRight,
  LogOut,
  Sliders,
  CloudSun,
  Activity,
  Sparkles,
  Search,
  Wifi,
  Clock
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
    <div className="min-h-screen text-[#111111] selection:bg-black selection:text-white relative overflow-x-hidden hero-scenic-backdrop">
      {/* Top Floating Pill Navigation Bar */}
      <header className="pt-6 px-4 fixed top-0 left-0 right-0 z-50 flex justify-center">
        <nav className="apple-pill-nav px-3.5 py-2 flex items-center justify-between gap-6 sm:gap-8 max-w-3xl w-full">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-2.5 pl-1.5 group">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-black">
              TariffPredict
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-6 text-[13px] font-medium text-gray-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <Link href="/how-it-works" className="hover:text-black transition-colors">How It Works</Link>
            <Link href="/anti-slab" className="hover:text-black transition-colors">Anti-Slab Alert</Link>
            <a
              href="https://www.pucsl.gov.lk/electricity/tariff/domestic/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors"
            >
              PUCSL Tariffs
            </a>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="apple-btn-black px-4 py-1.5 text-xs flex items-center space-x-1.5"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white/80 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-black transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="apple-btn-black px-4 py-1.5 text-xs flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-36 sm:pt-40 pb-16 px-4 max-w-4xl mx-auto text-center">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-black/10 shadow-sm text-xs font-semibold text-black mb-6">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>Your smart utility tariff safeguard</span>
        </div>

        {/* Hero Title */}
        <h1 className="apple-hero-title max-w-3xl mx-auto mb-6">
          A useful predictor <br />
          for tiered bills.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
          TariffPredict brings sparse meter tracking, forward-looking run-rate forecasts,
          weather disaggregation, and timely Anti-Slab Alerts right before expensive billing cycle cliffs.
        </p>

        {/* Hero CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/register"
            className="apple-btn-black px-7 py-3 text-sm flex items-center space-x-2 shadow-lg"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Protect your household bill</span>
          </Link>
          <Link
            href="/dashboard"
            className="apple-btn-secondary px-6 py-3 text-sm font-semibold"
          >
            Explore Live Dashboard
          </Link>
        </div>

        {/* Feature Pills under CTA */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 font-medium">
          <span>Deterministic CEB tariffs</span>
          <span>•</span>
          <span>Sparse meter readings</span>
          <span>•</span>
          <span>Anti-Slab cliff mitigation</span>
          <span>•</span>
          <span>Sinhala, Tamil & English</span>
        </div>

        {/* Live macOS Widget Glass Dock (Visual Showcase from prompt) */}
        <div className="mt-14 max-w-3xl mx-auto apple-dock-card overflow-hidden text-left relative shadow-2xl">
          {/* Top Bar with Center Notch */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-black/[0.06] bg-white/50 relative">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
                <Zap className="w-3 h-3 fill-white" />
              </div>
              <span className="font-bold text-xs tracking-tight text-black">TariffPredict Dock</span>
            </div>

            {/* macOS Style Notch in center */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 px-6 py-1 notch-pill text-white text-[10px] font-medium flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Slab Guard Active</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-400 text-xs">
              <Search className="w-3.5 h-3.5 hover:text-black cursor-pointer transition" />
              <Wifi className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-[11px] font-semibold text-gray-700">09:41</span>
            </div>
          </div>

          {/* Dock Widget Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/70">
            {/* Widget 1: Anti-Slab Alert */}
            <div className="p-5 rounded-2xl bg-black text-white md:col-span-2 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                    Anti-Slab Alert Triggered
                  </span>
                  <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300 font-mono">
                    60-Unit Boundary
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold leading-snug">
                  "At your current pace you will probably use about 64 units, with a high chance of crossing the 60-unit slab."
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Using about <strong className="text-white">0.25 fewer units per day</strong> from today keeps you inside the lower block and saves about <strong className="text-emerald-300">Rs. 1,422.00</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">Days remaining: 16 days</span>
                <Link href="/anti-slab" className="text-amber-300 font-bold hover:underline inline-flex items-center gap-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Widget 2: Month-End Range Preview */}
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Projected Consumption
                </span>
                <div className="mt-2 text-2xl font-black text-black tracking-tight">
                  58 – 71 <span className="text-xs font-semibold text-gray-500">units</span>
                </div>
                <div className="mt-1 text-sm font-bold text-gray-800">
                  Rs. 1,620 – Rs. 3,672
                </div>
                <p className="text-[11px] text-gray-500 mt-2 leading-normal">
                  Strictly deterministic calculation based on official PUCSL domestic tariffs.
                </p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                  <span>Current 60-Slab Target</span>
                  <span className="font-bold text-amber-600">82%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-black h-2 rounded-full w-[82%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section id="features" className="py-20 px-4 max-w-4xl mx-auto border-t border-black/[0.06]">
        <div className="text-center mb-14">
          <div className="apple-kicker justify-center mb-2">
            <span>Essential Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold text-black tracking-tight">
            Designed for Sri Lankan households.
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Everything you need to stop surprise utility bills before the billing cycle closes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="apple-sub-card p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Likely Range Projections</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Rather than giving you an unreliable single number, we calculate a transparent confidence range (e.g. 58 to 71 units) and compute both boundaries deterministically.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/[0.06] text-xs font-semibold text-black flex items-center justify-between">
              <span>Unbiased ML engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="apple-sub-card p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Weather Disaggregation</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Separates routine household baseline usage from weather-driven cooling loads (using local Cooling Degree Days), showing why your meter accelerated.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/[0.06] text-xs font-semibold text-black flex items-center justify-between">
              <span>Open-Meteo CDD live feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="apple-sub-card p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Sparse Weekend Logging</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Enter your meter reading just once a week or fortnight. Type it manually or use camera OCR assist with mandatory confirmation to ensure 100% accuracy.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/[0.06] text-xs font-semibold text-black flex items-center justify-between">
              <span>Prompt on weekends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-10 px-4 text-center text-xs text-gray-500 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
              <Zap className="w-3 h-3 fill-white" />
            </div>
            <span className="font-bold text-gray-900">TariffPredict LK</span>
            <span>• © 2026 Deterministic Utility Engine</span>
          </div>

          <div className="flex space-x-5 font-medium text-gray-600">
            <Link href="/how-it-works" className="hover:text-black transition">How It Works</Link>
            <Link href="/anti-slab" className="hover:text-black transition">Anti-Slab Alert</Link>
            <Link href="/login" className="hover:text-black transition">Sign In</Link>
            <Link href="/register" className="hover:text-black transition">Register</Link>
            <Link href="/dashboard" className="hover:text-black transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
