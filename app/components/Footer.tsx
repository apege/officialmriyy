"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-pink-100 pt-6 sm:pt-8 pb-24 sm:pb-20 mt-4 sm:mt-6">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 pb-6 border-b border-pink-100">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/logo.png"
                  alt="official.mriyy logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                official<span className="text-[#ff2a85]">.mriyy</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
              Platform top up Robux terpercaya nomor #1 dengan proses kilat 5 - 10 menit, harga termurah, dan jaminan 100% legal serta bergaransi uang kembali.
            </p>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Aman & Bergaransi Resmi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-500">
              <li>
                <a href="#order-section" className="hover:text-[#ff2a85] transition-colors">
                  Pricelist Robux
                </a>
              </li>
              <li>
                <a href="#alur-transaksi" className="hover:text-[#ff2a85] transition-colors">
                  Cara & Alur Transaksi
                </a>
              </li>
              <li>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff2a85] transition-colors">
                  Hubungi Layanan CS
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Payments */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Metode Pembayaran
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Mendukung seluruh saluran pembayaran resmi Indonesia via QRIS & E-Wallet:
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5">
              {[
                "QRIS",
                "BCA",
                "Mandiri",
                "BRI",
                "BNI",
                "DANA",
                "GoPay",
                "OVO",
                "ShopeePay",
                "LinkAja",
              ].map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-pink-50/60 border border-pink-100 rounded-md text-[9px] sm:text-[10px] font-bold text-slate-600"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[10px] sm:text-[11px] font-medium text-slate-400">
          <p>© {currentYear} official.mriyy. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 fill-[#ff2a85] text-[#ff2a85]" /> untuk komunitas Roblox
          </p>
        </div>
      </div>
    </footer>
  );
}
