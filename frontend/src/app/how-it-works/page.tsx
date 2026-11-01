"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowRight,
  TrendingDown,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Gauge,
  Sliders,
  DollarSign,
  HelpCircle,
  Clock,
  Compass,
  Cpu,
  LogOut,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react";

export default function HowItWorksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"architecture" | "workflow" | "math">("architecture");

  // Interactive step-by-step simulator
  const [dayElapsed, setDayElapsed] = useState<number>(14);
  const [unitsUsed, setUnitsUsed] = useState<number>(32);
  const [targetSlab, setTargetSlab] = useState<number>(60);

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

  const remainingDays = 30 - dayElapsed;
  const currentDailyRate = dayElapsed > 0 ? unitsUsed / dayElapsed : 0;
  const runRateProjection = unitsUsed + (currentDailyRate * remainingDays);
  const excessUnits = Math.max(0, runRateProjection - targetSlab);
  const dailyCutNeeded = remainingDays > 0 ? (excessUnits / remainingDays) : 0;

  return (
    <div id="how-it-works" className="min-h-screen text-[#111111] selection:bg-black selection:text-white hero-scenic-backdrop">
      {/* Top Floating Pill Navigation Bar */}
      <header className="pt-6 px-4 fixed top-0 left-0 right-0 z-50 flex justify-center">
        <nav className="apple-pill-nav px-3.5 py-2 flex items-center justify-between gap-6 sm:gap-8 max-w-3xl w-full">
          <Link href="/" className="flex items-center space-x-2.5 pl-1.5 group">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-black">
              TariffPredict
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-[13px] font-medium text-gray-600">
            <Link href="/#features" className="hover:text-black transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-black font-bold">How It Works</Link>
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

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-36 pb-24">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="apple-kicker justify-center mb-3">
            <Cpu className="w-4 h-4 text-black" />
            <span>Architecture & Principles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            How TariffPredict Works.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            Sparse readings meet deterministic financial logic. Here is how we turn weekend snapshots into proactive, tariff-aware household savings.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-full bg-black/5 border border-black/10">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition ${
                activeTab === "architecture"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              System Architecture
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition ${
                activeTab === "workflow"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Household Routine
            </button>
            <button
              onClick={() => setActiveTab("math")}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition ${
                activeTab === "math"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Anti-Slab Mathematics
            </button>
          </div>
        </div>

        {/* TAB 1: ARCHITECTURE */}
        {activeTab === "architecture" && (
          <div className="space-y-8">
            <div className="apple-dock-card p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-black">The Core Architectural Principle</h3>
                  <span className="text-xs font-semibold text-gray-500">Separation of Concerns: ML vs Financial Determinism</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                In most naive AI applications, models are asked to predict the final bill in currency directly. 
                In utility billing, that is dangerous and leads to hallucinations. Electricity and water tariffs in Sri Lanka are
                governed by step functions and punitive retroactive thresholds.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>What Machine Learning Predicts</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                    <li>Projected physical units (kWh / cubic meters)</li>
                    <li>Likely range boundaries (P10 to P90 uncertainty)</li>
                    <li>Weather sensitivity (Cooling Degree Days correlation)</li>
                    <li>Weekend vs weekday run rates</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-black text-white">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>What Deterministic Engines Compute</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li>Step-by-step tariff tier progression</li>
                    <li>Punitive retroactive rate jumps (e.g. 60 vs 61 units)</li>
                    <li>Official fixed charges and statutory surcharges</li>
                    <li>Exact rupee-value savings for cutting 0.2 units/day</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pipeline Visual Flow */}
            <div className="apple-dock-card p-6 sm:p-8">
              <h3 className="font-extrabold text-base text-black mb-6">Four-Stage Prediction Pipeline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="apple-sub-card p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Stage 01</span>
                  <h4 className="font-bold text-sm text-black">Sparse Capture</h4>
                  <p className="text-xs text-gray-500 mt-1">Manual entry or camera OCR with mandatory human confirmation.</p>
                </div>
                <div className="apple-sub-card p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Stage 02</span>
                  <h4 className="font-bold text-sm text-black">Daily Run-Rate</h4>
                  <p className="text-xs text-gray-500 mt-1">Elapsed consumption normalized by days and localized weather trends.</p>
                </div>
                <div className="apple-sub-card p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Stage 03</span>
                  <h4 className="font-bold text-sm text-black">Tariff Lookup</h4>
                  <p className="text-xs text-gray-500 mt-1">JSON matrix maps expected units into official PUCSL slabs.</p>
                </div>
                <div className="apple-sub-card p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Stage 04</span>
                  <h4 className="font-bold text-sm text-black">Anti-Slab Alert</h4>
                  <p className="text-xs text-gray-500 mt-1">Generates exact daily reduction targets if crossing into higher block.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKFLOW */}
        {activeTab === "workflow" && (
          <div className="space-y-6">
            <div className="apple-dock-card p-6 sm:p-8">
              <h3 className="font-extrabold text-lg text-black mb-2">A Frictionless Weekend Routine</h3>
              <p className="text-xs text-gray-600 mb-6">
                You do not need a smart IoT meter or expensive hardware. The system is designed specifically for sparse, irregular human inputs.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-black/[0.08] flex items-start space-x-3.5 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">Weekend Reminder Notification</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Every Saturday morning, a subtle desktop or browser prompt asks for a 10-second meter reading check.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-black/[0.08] flex items-start space-x-3.5 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">Type It or Photograph It</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Type the odometer numbers directly, or take a picture. If using photo OCR, the system highlights the detected digits for your confirmation.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-black/[0.08] flex items-start space-x-3.5 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">Instant Forecast & Anti-Slab Advisory</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Instantly see where your bill will land at month-end. If you are projected to hit 63 units, it advises: "Cut 0.2 units per day for 15 days to stay at 60 units and save Rs. 1,422."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATHEMATICS */}
        {activeTab === "math" && (
          <div className="space-y-8">
            <div className="apple-dock-card p-6 sm:p-8">
              <h3 className="font-extrabold text-lg text-black mb-2">Interactive Run-Rate & Daily Cut Simulator</h3>
              <p className="text-xs text-gray-600 mb-6">
                Drag the sliders below to see exactly how our math detects run-rate deviations and determines the minimum daily cut required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                      <span>Days Elapsed into Billing Cycle:</span>
                      <span className="font-bold text-black">{dayElapsed} / 30 Days</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="27"
                      value={dayElapsed}
                      onChange={(e) => setDayElapsed(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                      <span>Units Consumed So Far:</span>
                      <span className="font-bold text-black">{unitsUsed} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={unitsUsed}
                      onChange={(e) => setUnitsUsed(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                      <span>Target Tariff Slab Limit:</span>
                      <span className="font-bold text-black">{targetSlab} Units</span>
                    </div>
                    <div className="flex space-x-2 mt-1">
                      {[30, 60, 90].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTargetSlab(s)}
                          className={`flex-1 py-1.5 rounded-full text-xs font-bold border transition ${
                            targetSlab === s
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-black/10 hover:bg-gray-50"
                          }`}
                        >
                          {s} Units
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="apple-sub-card p-5 flex flex-col justify-between bg-black text-white">
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                      Calculated Run-Rate Analysis
                    </span>
                    <div className="text-2xl font-black mt-2">
                      {runRateProjection.toFixed(1)} <span className="text-xs font-normal text-gray-400">Projected Units</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      At your current pace of <strong>{currentDailyRate.toFixed(2)} units/day</strong>, you have <strong>{remainingDays} days</strong> remaining in the cycle.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    {excessUnits > 0 ? (
                      <div className="space-y-1">
                        <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Will Breach {targetSlab} Slab by {excessUnits.toFixed(1)} Units</span>
                        </span>
                        <div className="text-xs text-gray-200">
                          Required Reduction: <strong className="text-white text-sm">{dailyCutNeeded.toFixed(2)} units/day</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Safely within {targetSlab} slab with {Math.abs(excessUnits).toFixed(1)} units buffer</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Card */}
        <div className="mt-14 p-8 rounded-3xl bg-black text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-black tracking-tight">Ready to verify your household?</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Log your initial meter reading now and receive an instant month-end consumption range and Anti-Slab advisory.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-100 transition shadow-md"
              >
                Create Account
              </Link>
              <Link
                href="/anti-slab"
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
              >
                Learn Anti-Slab Alerts
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-10 px-4 text-center text-xs text-gray-500 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TariffPredict LK • Deterministic Sri Lankan Utility Engine.</p>
          <div className="flex space-x-5 font-medium text-gray-600">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <Link href="/anti-slab" className="hover:text-black transition">Anti-Slab Alert</Link>
            <Link href="/dashboard" className="hover:text-black transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
