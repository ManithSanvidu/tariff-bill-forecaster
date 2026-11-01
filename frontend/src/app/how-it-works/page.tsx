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
  LogOut
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
    <div id="how-it-works" className="min-h-screen text-gray-900 font-sans selection:bg-[#5865F2] selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[15%] w-[550px] h-[550px] rounded-full bg-purple-300/25 blur-[130px]" />
        <div className="absolute top-[35%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-4 z-40 max-w-5xl mx-auto px-4">
        <div className="mac-window rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5865F2] to-indigo-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-gray-900">
                TariffArbitrage<span className="text-[#5865F2]">.lk</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-gray-600">
            <Link href="/#features" className="hover:text-gray-900 transition">Features</Link>
            <Link href="/how-it-works" className="text-[#5865F2] font-bold">How It Works</Link>
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

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 pt-12 pb-24">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5865F2] text-xs font-bold mb-4">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>System Architecture & Prediction Methodology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            How TariffArbitrage Works
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            Sri Lankan utility tariffs are non-linear step functions. A 1-unit deviation can cost thousands of rupees.
            Here is the engineering breakdown of how we predict consumption with zero financial hallucination.
          </p>
        </div>

        {/* 3 Core Rules Banner */}
        <div className="mac-window rounded-2xl p-6 sm:p-8 mb-16 border border-white/80 shadow-lg">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2]" />
            <span>The 3 Guiding Tenets</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="w-8 h-8 rounded-lg bg-[#5865F2] text-white flex items-center justify-center font-black text-xs mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Deterministic Engine Only</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Machine Learning <strong>never</strong> predicts currency (LKR). ML predicts raw kWh or m³ consumption units. Pure deterministic math computes bills.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Weather Disaggregation</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                We pull hyper-local Sri Lankan weather from Open-Meteo, computing daily Cooling Degree Days (CDD) to isolate AC and refrigeration spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">Mandatory Human Confirmation</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Whether OCR assistance is used or readings are typed manually, every meter state requires explicit user verification before entering the forecasting model.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Workflow */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900">The 4-Stage Arbitrage Pipeline</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              From dial photo to month-end bill protection in under 500 milliseconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm relative">
              <span className="text-[10px] font-black tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-3">
                Step 01
              </span>
              <h4 className="font-bold text-sm text-gray-900">Sparse Dial Capture</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Users capture a weekly meter reading manually or via camera OCR. No expensive IoT hardware or smart plugs needed.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                Input: Timestamp + Dial kWh
              </div>
            </div>

            {/* Step 2 */}
            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm relative">
              <span className="text-[10px] font-black tracking-wider text-[#5865F2] uppercase bg-purple-50 px-2.5 py-0.5 rounded-full inline-block mb-3">
                Step 02
              </span>
              <h4 className="font-bold text-sm text-gray-900">Data Cleansing & CDD</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Cleans negative jumps, meter roll-overs, and correlates past dates with Colombo, Kandy, or Galle district temperature records.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                Enrichment: Open-Meteo CDD
              </div>
            </div>

            {/* Step 3 */}
            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm relative">
              <span className="text-[10px] font-black tracking-wider text-amber-600 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-3">
                Step 03
              </span>
              <h4 className="font-bold text-sm text-gray-900">ML Unit Regression</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Ridge & Quantile regressors output 80% confidence interval [Low 10%, Likely Median, High 90%] for end-of-cycle units.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                Output: Predicted Total Units
              </div>
            </div>

            {/* Step 4 */}
            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm relative">
              <span className="text-[10px] font-black tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-3">
                Step 04
              </span>
              <h4 className="font-bold text-sm text-gray-900">Deterministic Matrix</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Tariff engine feeds predicted units into verified CEB / Water JSON tariff blocks to compute precise rupee bills and Anti-Slab warnings.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                Result: LKR Bill + Daily Cut
              </div>
            </div>
          </div>
        </section>

        {/* Live Interactive Calculation Simulator */}
        <section className="mac-window rounded-2xl p-6 sm:p-8 border border-white/80 shadow-xl mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sliders className="w-4 h-4" />
                <span>Interactive Forecaster Demonstration</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Simulate Mid-Cycle Run-Rate & Daily Target
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">
              Simulated CEB Domestic Cycle (30 Days)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Controls */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>Days Elapsed in Current Cycle:</span>
                  <span className="text-[#5865F2] font-black">{dayElapsed} / 30 Days</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="28"
                  value={dayElapsed}
                  onChange={(e) => setDayElapsed(Number(e.target.value))}
                  className="w-full accent-[#5865F2] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>Day 3</span>
                  <span>{remainingDays} days remaining</span>
                  <span>Day 28</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>Units Used So Far:</span>
                  <span className="text-[#5865F2] font-black">{unitsUsed} kWh</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={unitsUsed}
                  onChange={(e) => setUnitsUsed(Number(e.target.value))}
                  className="w-full accent-[#5865F2] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>5 kWh</span>
                  <span>Current Pace: {currentDailyRate.toFixed(2)} kWh/day</span>
                  <span>120 kWh</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>Critical Target Slab Threshold:</span>
                  <span className="text-amber-600 font-black">{targetSlab} Units Threshold</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 90].map((slab) => (
                    <button
                      key={slab}
                      type="button"
                      onClick={() => setTargetSlab(slab)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        targetSlab === slab
                          ? "bg-[#5865F2] text-white border-[#5865F2] shadow-sm"
                          : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"
                      }`}
                    >
                      {slab} Units
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Projection Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-amber-50/40 border border-indigo-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Forecaster State
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-gray-900">
                    {runRateProjection.toFixed(1)} <span className="text-sm font-semibold text-gray-500">kWh</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      runRateProjection > targetSlab
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {runRateProjection > targetSlab ? "Slab Breach Predicted" : "Safe Within Block"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {runRateProjection > targetSlab ? (
                    <>
                      You are tracking to exceed your {targetSlab}-unit threshold by{" "}
                      <strong>{excessUnits.toFixed(1)} units</strong>. To stay below and protect your cheaper rates,
                      you must reduce your use by <strong>{dailyCutNeeded.toFixed(2)} units/day</strong> for the remaining {remainingDays} days.
                    </>
                  ) : (
                    <>
                      Excellent! Your current rate of {currentDailyRate.toFixed(2)} kWh/day projects{" "}
                      <strong>{(targetSlab - runRateProjection).toFixed(1)} units below</strong> the {targetSlab}-unit threshold.
                    </>
                  )}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Remaining Days</span>
                  <span className="font-bold text-gray-800">{remainingDays} Days</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Daily Pace</span>
                  <span className="font-bold text-gray-800">{currentDailyRate.toFixed(2)} kWh/day</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Needed Cut</span>
                  <span className="font-bold text-amber-700">
                    {dailyCutNeeded > 0 ? `-${dailyCutNeeded.toFixed(2)} u/d` : "0 u/d"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="text-center rounded-2xl bg-[#5865F2] text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black tracking-tight">Ready to Take Control of Your Bill?</h3>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Create your household profile now, add your first meter dial reading, and start receiving actionable Anti-Slab alerts.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl bg-white text-[#5865F2] text-xs font-bold hover:bg-gray-100 shadow-md transition"
              >
                Register Household
              </Link>
              <Link
                href="/anti-slab"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold border border-indigo-400/40 transition"
              >
                Learn About Anti-Slab Alerts
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70 py-8 px-4 text-center text-xs text-gray-500 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 Tiered Utility Tariff Arbitrage & Disaggregation Predictor.</p>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-900 font-medium">Home</Link>
            <Link href="/anti-slab" className="hover:text-gray-900 font-medium">Anti-Slab Alert</Link>
            <Link href="/dashboard" className="hover:text-gray-900 font-medium">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
