"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  RefreshCw,
  PlusCircle,
  Zap,
  Droplets,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Calendar,
  CloudSun,
  ShieldAlert,
  Camera,
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

interface ProjectionData {
  household_id: string;
  utility_type: string;
  days_elapsed: number;
  remaining_days: number;
  units_so_far: number;
  projection: {
    units_low: number;
    units_likely: number;
    units_high: number;
    bill_low_lkr: number;
    bill_likely_lkr: number;
    bill_high_lkr: number;
  };
  disaggregation: {
    baseline_units: number;
    weather_driven_units: number;
    run_rate_baseline: number;
  };
  slab_status: {
    current_slab: number;
    next_slab: number;
    progress_percent: number;
  };
  tariff_meta: {
    tariff_id: string;
    tariff_name: string;
    verified: boolean;
    warning: string | null;
  };
}

interface AlertData {
  alert_type: string;
  target_slab: number;
  projected_units: number;
  remaining_days: number;
  crossing_probability: number;
  units_to_cut_total: number;
  required_daily_reduction_units: number;
  potential_saving_lkr: number;
  projected_bill_lkr: number;
  target_bill_lkr: number;
  message: string;
  verified_tariff: boolean;
}

export default function Home() {
  const [householdId, setHouseholdId] = useState("HH-LK-CMB-001");
  const [utility, setUtility] = useState<"electricity" | "water">("electricity");
  const [activeTab, setActiveTab] = useState<"dashboard" | "trends" | "settings">("dashboard");
  const [loading, setLoading] = useState(false);

  // Data states
  const [projection, setProjection] = useState<ProjectionData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [trends, setTrends] = useState<any[]>([]);

  // Add reading modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [readingInput, setReadingInput] = useState("");
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split("T")[0]);
  const [isOcrMode, setIsOcrMode] = useState(false);
  const [ocrCandidate, setOcrCandidate] = useState<number | null>(null);
  const [userConfirmedOcr, setUserConfirmedOcr] = useState(false);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);

  // Settings
  const [weeklyReminder, setWeeklyReminder] = useState(true);
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");

  // Fetch projection & alerts
  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await fetch(`http://127.0.0.1:8000/households/${householdId}/projection?utility_type=${utility}`);
      if (projRes.ok) {
        const data = await projRes.json();
        setProjection(data);
      }

      const alertRes = await fetch(`http://127.0.0.1:8000/households/${householdId}/alerts?utility_type=${utility}`);
      if (alertRes.ok) {
        const aData = await alertRes.json();
        setAlerts(aData.alerts || []);
      }

      const trendRes = await fetch(`http://127.0.0.1:8000/households/${householdId}/trends?utility_type=${utility}`);
      if (trendRes.ok) {
        const tData = await trendRes.json();
        setTrends(tData.trends || []);
      }
    } catch (err) {
      console.warn("Backend not reached directly, using local fallback state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [householdId, utility]);

  // Handle OCR simulation / extract
  const handleScanMeter = () => {
    setIsOcrMode(true);
    // Simulate candidate value requiring mandatory human confirmation
    const candidate = 1548.5;
    setOcrCandidate(candidate);
    setReadingInput(candidate.toString());
    setUserConfirmedOcr(false);
  };

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingInput) return;

    if (isOcrMode && !userConfirmedOcr) {
      alert("Please check and confirm the extracted meter reading before saving.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household_id: householdId,
          utility_type: utility,
          cumulative_reading: parseFloat(readingInput),
          reading_date: readingDate,
          input_source: isOcrMode ? "ocr_assisted" : "manual",
          confirmed_by_user: true,
        }),
      });

      if (res.ok) {
        setAddSuccessMessage("Reading saved and confirmed successfully!");
        setTimeout(() => {
          setAddSuccessMessage(null);
          setIsAddModalOpen(false);
          setReadingInput("");
          setIsOcrMode(false);
          fetchData();
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to save reading:", err);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
      {/* Outer macOS Window Frame */}
      <div className="w-full max-w-4xl mac-window rounded-2xl overflow-hidden shadow-2xl border border-white/60 transition-all duration-300">

        {/* macOS Title Bar with Traffic Light Controls */}
        <div className="bg-[#fcfbfe]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <span className="ml-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">
              Utility Tariff Arbitrage & Disaggregation
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Utility Selector */}
            <div className="bg-gray-200/70 p-0.5 rounded-lg flex text-xs font-medium">
              <button
                onClick={() => setUtility("electricity")}
                className={`px-3 py-1 rounded-md flex items-center space-x-1 transition-all ${utility === "electricity" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Electricity</span>
              </button>
              <button
                onClick={() => setUtility("water")}
                className={`px-3 py-1 rounded-md flex items-center space-x-1 transition-all ${utility === "water" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Water</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>

        {/* User / Household Profile Header (macOS Card style matching screenshot) */}
        <div className="p-6 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5865F2] to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              LK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-gray-900">Household: {householdId}</h1>
                <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                  Colombo (CEB)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Pseudonymous Telemetry ID • Weather Location: 6.92°N, 79.86°E
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 flex items-center space-x-1.5 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === "settings" ? "dashboard" : "settings")}
              className={`p-1.5 rounded-lg border border-gray-200 ${activeTab === "settings" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                } text-gray-600 shadow-sm transition`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unverified Tariff Limitation Banner */}
        {projection?.tariff_meta && !projection.tariff_meta.verified && (
          <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Limitation Notice:</strong> Tariff rates are unverified placeholders. Actual bill may vary.
              </span>
            </div>
            <a
              href="https://www.pucsl.gov.lk/electricity/tariff/domestic/"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold flex items-center space-x-1 text-amber-800 hover:text-amber-950 ml-2"
            >
              <span>PUCSL Schedule</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 pt-4 pb-2 bg-white flex space-x-2 border-b border-gray-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-2 px-3 border-b-2 transition ${activeTab === "dashboard"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            Month-End Forecaster
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`pb-2 px-3 border-b-2 transition ${activeTab === "trends"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            Historical Trends & Weather
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-2 px-3 border-b-2 transition ${activeTab === "settings"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            Preferences & i18n
          </button>
        </div>

        {/* Main Body Content */}
        <div className="p-6 bg-[#faf9fc]/70 space-y-6">

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* Anti-Slab Alert Card (The Core Arbitrage Warning) */}
              {alerts && alerts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Anti-Slab Alert: {alerts[0].target_slab} Units Boundary
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Potential Saving: Rs. {alerts[0].potential_saving_lkr.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-2 leading-relaxed">
                        {alerts[0].message}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          Remaining Days: <strong>{alerts[0].remaining_days} days</strong>
                        </span>
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          Daily Cut Needed: <strong>{alerts[0].required_daily_reduction_units} units/day</strong>
                        </span>
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          Crossing Confidence: <strong>{(alerts[0].crossing_probability * 100).toFixed(0)}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Month-End Units Prediction Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>Projected Month-End Units</span>
                    <Zap className="w-4 h-4 text-[#5865F2]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {projection?.projection.units_likely ?? "64.0"}
                    </span>
                    <span className="text-xs font-medium text-gray-500">kWh units</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">80% Interval:</span>{" "}
                    {projection?.projection.units_low ?? "58.2"} – {projection?.projection.units_high ?? "70.5"} units
                  </div>
                </div>

                {/* 2. Projected Month-End Bill Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>Projected Bill (Config Engine)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      Rs. {projection?.projection.bill_likely_lkr.toLocaleString() ?? "3,180"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">Expected Range:</span> Rs.{" "}
                    {projection?.projection.bill_low_lkr.toLocaleString() ?? "1,580"} – Rs.{" "}
                    {projection?.projection.bill_high_lkr.toLocaleString() ?? "3,450"}
                  </div>
                </div>

                {/* 3. Cycle Progress & Run-rate */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>Cycle Elapsed</span>
                    <Calendar className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {projection?.days_elapsed ?? 14}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      / 30 days ({projection?.remaining_days ?? 16} left)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">Recorded:</span>{" "}
                    {projection?.units_so_far ?? 41.5} units to date
                  </div>
                </div>
              </div>

              {/* Progress to Next Slab Boundary */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-gray-700">
                    Tariff Slab Level: {projection?.slab_status.current_slab ?? 60} Units
                  </span>
                  <span className="font-semibold text-gray-500">
                    Approaching Next Threshold: {projection?.slab_status.next_slab ?? 90} Units
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${(projection?.slab_status.progress_percent ?? 50) > 75
                        ? "bg-amber-500"
                        : "bg-[#5865F2]"
                      }`}
                    style={{ width: `${projection?.slab_status.progress_percent ?? 50}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                  <span>0 Units</span>
                  <span className="font-medium text-amber-700">
                    {projection?.slab_status.progress_percent ?? 50}% of current block consumed
                  </span>
                  <span>180+ Units</span>
                </div>
              </div>

              {/* Disaggregation Card: Baseline vs Weather Driven */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Consumption Disaggregation
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 block">Baseline Household Load</span>
                    <span className="text-xl font-bold text-gray-900 mt-1 block">
                      {projection?.disaggregation.baseline_units ?? 60.0} units
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      Routine lighting, refrigeration, appliances.
                    </span>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200">
                    <span className="text-amber-800 font-medium block">Weather-Driven Load</span>
                    <span className="text-xl font-bold text-amber-900 mt-1 block">
                      +{projection?.disaggregation.weather_driven_units ?? 4.0} units
                    </span>
                    <span className="text-[11px] text-amber-700 mt-1 block">
                      Hot week ahead (+2.4°C CDD) adds ~4 units cooling load.
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TRENDS & WEATHER OVERLAY */}
          {activeTab === "trends" && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Historical Consumption vs Weather Overlay</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Monthly billed units correlated with Open-Meteo temperature and rainfall
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 text-indigo-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                    <span>Units</span>
                  </span>
                  <span className="flex items-center space-x-1 text-amber-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Temp (°C)</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0edf5" />
                    <XAxis dataKey="cycle" stroke="#9ca3af" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#5865F2" fontSize={11} domain={[40, 80]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} domain={[25, 35]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e5e0ea",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="units"
                      stroke="#5865F2"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name="Units (kWh)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="mean_temp"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                      name="Mean Temp (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & I18N */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Application Preferences</h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Weekly Reminder Notifications</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Prompt for sparse manual meter reading on weekends
                  </p>
                </div>
                <button
                  onClick={() => setWeeklyReminder(!weeklyReminder)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${weeklyReminder ? "bg-[#5865F2]" : "bg-gray-200"
                    }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${weeklyReminder ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Language / භාෂාව / மொழி</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Select interface localization</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 font-medium text-gray-700"
                >
                  <option value="en">English</option>
                  <option value="si">සිංහල (Sinhala)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Add Reading Modal (with Mandatory OCR Human Confirmation Step) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all">

            {/* Modal Title Bar */}
            <div className="bg-[#fbfafc] px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="mac-traffic-light bg-[#ff5f56]" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Record Meter Reading
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveReading} className="p-6 space-y-4">

              {addSuccessMessage ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="text-sm font-semibold">{addSuccessMessage}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="text-xs text-gray-500 font-medium">Input Method</span>
                    <button
                      type="button"
                      onClick={handleScanMeter}
                      className="text-xs font-semibold text-[#5865F2] hover:text-[#4752c4] flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan Meter (OCR Assist)</span>
                    </button>
                  </div>

                  {/* OCR Confirmation Notification Step */}
                  {isOcrMode && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-2">
                      <p className="font-semibold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span>OCR candidate value extracted: {ocrCandidate}</span>
                      </p>
                      <p className="text-gray-600 text-[11px]">
                        Please inspect the dial and confirm or correct the number below before saving.
                      </p>
                      <label className="flex items-center space-x-2 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userConfirmedOcr}
                          onChange={(e) => setUserConfirmedOcr(e.target.checked)}
                          className="rounded text-[#5865F2]"
                        />
                        <span className="text-xs font-bold text-indigo-950">
                          I confirm this reading matches my physical meter
                        </span>
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cumulative Dial Reading ({utility === "electricity" ? "kWh" : "m³"})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 1548.5"
                      value={readingInput}
                      onChange={(e) => setReadingInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Reading Date
                    </label>
                    <input
                      type="date"
                      required
                      value={readingDate}
                      onChange={(e) => setReadingDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-lg border text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold shadow-md transition"
                    >
                      Confirm & Save Reading
                    </button>
                  </div>
                </>
              )}
            </form>

          </div>
        </div>
      )}
    </main>
  );
}
