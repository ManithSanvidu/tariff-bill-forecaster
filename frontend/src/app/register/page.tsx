"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, User, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [provider, setProvider] = useState("CEB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          district,
          electricity_provider: provider,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed.");
      }

      const data = await res.json();
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_info", JSON.stringify(data.user));
      localStorage.setItem("household_id", data.household_id);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans hero-scenic-backdrop">
      <div className="w-full max-w-md apple-dock-card overflow-hidden shadow-2xl p-8 sm:p-9 relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-black tracking-tight">Register Household</h1>
          <p className="text-xs text-gray-500 mt-1.5">
            Monitor tiered tariffs, avoid slab cliffs, and predict bills
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-medium">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Your Name / Residence Nickname</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Priyantha Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white/80"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="priyantha@example.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white/80"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white/80"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-gray-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kurunegala">Kurunegala</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="CEB">CEB (Ceylon Electricity Board)</option>
                <option value="LECO">LECO (Lanka Electricity Co.)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-btn-black py-3 text-xs flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Household Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-black/[0.06] text-center text-xs text-gray-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-black hover:underline">
            Sign In Here
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
