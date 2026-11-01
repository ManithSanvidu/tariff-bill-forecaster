"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  Sliders,
  Check,
  Languages,
  LogOut,
  UserPlus
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
import { translations, Language } from "../lib/translations";

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
  const router = useRouter();
  const [householdId, setHouseholdId] = useState("HH-LK-CMB-001");
  const [currentUser, setCurrentUser] = useState<any>(null);
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

  // Settings & Localization (saved in localStorage)
  const [weeklyReminder, setWeeklyReminder] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>("en");
  const [notificationPermission, setNotificationPermission] = useState<string>("default");
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);
  const [isWeekendSimulated, setIsWeekendSimulated] = useState<boolean>(false);

  // Active translation lookup
  const t = translations[language] || translations.en;

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem("app_language") as Language;
      if (storedLang && (storedLang === "en" || storedLang === "si" || storedLang === "ta")) {
        setLanguage(storedLang);
      }
      const storedReminder = localStorage.getItem("app_weekly_reminder");
      if (storedReminder !== null) {
        setWeeklyReminder(storedReminder === "true");
      }
      const storedHousehold = localStorage.getItem("household_id");
      if (storedHousehold) {
        setHouseholdId(storedHousehold);
      }
      const storedUser = localStorage.getItem("user_info");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {}
      }
      if (typeof window !== "undefined" && "Notification" in window) {
        setNotificationPermission(Notification.permission);
      }
    } catch (e) {
      console.error("Failed to load saved preferences", e);
    }
  }, []);

  // Handle Logout: Clears all account authentication and household states
  const handleLogout = (redirectToRegister: boolean = false) => {
    try {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("household_id");
      localStorage.removeItem("reminder_dismissed_date");
      // Keep language & reminder preference intact for UX
    } catch (e) {}

    if (redirectToRegister) {
      router.push("/register");
    } else {
      router.push("/login");
    }
  };

  // Check for weekend reminder alert when weekly reminder is enabled
  useEffect(() => {
    const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = today === 0 || today === 6 || isWeekendSimulated;

    if (weeklyReminder && isWeekend) {
      // Check if user dismissed today's reminder
      const dismissedDate = localStorage.getItem("reminder_dismissed_date");
      const todayStr = new Date().toISOString().split("T")[0];
      if (dismissedDate !== todayStr) {
        setReminderToast(t.reminderPromptWeekend);
      }
    } else {
      setReminderToast(null);
    }
  }, [weeklyReminder, isWeekendSimulated, language, t.reminderPromptWeekend]);

  // Handle toggling weekly reminders
  const handleToggleWeeklyReminder = async () => {
    const nextVal = !weeklyReminder;
    setWeeklyReminder(nextVal);
    localStorage.setItem("app_weekly_reminder", String(nextVal));

    if (nextVal) {
      // Request browser notification permission if available
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          try {
            const perm = await Notification.requestPermission();
            setNotificationPermission(perm);
          } catch (e) {}
        }
      }
      setSettingsFeedback(t.weeklyReminderStatusOn);
    } else {
      setSettingsFeedback(t.weeklyReminderStatusOff);
      setReminderToast(null);
    }

    setTimeout(() => {
      setSettingsFeedback(null);
    }, 3500);
  };

  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("app_language", newLang);
    setSettingsFeedback(translations[newLang].settingsSavedNotice);
    setTimeout(() => {
      setSettingsFeedback(null);
    }, 3000);
  };

  // Test notification trigger
  const handleSendTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(t.appName, {
        body: t.reminderPromptWeekend,
        icon: "/favicon.ico"
      });
      setSettingsFeedback("Test notification delivered via browser notification engine!");
    } else {
      // Fallback in-app banner preview
      setReminderToast(t.reminderPromptWeekend);
      setSettingsFeedback("Browser banner notification triggered successfully!");
    }
    setTimeout(() => {
      setSettingsFeedback(null);
    }, 4000);
  };

  // Dismiss weekend reminder
  const handleDismissReminder = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem("reminder_dismissed_date", todayStr);
    setReminderToast(null);
  };

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

  // Handle OCR extract from real camera / uploaded photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrMode(true);
    setUserConfirmedOcr(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/ocr/extract", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setOcrCandidate(data.candidate_reading);
        setReadingInput(data.candidate_reading.toString());
      } else {
        // Fallback simulated candidate if backend OCR model is offline
        const fallback = 1548.5;
        setOcrCandidate(fallback);
        setReadingInput(fallback.toString());
      }
    } catch (err) {
      const fallback = 1548.5;
      setOcrCandidate(fallback);
      setReadingInput(fallback.toString());
    }
  };

  const handleScanMeter = () => {
    setIsOcrMode(true);
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
        setAddSuccessMessage(t.readingSavedSuccess);
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
      <div className="w-full max-w-5xl mac-window rounded-2xl overflow-hidden shadow-2xl border border-white/60">

        {/* macOS Title Bar */}
        <div className="bg-[#fcfbfe]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200/80 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
              {t.utilityArbitrage}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Utility Selector */}
            <div className="bg-gray-200/70 p-0.5 rounded-lg flex text-xs font-medium">
              <button
                onClick={() => setUtility("electricity")}
                className={`px-3 py-1 rounded-md flex items-center space-x-1 transition-all ${
                  utility === "electricity" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.electricity}</span>
              </button>
              <button
                onClick={() => setUtility("water")}
                className={`px-3 py-1 rounded-md flex items-center space-x-1 transition-all ${
                  utility === "water" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.water}</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.addReading}</span>
            </button>
          </div>
        </div>

        {/* User / Household Profile Header */}
        <div className="p-6 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5865F2] to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              LK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-gray-900">{t.household}: {householdId}</h1>
                <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                  {currentUser?.district || "Colombo"} ({currentUser?.provider || "CEB"})
                </span>
                <span className="text-[11px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  {language === "si" ? "සිංහල" : language === "ta" ? "தமிழ்" : "English"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Pseudonymous Telemetry ID • Weather Location: 6.92°N, 79.86°E
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
                {currentUser.name}
              </span>
            )}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 shadow-sm transition"
            >
              {t.backToHome}
            </Link>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 flex items-center space-x-1.5 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
              <span>{t.refresh}</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === "settings" ? "dashboard" : "settings")}
              className={`p-1.5 rounded-lg border border-gray-200 ${
                activeTab === "settings" ? "bg-indigo-50 border-indigo-300 text-[#5865F2]" : "bg-white hover:bg-gray-50 text-gray-600"
              } shadow-sm transition`}
              title="Preferences & Localization"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLogout(false)}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition"
              title={t.logoutBtn}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logoutBtn}</span>
            </button>
          </div>
        </div>

        {/* Weekend Reading Reminder Banner */}
        {reminderToast && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border-b border-indigo-100 px-6 py-3 flex items-center justify-between text-xs text-indigo-950 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#5865F2] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              </div>
              <div>
                <span className="font-extrabold text-indigo-900 block">{t.reminderNoticeActive}</span>
                <span className="text-gray-700">{reminderToast}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold rounded-lg text-xs shadow-sm transition"
              >
                {t.addReading}
              </button>
              <button
                onClick={handleDismissReminder}
                className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1"
              >
                {t.dismissNotice}
              </button>
            </div>
          </div>
        )}

        {/* Unverified Tariff Limitation Banner */}
        {projection?.tariff_meta && !projection.tariff_meta.verified && (
          <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{t.limitationNotice}</span>
            </div>
            <a
              href="https://www.pucsl.gov.lk/electricity/tariff/domestic/"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold flex items-center space-x-1 text-amber-800 hover:text-amber-950 ml-2"
            >
              <span>{t.pucslSchedule}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 pt-4 pb-2 bg-white flex space-x-2 border-b border-gray-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-2 px-3 border-b-2 transition ${
              activeTab === "dashboard"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.tabForecaster}
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`pb-2 px-3 border-b-2 transition ${
              activeTab === "trends"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.tabTrends}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-2 px-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "settings"
                ? "border-[#5865F2] text-[#5865F2]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>{t.tabPreferences}</span>
            {weeklyReminder && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
        </div>

        {/* Main Body Content */}
        <div className="p-6 bg-[#faf9fc]/70 space-y-6">

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* Anti-Slab Alert Card */}
              {alerts && alerts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {t.antiSlabAlertTitle}: {alerts[0].target_slab} Units Boundary
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          {t.potentialSaving}: Rs. {alerts[0].potential_saving_lkr.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-2 leading-relaxed">
                        {alerts[0].message}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          {t.remainingDays}: <strong>{alerts[0].remaining_days} {t.days}</strong>
                        </span>
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          {t.dailyCutNeeded}: <strong>{alerts[0].required_daily_reduction_units} units/day</strong>
                        </span>
                        <span className="bg-white/80 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                          {t.crossingConfidence}: <strong>{(alerts[0].crossing_probability * 100).toFixed(0)}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Month-End Units Prediction Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>{t.projectedMonthEndUnits}</span>
                    <Zap className="w-4 h-4 text-[#5865F2]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {Math.round(projection?.projection.units_low ?? 58)} to {Math.round(projection?.projection.units_high ?? 71)}
                    </span>
                    <span className="text-xs font-medium text-gray-500">{t.unitsKwh}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                    <span>
                      <span className="font-semibold text-gray-700">Likely Median:</span>{" "}
                      <strong>{projection?.projection.units_likely ?? "64.0"} kWh</strong>
                    </span>
                    <span className="text-[11px] text-[#5865F2] font-semibold">80% Interval</span>
                  </div>
                </div>

                {/* 2. Projected Month-End Bill Card (Deterministic Tariff Engine) */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>{t.projectedBill}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Rs. {Math.round(projection?.projection.bill_low_lkr ?? 1580).toLocaleString()} – Rs. {Math.round(projection?.projection.bill_high_lkr ?? 3450).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80 flex items-center justify-between">
                    <span>
                      <span className="font-semibold text-emerald-950">Likely Bill:</span>{" "}
                      <strong>Rs. {projection?.projection.bill_likely_lkr.toLocaleString() ?? "3,180"}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">Deterministic Rule Matrix</span>
                  </div>
                </div>

                {/* 3. Cycle Progress & Run-rate */}
                <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                    <span>{t.cycleElapsed}</span>
                    <Calendar className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {projection?.days_elapsed ?? 14}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      / 30 {t.days} ({projection?.remaining_days ?? 16} {t.daysLeft})
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">{t.recordedToDate}:</span>{" "}
                    {projection?.units_so_far ?? 41.5} units
                  </div>
                </div>
              </div>

              {/* Progress to Next Slab Boundary */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-gray-700">
                    {t.tariffSlabLevel}: {projection?.slab_status.current_slab ?? 60} Units
                  </span>
                  <span className="font-semibold text-gray-500">
                    {t.approachingThreshold}: {projection?.slab_status.next_slab ?? 90} Units
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (projection?.slab_status.progress_percent ?? 50) > 75
                        ? "bg-amber-500"
                        : "bg-[#5865F2]"
                    }`}
                    style={{ width: `${projection?.slab_status.progress_percent ?? 50}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                  <span>0 Units</span>
                  <span className="font-medium text-amber-700">
                    {projection?.slab_status.progress_percent ?? 50}% {t.ofCurrentBlockConsumed}
                  </span>
                  <span>180+ Units</span>
                </div>
              </div>

              {/* Disaggregation Card: Baseline vs Weather Driven */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {t.consumptionDisaggregation}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 block">{t.baselineHouseholdLoad}</span>
                    <span className="text-xl font-bold text-gray-900 mt-1 block">
                      {projection?.disaggregation.baseline_units ?? 60.0} units
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      {t.baselineDescription}
                    </span>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200">
                    <span className="text-amber-800 font-medium block">{t.weatherDrivenLoad}</span>
                    <span className="text-xl font-bold text-amber-900 mt-1 block">
                      +{projection?.disaggregation.weather_driven_units ?? 4.0} units
                    </span>
                    <span className="text-[11px] text-amber-800 mt-1 block font-medium">
                      "A hot week ahead is adding about {projection?.disaggregation.weather_driven_units ?? 4.0} units (cooling & fans)."
                    </span>
                    <span className="text-[10px] text-amber-600/80 block mt-0.5">
                      Disaggregated via Open-Meteo CDD (No appliance-level sensors needed).
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
                  <h3 className="text-sm font-bold text-gray-900">{t.historicalTrends}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.historicalSubtitle}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 text-indigo-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                    <span>{t.unitsLabel}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-amber-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>{t.tempLabel}</span>
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{t.appPreferences}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize reminders, localization, and automated notification triggers
                  </p>
                </div>
                {settingsFeedback && (
                  <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{settingsFeedback}</span>
                  </div>
                )}
              </div>

              {/* SETTING 1: WEEKLY REMINDER NOTIFICATIONS */}
              <div className="p-5 rounded-2xl bg-[#faf9fc] border border-gray-200/80 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-[#5865F2] flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{t.weeklyReminderTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-600 max-w-lg mt-1">
                      {t.weeklyReminderDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={weeklyReminder}
                    onClick={handleToggleWeeklyReminder}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      weeklyReminder ? "bg-[#5865F2]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                        weeklyReminder ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className={`w-2 h-2 rounded-full ${weeklyReminder ? "bg-emerald-500" : "bg-gray-400"}`} />
                    <span>{weeklyReminder ? t.weeklyReminderStatusOn : t.weeklyReminderStatusOff}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsWeekendSimulated(!isWeekendSimulated)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        isWeekendSimulated
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                      title="Simulate weekend condition to test banner reminder"
                    >
                      {isWeekendSimulated ? "Weekend Simulation Active" : "Simulate Weekend"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendTestNotification}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition"
                    >
                      {t.testNotificationBtn}
                    </button>
                  </div>
                </div>
              </div>

              {/* SETTING 2: LANGUAGE SELECTION (ENGLISH, SINHALA, TAMIL) */}
              <div className="p-5 rounded-2xl bg-[#faf9fc] border border-gray-200/80 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Languages className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{t.languageTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      {t.languageDesc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { code: "en", label: "English", sublabel: "Default Language" },
                    { code: "si", label: "සිංහල", sublabel: "Sinhala Localization" },
                    { code: "ta", label: "தமிழ்", sublabel: "Tamil Localization" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageChange(item.code as Language)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        language === item.code
                          ? "bg-[#5865F2] text-white border-[#5865F2] shadow-md transform -translate-y-0.5"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{item.label}</span>
                        {language === item.code && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`text-[11px] block mt-1 ${language === item.code ? "text-indigo-100" : "text-gray-400"}`}>
                        {item.sublabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SETTING 3: ACCOUNT SESSION & SWITCH HOUSEHOLD */}
              <div className="p-5 rounded-2xl bg-[#faf9fc] border border-gray-200/80 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">Account Session & Switching</h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      Logged in as <strong>{currentUser ? currentUser.name : "Household Profile"}</strong> ({currentUser ? currentUser.email : householdId}).
                      Log out to sign in with another residence or register a new household profile.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleLogout(false)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm flex items-center space-x-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logoutBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogout(true)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold shadow-sm flex items-center space-x-2 transition"
                  >
                    <UserPlus className="w-4 h-4 text-[#5865F2]" />
                    <span>{t.switchAccount}</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Note */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span>All preferences persist across page reloads in your local browser profile.</span>
                <span className="font-bold text-indigo-700 uppercase tracking-wider text-[11px]">Auto-Synced</span>
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
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {t.recordMeterReading}
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
                    <span className="text-xs text-gray-500 font-medium">{t.inputMethod}</span>
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer text-xs font-semibold text-[#5865F2] hover:text-[#4752c4] flex items-center space-x-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Photograph Meter</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleScanMeter}
                        className="text-xs text-gray-500 hover:text-gray-800 underline"
                      >
                        Demo OCR
                      </button>
                    </div>
                  </div>

                  {/* OCR Confirmation Notification Step */}
                  {isOcrMode && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-2">
                      <p className="font-semibold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span>{t.ocrCandidateExtracted}: {ocrCandidate}</span>
                      </p>
                      <p className="text-gray-600 text-[11px]">
                        {t.ocrDialInspectPrompt}
                      </p>
                      <label className="flex items-center space-x-2 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userConfirmedOcr}
                          onChange={(e) => setUserConfirmedOcr(e.target.checked)}
                          className="rounded text-[#5865F2]"
                        />
                        <span className="text-xs font-bold text-indigo-950">
                          {t.ocrConfirmCheckbox}
                        </span>
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t.cumulativeDialReading} ({utility === "electricity" ? "kWh" : "m³"})
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
                      {t.readingDateLabel}
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
                      {t.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold shadow-md transition"
                    >
                      {t.confirmSaveBtn}
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
