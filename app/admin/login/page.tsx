"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import PetalBackground from "@/app/components/PetalBackground";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      // Demo authentication logic
      if (
        (username.trim().toLowerCase() === "admin" || username.trim().toLowerCase() === "mriyy") &&
        (password === "admin123" || password === "123456" || password.length >= 4)
      ) {
        // Save auth flag in localStorage/cookie if needed
        if (typeof window !== "undefined") {
          localStorage.setItem("officialmriyy_admin_auth", "true");
        }
        router.push("/admin");
      } else {
        setIsLoading(false);
        setErrorMsg("Username atau Password salah! (Default: admin / admin123)");
      }
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden selection:bg-[#ff2a85] selection:text-white">
      {/* Floating Sakura Petals Background */}
      <PetalBackground />

      {/* Top Bar Navigation Header */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-[#ff2a85] font-bold text-xs shadow-xs border border-pink-100 backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ff2a85]" />
          <span>Ke Storefront</span>
        </Link>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 text-pink-700 font-extrabold text-xs shadow-xs border border-pink-100 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#ff2a85]" />
          <span>Admin Portal</span>
        </div>
      </header>

      {/* Center Login Box */}
      <main className="relative z-10 w-full max-w-md my-auto py-8">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-pink-100 shadow-[0_10px_35px_-5px_rgba(255,42,133,0.12)] space-y-6 animate-in zoom-in-95 duration-200 text-center">
          {/* Logo & Icon Badge */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-100 via-pink-50 to-white p-3 border border-pink-200 shadow-md flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/logo.png"
                alt="official.mriyy Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ff2a85] text-white flex items-center justify-center shadow-xs border-2 border-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              official<span className="text-[#ff2a85]">.mriyy</span>{" "}
              <span className="text-[#ff2a85]">Admin</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Silakan login untuk mengelola sistem & pesanan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                USERNAME ADMIN
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-pink-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-pink-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-[#ff2a85] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-black text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(255,42,133,0.4)] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Memproses Login..." : "Masuk ke Panel Admin"}</span>
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-2 border-t border-pink-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-pink-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akses Khusus Administrator official.mriyy</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] font-medium text-slate-400 pb-2">
        © {new Date().getFullYear()} official.mriyy Admin Portal • All Rights Reserved
      </footer>
    </div>
  );
}
