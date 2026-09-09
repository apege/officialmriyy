"use client";

import React from "react";
import { Zap } from "lucide-react";

interface StickyBottomBarProps {
  totalAmount: number;
  totalRobux: number;
  totalItemsCount: number;
  onPayClick: () => void;
}

export default function StickyBottomBar({
  totalAmount,
  totalRobux,
  totalItemsCount,
  onPayClick,
}: StickyBottomBarProps) {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatRobux = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200/80 shadow-[0_-4px_25px_rgba(255,42,133,0.1)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Summary info with item count badge */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-semibold text-slate-400 leading-tight mb-0.5">
              Total Pesanan
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {formatRobux(totalRobux)}{" "}
              <span className="text-xs font-bold text-slate-500">Robux</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-2xl sm:text-3xl font-black text-[#ff2a85] tracking-tight leading-none">
              {formatRupiah(totalAmount)}
            </div>

            {/* Item Count Badge matching BloxyLucy reference */}
            <span className="px-2.5 py-1 rounded-full bg-pink-50/80 border border-pink-200 text-[11px] font-extrabold text-slate-700 shadow-2xs">
              {totalItemsCount} Item{totalItemsCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Right Side: Pay Button */}
        <div>
          <button
            onClick={onPayClick}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/30 transition-all transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span>Bayar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
