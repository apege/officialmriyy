"use client";

import React from "react";
import { Zap, ShieldCheck, UserCheck, Headset, Award } from "lucide-react";

export default function FeatureBar() {
  const features = [
    {
      icon: Zap,
      title: "Proses Cepat",
      subtitle: "5 - 10 Menit Beres",
      bgColor: "bg-pink-50",
      iconColor: "text-[#ff2a85]",
    },
    {
      icon: ShieldCheck,
      title: "Pembayaran Aman",
      subtitle: "Legal & Terpercaya",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      icon: UserCheck,
      title: "Hanya Username",
      subtitle: "Tanpa Password Akun",
      bgColor: "bg-pink-50",
      iconColor: "text-[#ff2a85]",
    },
    {
      icon: Headset,
      title: "Fast Respon 24/7",
      subtitle: "Admin Ramah & Sigap",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      icon: Award,
      title: "Garansi 100%",
      subtitle: "Uang Kembali Jika Gagal",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <section className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
      <div className="rounded-2xl bg-white border border-pink-100 p-2.5 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-pink-50/40 transition-colors"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl ${item.bgColor} flex items-center justify-center border border-pink-100`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.iconColor}`} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate leading-tight mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
