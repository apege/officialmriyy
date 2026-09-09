"use client";

import React, { useState } from "react";
import {
  Store,
  Flame,
  QrCode,
  ChevronDown,
  Save,
  Check,
  Unlock,
  Lock,
  MessageCircle,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface SettingsTabProps {
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
}

export default function SettingsTab({
  isStoreOpen,
  setIsStoreOpen,
}: SettingsTabProps) {
  // Accordion Expand States
  const [openSection1, setOpenSection1] = useState(true);
  const [openSection2, setOpenSection2] = useState(true);
  const [openSection3, setOpenSection3] = useState(true);

  // Form States
  const [storeName, setStoreName] = useState("official.mriyy");
  const [whatsappCS, setWhatsappCS] = useState("6285624695885");

  const [promoActive, setPromoActive] = useState(true);
  const [selectedPromoPkg, setSelectedPromoPkg] = useState("2.200 Robux (Rp 45.000)");
  const [promoHeadline, setPromoHeadline] = useState("⚡ PROMO FLASH SALE ROBUX HARI INI!");
  const [promoDescription, setPromoDescription] = useState(
    "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali. Proses 5-10 menit hanya butuh username Roblox!"
  );

  const [qrisStatus, setQrisStatus] = useState("QRIS Terpasang");
  const [logoStatus, setLogoStatus] = useState("Logo Terpasang");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleAll = () => {
    const allOpen = openSection1 && openSection2 && openSection3;
    setOpenSection1(!allOpen);
    setOpenSection2(!allOpen);
    setOpenSection3(!allOpen);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* 1. Header Bar (Matching Screenshot 10) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-700 font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer shrink-0"
        >
          {openSection1 && openSection2 && openSection3 ? (
            <>
              <Lock className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>Tutup Semua Section</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>Buka Semua Section</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-4">
        {/* 2. SECTION 1: IDENTITAS TOKO & KONTAK (Matching Screenshot 10) */}
        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xs transition-all">
          <div
            onClick={() => setOpenSection1(!openSection1)}
            className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-pink-50/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shrink-0">
                <Store className="w-4 h-4 text-[#ff2a85]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  IDENTITAS TOKO & KONTAK
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                {storeName} - WA: {whatsappCS}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection1 ? "rotate-180 text-[#ff2a85]" : ""
                }`}
              />
            </div>
          </div>

          {openSection1 && (
            <div className="p-5 pt-0 border-t border-pink-50 space-y-4 animate-in slide-in-from-top-2 duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Toko (Storefront)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nomor WhatsApp CS (Format Internasional: 628xxx)
                  </label>
                  <input
                    type="text"
                    value={whatsappCS}
                    onChange={(e) => setWhatsappCS(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. SECTION 2: PENGATURAN PROMO BANNER WEB PELANGGAN (Matching Screenshot 10) */}
        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xs transition-all">
          <div
            onClick={() => setOpenSection2(!openSection2)}
            className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-pink-50/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shrink-0">
                <Flame className="w-4 h-4 text-[#ff2a85]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  PENGATURAN PROMO BANNER WEB PELANGGAN
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Atur paket promo yang muncul pada banner hero bagian atas website toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                Promo Aktif - 2.200 Robux Rp 45.000
              </span>

              {/* Pink Toggle Switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setPromoActive(!promoActive);
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  promoActive ? "bg-[#ff2a85]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    promoActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection2 ? "rotate-180 text-[#ff2a85]" : ""
                }`}
              />
            </div>
          </div>

          {openSection2 && (
            <div className="p-5 pt-0 border-t border-pink-50 space-y-4 animate-in slide-in-from-top-2 duration-150">
              <div className="space-y-3 pt-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paket Promo Highlight
                  </label>
                  <select
                    value={selectedPromoPkg}
                    onChange={(e) => setSelectedPromoPkg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="2.200 Robux (Rp 45.000)">2.200 Robux (Rp 45.000) - PROMO BEST SELLER</option>
                    <option value="5.500 Robux (Rp 100.000)">5.500 Robux (Rp 100.000) - PROMO SULTAN</option>
                    <option value="1.800 Robux (Rp 35.000)">1.800 Robux (Rp 35.000) - POPULER</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Headline Banner
                  </label>
                  <input
                    type="text"
                    value={promoHeadline}
                    onChange={(e) => setPromoHeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Deskripsi Promo
                  </label>
                  <textarea
                    rows={2}
                    value={promoDescription}
                    onChange={(e) => setPromoDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-medium text-slate-900 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. SECTION 3: BARCODE QRIS & LOGO TOKO (Matching Screenshot 10) */}
        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xs transition-all">
          <div
            onClick={() => setOpenSection3(!openSection3)}
            className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-pink-50/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <QrCode className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  BARCODE QRIS & LOGO TOKO
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Barcode pembayaran QRIS otomatis dan logo storefront toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                {qrisStatus} • {logoStatus}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSection3 ? "rotate-180 text-[#ff2a85]" : ""
                }`}
              />
            </div>
          </div>

          {openSection3 && (
            <div className="p-5 pt-0 border-t border-pink-50 space-y-4 animate-in slide-in-from-top-2 duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Status Barcode QRIS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-extrabold border border-emerald-200">
                      ✓ Terpasang
                    </span>
                    <span className="text-xs text-slate-500 font-medium">NMID: ID1029384756102</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Status Logo Storefront
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-extrabold border border-emerald-200">
                      ✓ Terpasang
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/public/logo.png</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. MAIN BOTTOM SAVE BUTTON (Matching Screenshot 10) */}
        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-black text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(255,42,133,0.35)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pengaturan Berhasil Disimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Semua Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
