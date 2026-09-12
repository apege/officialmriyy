"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Zap, ArrowRight, Clock } from "lucide-react";

interface HeroSectionProps {
  onSelectPromo: () => void;
  onOpenTestimonial: () => void;
  promoActive?: boolean;
  promoTitle?: string;
  promoSubtitle?: string;
  bannerImageUrl?: string;
  promoRobuxAmount?: number;
  promoDiscountPrice?: number;
  promoOriginalLabel?: string;
  promoEndDate?: string;
  logoImageUrl?: string;
}

export default function HeroSection({
  onSelectPromo,
  onOpenTestimonial,
  promoActive = true,
  promoTitle = "⚡ PROMO FLASH SALE ROBUX HARI INI!",
  promoSubtitle = "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
  bannerImageUrl,
  promoRobuxAmount = 2200,
  promoDiscountPrice = 45000,
  promoOriginalLabel = "2.000 Robux",
  promoEndDate,
  logoImageUrl = "/logo.png",
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = promoEndDate
        ? new Date(promoEndDate).getTime()
        : Date.now() + 1000 * 60 * 60 * 24 * 3; // fallback 3 days

      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [promoEndDate]);

  const format2Digits = (num: number) => String(num).padStart(2, "0");
  const formatRobux = (num: number) => new Intl.NumberFormat("id-ID").format(num);
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  if (!promoActive) return null;

  return (
    <section className="relative z-10 max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-2 sm:pb-3">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-pink-100 p-4 sm:p-8 lg:p-10 shadow-[0_10px_35px_-10px_rgba(255,42,133,0.07)]">
        {/* Soft subtle glow or custom banner background */}
        {bannerImageUrl ? (
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img src={bannerImageUrl} alt="Banner Promo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-3.5 sm:space-y-4 max-w-2xl">
            {/* Promo Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-pink-300 bg-pink-50/50 text-pink-600 font-bold text-[9px] sm:text-[10px] tracking-wide uppercase">
                PROMO SPESIAL BULAN INI
              </span>
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#ff2a85] text-white font-extrabold text-[9px] sm:text-[10px] tracking-wide uppercase shadow-xs">
                LIMITED STOCK
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {promoTitle}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                {promoSubtitle}
              </p>
            </div>

            {/* Price Box */}
            <div className="pt-0.5">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-3xl font-black text-slate-900">
                  {formatRobux(promoRobuxAmount)}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-wider">
                  ROBUX
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {promoOriginalLabel && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                    {promoOriginalLabel}
                  </span>
                )}
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#ff2a85] tracking-tight">
                  {formatRupiah(promoDiscountPrice)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onSelectPromo}
                className="flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-bold text-xs sm:text-sm shadow-[0_6px_20px_-4px_rgba(255,42,133,0.45)] transition-all cursor-pointer active:scale-95 w-full sm:w-auto"
              >
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 shrink-0" />
                <span>Beli Robux Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={onOpenTestimonial}
                className="flex items-center justify-center gap-1.5 px-4 py-3 sm:py-2.5 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs w-full sm:w-auto"
              >
                <span>Lihat Testimoni</span>
              </button>
            </div>
          </div>

          {/* Right Column: Countdown Card */}
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="rounded-2xl bg-white border border-pink-100/90 p-3.5 sm:p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-[11px] font-bold tracking-wider text-[#ff2a85] uppercase mb-3 sm:mb-4">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>PROMO BERAKHIR DALAM</span>
              </div>

              {/* 4 Countdown Boxes */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl bg-pink-50/60 border border-pink-100">
                  <span className="text-base sm:text-xl font-black text-[#ff2a85]">
                    {format2Digits(timeLeft.days)}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">
                    HARI
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl bg-pink-50/60 border border-pink-100">
                  <span className="text-base sm:text-xl font-black text-[#ff2a85]">
                    {format2Digits(timeLeft.hours)}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">
                    JAM
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl bg-pink-50/60 border border-pink-100">
                  <span className="text-base sm:text-xl font-black text-[#ff2a85]">
                    {format2Digits(timeLeft.minutes)}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">
                    MENIT
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl bg-pink-50/60 border border-pink-100">
                  <span className="text-base sm:text-xl font-black text-[#ff2a85]">
                    {format2Digits(timeLeft.seconds)}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">
                    DETIK
                  </span>
                </div>
              </div>

              {/* Guarantee Mini Card inside */}
              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-pink-50/50 border border-pink-100">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg overflow-hidden border border-pink-200">
                  <Image
                    src={logoImageUrl || "/logo.png"}
                    alt="Garansi"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 flex items-center gap-1">
                    <span>Garansi Proses Kilat</span>
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                    Langsung otomatis ke akun kamu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
