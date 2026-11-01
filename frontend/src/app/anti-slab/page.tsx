"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Zap,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
  DollarSign,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Percent,
  LogOut
} from "lucide-react";

export default function AntiSlabPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Slab comparison calculator state
  const [selectedThreshold, setSelectedThreshold] = useState<30 | 60 | 90>(60);
  const [projectedUnits, setProjectedUnits] = useState<number>(64);
  const [daysLeft, setDaysLeft] = useState<number>(16);

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

  // Bill computations based on CEB domestic tariff schedule
  // Threshold 30:
  // <=30: fixed 180 + 30*12 = 540
  // 31: fixed 360 + 30*12 + 1*30 = 750 (difference Rs. 210)
  //
  // Threshold 60 (The big cliff):
  // 60 units (category <=60): fixed 360 + 30*12 + 30*30 = 360 + 360 + 900 = Rs. 1,620
  // 61 units (category >60): fixed 480 + 60*42 + 1*42 = 480 + 2520 + 42 = Rs. 3,042
  // Difference = Rs. 1,422 for 1 SINGLE UNIT!
  //
  // Threshold 90:
  // 90 units: fixed 480 + 60*42 + 30*42 = 480 + 3780 = Rs. 4,260
  // 91 units: fixed 1180 + 60*42 + 30*42 + 1*50 = 1180 + 3780 + 50 = Rs. 5,010
  // Difference = Rs. 750 (jump in fixed charge from 480 to 1180)

  const getSlabDetails = (threshold: number) => {
    if (threshold === 30) {
      return {
        name: "30-Unit Lifeline Block",
        cliffCost: 210,
        safeBill: 540,
        breachedBill: 750,
        description: "The initial lifeline tier for basic lighting and low consumption households.",
        rates: "Rs. 12/unit (≤30) jumps to Rs. 30/unit (31-60) + higher fixed charge."
      };
    }
    if (threshold === 60) {
      return {
        name: "60-Unit Two-Tier Bifurcation (The Mega Cliff)",
        cliffCost: 1422,
        safeBill: 1620,
        breachedBill: 3042,
        description: "The most dangerous tariff threshold in Sri Lanka. Exceeding 60 units converts ALL preceding units to a flat Rs. 42/unit rate retroactive from unit 1.",
        rates: "Under 60: Average ~Rs. 27/unit. Over 60: Flat Rs. 42/unit on all 60 units + Rs. 480 fixed."
      };
    }
    return {
      name: "90-Unit Fixed Charge Escalation",
      cliffCost: 750,
      safeBill: 4260,
      breachedBill: 5010,
      description: "Steep jump in fixed utility charges from Rs. 480 to Rs. 1,180 per month.",
      rates: "Fixed charge hikes by 145% plus unit rate jumps from Rs. 42 to Rs. 50."
    };
  };

  const currentDetails = getSlabDetails(selectedThreshold);

  // Dynamic calculations for user's interactive sliders
  const unitsOver = Math.max(0, projectedUnits - selectedThreshold);
  const dailyReduction = daysLeft > 0 ? (unitsOver / daysLeft) : 0;
  const isOver = projectedUnits > selectedThreshold;

  return (
    <div id="anti-slab" className="min-h-screen text-gray-900 font-sans selection:bg-[#5865F2] selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[15%] w-[550px] h-[550px] rounded-full bg-amber-300/20 blur-[130px]" />
        <div className="absolute top-[35%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px]" />
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
            <Link href="/how-it-works" className="hover:text-gray-900 transition">How It Works</Link>
            <Link href="/anti-slab" className="text-[#5865F2] font-bold">Anti-Slab Alert</Link>
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

      {/* Main Content */}
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

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Tariff Cliff Prevention Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            The Anti-Slab Alert
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            In Sri Lanka, tariffs are not graduated smoothly. Crossing a single tier boundary triggers retroactive penalty pricing and massive fixed-charge surges. We warn you in time to avert it.
          </p>
        </div>

        {/* The 60-Unit Cliff Explanation Card */}
        <div className="mac-window rounded-2xl p-6 sm:p-8 border border-white/80 shadow-xl mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6 mb-6">
            <div>
              <span className="text-[11px] font-black tracking-wider text-rose-600 uppercase bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Highest Financial Risk
              </span>
              <h2 className="text-xl font-extrabold text-gray-900">
                The Anatomy of the 60 vs 61 Unit Cliff
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Single Unit Penalty</span>
              <span className="text-2xl font-black text-rose-600">+Rs. 1,422.00</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 60 Units Case */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Scenario A: 60 Units Exactly
                </span>
                <span className="text-xs font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                  Under 60 Category
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-950 mb-3">
                Rs. 1,620.00
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 font-medium">
                <li>• First 30 units @ Rs. 12.00 = Rs. 360.00</li>
                <li>• Next 30 units (31-60) @ Rs. 30.00 = Rs. 900.00</li>
                <li>• Fixed Charge for Block 31-60 = Rs. 360.00</li>
                <li className="font-bold pt-1 border-t border-emerald-200/60">• Total Monthly Bill: Rs. 1,620.00</li>
              </ul>
            </div>

            {/* 61 Units Case */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Scenario B: 61 Units (Just 1 Extra Unit!)
                </span>
                <span className="text-xs font-bold bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full">
                  Over 60 Category
                </span>
              </div>
              <div className="text-3xl font-black text-rose-950 mb-3">
                Rs. 3,042.00
              </div>
              <ul className="text-xs text-rose-900 space-y-1.5 font-medium">
                <li>• Units 0 to 60 @ Rs. 42.00 (retroactive!) = Rs. 2,520.00</li>
                <li>• Unit 61 @ Rs. 42.00 = Rs. 42.00</li>
                <li>• Fixed Charge hikes to = Rs. 480.00</li>
                <li className="font-bold pt-1 border-t border-rose-200/60">• Total Monthly Bill: Rs. 3,042.00</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Why does this happen?</strong> Sri Lanka’s Public Utilities Commission (PUCSL) bifurcates domestic tariffs into two completely separate rate structures: <strong>Households consuming ≤60 units</strong> benefit from subsidized lifeline blocks, whereas <strong>households consuming 61+ units</strong> lose the subsidy on every single unit consumed from unit 1!
            </p>
          </div>
        </div>

        {/* Interactive Cliff Calculator */}
        <section className="mac-window rounded-2xl p-6 sm:p-8 border border-white/80 shadow-xl mb-16">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-gray-900">
              Interactive Anti-Slab Arbitrage Simulator
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select any slab threshold and see the exact daily sacrifice needed to pocket hundreds or thousands in utility savings
            </p>
          </div>

          {/* Threshold Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {([30, 60, 90] as const).map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => {
                  setSelectedThreshold(slab);
                  setProjectedUnits(slab + 4);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedThreshold === slab
                    ? "bg-[#5865F2] text-white shadow-md scale-100"
                    : "bg-white/80 text-gray-700 border border-gray-200 hover:bg-white"
                }`}
              >
                {slab} Units Threshold
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>Simulated Projected Consumption:</span>
                  <span className="text-[#5865F2] font-black">{projectedUnits} Units</span>
                </div>
                <input
                  type="range"
                  min={selectedThreshold - 10}
                  max={selectedThreshold + 20}
                  value={projectedUnits}
                  onChange={(e) => setProjectedUnits(Number(e.target.value))}
                  className="w-full accent-[#5865F2] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>{selectedThreshold - 10} Units</span>
                  <span className="font-semibold text-gray-600">Threshold: {selectedThreshold}</span>
                  <span>{selectedThreshold + 20} Units</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                  <span>Days Left in Billing Period:</span>
                  <span className="text-gray-900 font-black">{daysLeft} Days</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={daysLeft}
                  onChange={(e) => setDaysLeft(Number(e.target.value))}
                  className="w-full accent-[#5865F2] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>3 Days</span>
                  <span>14 Days</span>
                  <span>25 Days</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-800 block mb-1">{currentDetails.name}</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">{currentDetails.description}</p>
                <span className="text-[11px] font-semibold text-indigo-700 block mt-2">{currentDetails.rates}</span>
              </div>
            </div>

            {/* Alert Output Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors ${
              isOver ? "bg-amber-50/70 border-amber-300" : "bg-emerald-50/70 border-emerald-300"
            }`}>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className={`w-4 h-4 ${isOver ? "text-amber-600" : "text-emerald-600"}`} />
                  <span className={isOver ? "text-amber-900" : "text-emerald-900"}>
                    {isOver ? "Anti-Slab Alert Triggered" : "Safely Within Lower Slab"}
                  </span>
                </div>

                <div className="mt-3 p-4 bg-white/90 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                    {isOver ? (
                      <>
                        "You are on track for about <strong>{projectedUnits} units</strong>. Using about{" "}
                        <span className="text-amber-600 font-black">{dailyReduction.toFixed(2)} fewer units per day</span> for the next{" "}
                        <strong>{daysLeft} days</strong> keeps you in the lower block and saves about{" "}
                        <span className="text-emerald-600 font-black">Rs. {currentDetails.cliffCost:,.0f}</span>."
                      </>
                    ) : (
                      <>
                        "You are projected at <strong>{projectedUnits} units</strong>, safely below the{" "}
                        <strong>{selectedThreshold}-unit threshold</strong>. Keep your daily consumption below{" "}
                        <strong>{((selectedThreshold - projectedUnits) / daysLeft + 2).toFixed(1)} units/day</strong> to preserve your savings."
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Slab Boundary</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedThreshold} kWh</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Potential Loss If Breached</span>
                  <span className="font-bold text-rose-600 text-sm">+Rs. {currentDetails.cliffCost:,.0f}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actionable Household Tips */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900">How to Cut 0.3 - 0.5 Units Per Day</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Practical adjustments to meet your Anti-Slab target without sacrificing essential comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5865F2] flex items-center justify-center font-bold mb-3">
                AC
              </div>
              <h4 className="font-bold text-sm text-gray-900">Air Conditioner Set-Point</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Raising your inverter AC thermostat from 22°C to 25°C reduces cooling load by up to <strong>0.8 kWh per night</strong>.
              </p>
            </div>

            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                H2O
              </div>
              <h4 className="font-bold text-sm text-gray-900">Geyser / Water Heater</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Switch off continuous water heating and switch on only 15 minutes before baths saves approximately <strong>0.6 kWh per day</strong>.
              </p>
            </div>

            <div className="mac-window rounded-2xl p-5 border border-white/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                IRON
              </div>
              <h4 className="font-bold text-sm text-gray-900">Batch Electric Ironing</h4>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Iron clothes in a single batch once a week instead of daily warm-up cycles saves approximately <strong>0.3 kWh per cycle</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="text-center rounded-2xl bg-gradient-to-r from-[#5865F2] to-indigo-700 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black tracking-tight">Protect Your Household Today</h3>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Don't wait for your monthly bill to surprise you. Join households across Sri Lanka managing their tariff arbitrage.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl bg-white text-[#5865F2] text-xs font-bold hover:bg-gray-100 shadow-md transition"
              >
                Sign Up & Enable Alerts
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white text-xs font-bold border border-indigo-400/40 transition"
              >
                Go to Dashboard
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
            <Link href="/how-it-works" className="hover:text-gray-900 font-medium">How It Works</Link>
            <Link href="/dashboard" className="hover:text-gray-900 font-medium">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
