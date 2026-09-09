"use client";

import React from "react";
import { User, QrCode, Zap, ShieldCheck } from "lucide-react";

export default function AlurTransaksi() {
  const steps = [
    {
      step: "LANGKAH 1",
      title: "Masukkan Username",
      desc: "Cukup ketik username Roblox kamu tanpa perlu password. Privasi dan keamanan akun terjamin 100%.",
      icon: User,
    },
    {
      step: "LANGKAH 2",
      title: "Pembayaran Cepat",
      desc: "Scan QRIS pakai BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay atau pesan langsung via WhatsApp.",
      icon: QrCode,
    },
    {
      step: "LANGKAH 3",
      title: "Robux Mendarat!",
      desc: "Sistem kilat kami langsung memproses pesanan ke akun kamu dalam 5-10 menit dengan garansi uang kembali.",
      icon: Zap,
    },
  ];

  return (
    <section
      id="alur-transaksi"
      className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 scroll-mt-20"
    >
      <div className="rounded-3xl bg-white border border-pink-100 p-6 sm:p-8 shadow-xs">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-7">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-[#ff2a85] font-extrabold text-[10px] tracking-wider uppercase mb-2 border border-pink-200">
            PANDUAN & CARA ORDER
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cara Order di official.mriyy
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Hanya butuh 3 langkah singkat, Robux langsung mendarat ke akun kamu
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-pink-50/20 border border-pink-100 p-5 text-center flex flex-col items-center hover:bg-pink-50/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 text-[#ff2a85] flex items-center justify-center mb-3.5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-extrabold text-[#ff2a85] tracking-widest uppercase mb-1">
                  {item.step}
                </span>

                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Custom official.mriyy Trust Banner */}
        <div className="rounded-2xl bg-white border border-pink-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                100% Legal, Aman & Bergaransi Uang Kembali
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Proses cepat tanpa password akun dengan perlindungan transaksi penuh.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-[11px] font-black text-[#ff2a85] tracking-wider uppercase text-center">
            TOP UP CEPAT, AMAN & TERPERCAYA #1
          </div>
        </div>
      </div>
    </section>
  );
}
