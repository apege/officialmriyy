"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Heart, Clock, Sparkles } from "lucide-react";

interface FooterProps {
  storeName?: string;
  whatsappNumber?: string;
  logoUrl?: string;
}

export default function Footer({
  storeName = "official.mriyy",
  whatsappNumber = "6285624695885",
  logoUrl = "/logo.png",
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const cleanWA = whatsappNumber.replace(/\D/g, "");

  const nameParts = storeName.split(".");
  const prefix = nameParts[0] || "official";
  const suffix = nameParts.length > 1 ? `.${nameParts.slice(1).join(".")}` : "";

  return (
    <footer className="w-full bg-white border-t border-pink-100 pt-8 pb-24 sm:pb-20 mt-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-8 border-b border-pink-100">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9">
                <Image
                  src={logoUrl || "/logo.png"}
                  alt={`${storeName} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                {prefix}
                {suffix && <span className="text-[#ff2a85]">{suffix}</span>}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
              Platform top up Robux terpercaya nomor #1 dengan proses kilat 5 - 10 menit, harga termurah, dan jaminan 100% legal serta bergaransi uang kembali.
            </p>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Aman & Bergaransi Resmi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li>
                <a href="#order-section" className="hover:text-[#ff2a85] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]"></span>
                  <span>Pricelist Robux</span>
                </a>
              </li>
              <li>
                <a href="#alur-transaksi" className="hover:text-[#ff2a85] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]"></span>
                  <span>Cara & Alur Transaksi</span>
                </a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-[#ff2a85] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]"></span>
                  <span>Testimoni Pelanggan</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${cleanWA}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff2a85] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]"></span>
                  <span>Hubungi Layanan CS</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Service & Operational Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Layanan Pelanggan
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 bg-pink-50/50 p-2.5 rounded-xl border border-pink-100">
                <Clock className="w-4 h-4 text-[#ff2a85] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Jam Operasional</p>
                  <p className="text-[10px] text-slate-500 font-medium">Setiap Hari (08.00 - 23.00 WIB)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-pink-50/50 p-2.5 rounded-xl border border-pink-100">
                <Sparkles className="w-4 h-4 text-[#ff2a85] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Proses Kilat Otomatis</p>
                  <p className="text-[10px] text-slate-500 font-medium">Estimasi 5 - 10 menit setelah bayar</p>
                </div>
              </div>
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
