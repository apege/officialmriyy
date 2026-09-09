"use client";

import React from "react";
import { X, MessageCircle, Send, ShieldCheck, Clock } from "lucide-react";

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerServiceModal({
  isOpen,
  onClose,
}: CustomerServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-pink-200 shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5 sm:mb-3 shadow-md shadow-emerald-500/20">
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-emerald-100" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Pusat Bantuan official.mriyy
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Tim customer support kami online 24 jam siap membantu segala kendala transaksi kamu.
          </p>
        </div>

        {/* Channels */}
        <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20official.mriyy,%20saya%20butuh%20bantuan%20terkait%20top%20up%20Robux"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                  WhatsApp Support
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Respon Cepat 1-3 Menit</span>
                </div>
              </div>
            </div>
            <Send className="w-4 h-4 text-emerald-600 transform group-hover:translate-x-1 transition-transform shrink-0" />
          </a>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#ff2a85] shrink-0" />
              <span>Jaminan Keamanan 100%</span>
            </div>
            <p className="text-[10px] sm:text-[11px] leading-relaxed">
              Admin official.mriyy tidak pernah meminta kata sandi / password akun Roblox Anda. Jaga kerahasiaan password Anda.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
