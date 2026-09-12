"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Flame, HelpCircle, CheckCircle2 } from "lucide-react";

interface NavbarProps {
  onOpenCS: () => void;
  onOpenCart: () => void;
  cartCount?: number;
  storeName?: string;
  logoUrl?: string;
}

export default function Navbar({
  onOpenCS,
  onOpenCart,
  cartCount = 1,
  storeName = "official.mriyy",
  logoUrl = "/logo.png",
}: NavbarProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nameParts = storeName.split(".");
  const prefix = nameParts[0] || "official";
  const suffix = nameParts.length > 1 ? `.${nameParts.slice(1).join(".")}` : "";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 border-b border-pink-100 shadow-[0_2px_15px_-4px_rgba(255,42,133,0.08)]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105">
            <Image
              src={logoUrl || "/logo.png"}
              alt={`${storeName} logo`}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 leading-none">
                {prefix}
                {suffix && <span className="text-[#ff2a85]">{suffix}</span>}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
              Top Up Robux Resmi & Legal
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-slate-600">
          <button
            onClick={() => scrollToSection("order-section")}
            className="flex items-center gap-1.5 hover:text-[#ff2a85] transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Pricelist Robux</span>
          </button>

          <button
            onClick={() => scrollToSection("alur-transaksi")}
            className="flex items-center gap-1.5 hover:text-[#ff2a85] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Cara Order</span>
          </button>

          <button
            onClick={() => scrollToSection("testimoni")}
            className="flex items-center gap-1.5 hover:text-[#ff2a85] transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Testimoni</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Hubungi CS Button */}
          <button
            onClick={onOpenCS}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full border border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 transition-all font-bold text-xs sm:text-sm cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            <span>Hubungi CS</span>
          </button>

          {/* Cart / Keranjang Button matching reference screenshot exactly */}
          <button
            onClick={onOpenCart}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-50/70 border border-pink-200/90 hover:bg-pink-100/80 text-[#ff2a85] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Keranjang Belanja"
          >
            {/* Custom styled bag icon matching the pink rounded outline icon */}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff2a85"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8 L9 3 L15 3 L18 8 Z" fill="none" />
              <rect x="5" y="8" width="14" height="13" rx="2" />
              <path d="M10 12 C10 13.5 11 14.5 12 14.5 C13 14.5 14 13.5 14 12" />
            </svg>

            {/* Notification Badge with '1' */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#ff2a85] text-[10px] sm:text-[11px] font-black text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
