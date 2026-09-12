"use client";

import React, { useState } from "react";
import {
  Store,
  Flame,
  QrCode,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Unlock,
  Lock,
  MessageCircle,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { compressImage } from "@/lib/image-compression";

interface SettingsTabProps {
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
}

const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

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
  const [products, setProducts] = useState<Array<{ id: number; name: string; robux: number; price: number; is_active: boolean }>>([]);
  const [selectedPromoRobux, setSelectedPromoRobux] = useState<number>(2200);
  const [selectedPromoPrice, setSelectedPromoPrice] = useState<number>(45000);
  const [promoHeadline, setPromoHeadline] = useState("⚡ PROMO FLASH SALE ROBUX HARI INI!");
  const [promoDescription, setPromoDescription] = useState(
    "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali. Proses 5-10 menit hanya butuh username Roblox!"
  );
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [qrisImageUrl, setQrisImageUrl] = useState("/qris.png");
  const [logoImageUrl, setLogoImageUrl] = useState("/logo.png");
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Countdown Date Picker States
  const [promoEndDate, setPromoEndDate] = useState<string>("2026-10-01T06:59:00.000Z");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(9); // 0-indexed: 9 = Oktober
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedHour, setSelectedHour] = useState<number>(6);
  const [selectedMinute, setSelectedMinute] = useState<number>(59);
  const [activePreset, setActivePreset] = useState<string | null>("end_month");

  const [qrisStatus, setQrisStatus] = useState("QRIS Terpasang");
  const [logoStatus, setLogoStatus] = useState("Logo Terpasang");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // 1. Fetch Store Settings
    fetch(`/api/store-settings?_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          const s = data.settings;
          if (s.store_name) setStoreName(s.store_name);
          if (s.whatsapp_number) setWhatsappCS(s.whatsapp_number);
          if (s.promo_active !== undefined) setPromoActive(Boolean(s.promo_active));
          if (s.promo_title) setPromoHeadline(s.promo_title);
          if (s.promo_subtitle) setPromoDescription(s.promo_subtitle);
          if (s.banner_image_path) setBannerImageUrl(s.banner_image_path);
          if (s.qris_image_path) setQrisImageUrl(s.qris_image_path);
          if (s.logo_image_path) setLogoImageUrl(s.logo_image_path);
          if (s.promo_robux_amount) setSelectedPromoRobux(Number(s.promo_robux_amount));
          if (s.promo_discount_price) setSelectedPromoPrice(Number(s.promo_discount_price));
          if (s.promo_end_date) {
            setPromoEndDate(s.promo_end_date);
            const d = new Date(s.promo_end_date);
            if (!isNaN(d.getTime())) {
              setViewYear(d.getFullYear());
              setViewMonth(d.getMonth());
              setSelectedDay(d.getDate());
              setSelectedHour(d.getHours());
              setSelectedMinute(d.getMinutes());
            }
          }
        }
      })
      .catch((err) => console.error("Error fetching store settings:", err));

    // 2. Fetch Available Products from Database
    fetch(`/api/products?all=true&_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching products for promo settings:", err));
  }, []);

  const formatPromoDateDisplay = (isoOrDate: string | Date) => {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return "1 Oktober 2026 • 06:59 WIB";
    const day = d.getDate();
    const monthName = MONTH_NAMES_ID[d.getMonth()] || "Oktober";
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${monthName} ${year} • ${hours}:${minutes} WIB`;
  };

  const handlePresetDays = (days: number, presetKey: string) => {
    setActivePreset(presetKey);
    const target = new Date();
    target.setDate(target.getDate() + days);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setSelectedDay(target.getDate());
  };

  const handlePresetEndMonth = () => {
    setActivePreset("end_month");
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setViewYear(lastDay.getFullYear());
    setViewMonth(lastDay.getMonth());
    setSelectedDay(lastDay.getDate());
    setSelectedHour(23);
    setSelectedMinute(59);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const getDaysMatrix = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Min
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; monthOffset: number }> = [];

    // Previous month trailing
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        monthOffset: -1,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        monthOffset: 0,
      });
    }

    // Next month leading
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        monthOffset: 1,
      });
    }

    return days;
  };

  const handleApplyPromoTime = () => {
    const finalDate = new Date(viewYear, viewMonth, selectedDay, selectedHour, selectedMinute, 0);
    setPromoEndDate(finalDate.toISOString());
    setIsDatePickerOpen(false);
  };

  const handleToggleAll = () => {
    const allOpen = openSection1 && openSection2 && openSection3;
    setOpenSection1(!allOpen);
    setOpenSection2(!allOpen);
    setOpenSection3(!allOpen);
  };

  const handleUploadFile = async (file: File, type: "qris" | "logo" | "banner") => {
    try {
      let fileToUpload: File = file;
      try {
        fileToUpload = await compressImage(file, 1200, 0.85);
      } catch (cErr) {
        console.warn("Compression fallback to raw file:", cErr);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const url = data.url;
        if (type === "qris") setQrisImageUrl(url);
        if (type === "logo") setLogoImageUrl(url);
        if (type === "banner") setBannerImageUrl(url);
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_name: storeName,
          whatsapp_number: whatsappCS,
          promo_active: promoActive,
          promo_title: promoHeadline,
          promo_subtitle: promoDescription,
          promo_robux_amount: selectedPromoRobux,
          promo_discount_price: selectedPromoPrice,
          promo_end_date: promoEndDate,
          banner_image_path: bannerImageUrl || null,
          qris_image_path: qrisImageUrl || null,
          logo_image_path: logoImageUrl || null,
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving store settings:", err);
    } finally {
      setLoading(false);
    }
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
                Promo {promoActive ? "Aktif" : "Nonaktif"} • {new Intl.NumberFormat("id-ID").format(selectedPromoRobux)} Robux (Rp {new Intl.NumberFormat("id-ID").format(selectedPromoPrice)})
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
                    value={selectedPromoRobux}
                    onChange={(e) => {
                      const robuxVal = Number(e.target.value);
                      setSelectedPromoRobux(robuxVal);
                      const matched = products.find((p) => Number(p.robux) === robuxVal);
                      if (matched) {
                        setSelectedPromoPrice(Number(matched.price));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    {products.length === 0 ? (
                      <option value={selectedPromoRobux}>
                        {new Intl.NumberFormat("id-ID").format(selectedPromoRobux)} Robux (Rp {new Intl.NumberFormat("id-ID").format(selectedPromoPrice)})
                      </option>
                    ) : (
                      products.map((pkg) => (
                        <option key={pkg.id} value={pkg.robux}>
                          {new Intl.NumberFormat("id-ID").format(pkg.robux)} Robux (Rp {new Intl.NumberFormat("id-ID").format(pkg.price)})
                        </option>
                      ))
                    )}
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

                {/* Sub-section: Waktu Berakhir Promo (Countdown Timer) */}
                <div className="pt-2 space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    Waktu Berakhir Promo (Countdown Timer)
                  </label>

                  {/* Collapsed Summary Card Box (Matching Screenshot 1) */}
                  <div
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="p-3.5 sm:p-4 rounded-3xl bg-pink-50/30 border border-pink-200 hover:border-[#ff2a85] transition-all cursor-pointer flex items-center justify-between gap-3 select-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#ff2a85] flex items-center justify-center border border-pink-200 shrink-0 group-hover:scale-105 transition-transform">
                        <Calendar className="w-5 h-5 text-[#ff2a85]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                          {formatPromoDateDisplay(promoEndDate)}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] font-bold text-[#ff2a85] mt-0.5">
                          Klik untuk mengatur tanggal & jam hitung mundur
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDatePickerOpen(!isDatePickerOpen);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#ff2a85] text-[11px] font-black uppercase tracking-wider border border-pink-200 transition-all cursor-pointer shrink-0"
                    >
                      {isDatePickerOpen ? "TUTUP" : "ATUR"}
                    </button>
                  </div>

                  {/* Expanded Custom Date & Time Picker (Matching Screenshot 2) */}
                  {isDatePickerOpen && (
                    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
                      {/* 1. Quick Presets */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handlePresetDays(3, "3d")}
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                            activePreset === "3d"
                              ? "bg-[#ff2a85] text-white shadow-xs"
                              : "bg-pink-50 hover:bg-pink-100 text-[#ff2a85]"
                          }`}
                        >
                          +3 Hari
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePresetDays(7, "7d")}
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                            activePreset === "7d"
                              ? "bg-[#ff2a85] text-white shadow-xs"
                              : "bg-pink-50 hover:bg-pink-100 text-[#ff2a85]"
                          }`}
                        >
                          +7 Hari
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePresetDays(14, "14d")}
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                            activePreset === "14d"
                              ? "bg-[#ff2a85] text-white shadow-xs"
                              : "bg-pink-50 hover:bg-pink-100 text-[#ff2a85]"
                          }`}
                        >
                          +14 Hari
                        </button>

                        <button
                          type="button"
                          onClick={handlePresetEndMonth}
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                            activePreset === "end_month"
                              ? "bg-[#ff2a85] text-white shadow-xs"
                              : "bg-pink-50 hover:bg-pink-100 text-[#ff2a85]"
                          }`}
                        >
                          Akhir Bulan
                        </button>
                      </div>

                      {/* 2. Month & Year Navigation */}
                      <div className="flex items-center justify-between pt-1">
                        <h4 className="font-black text-sm text-slate-900 tracking-tight">
                          {MONTH_NAMES_ID[viewMonth]} {viewYear}
                        </h4>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-xl border border-pink-200 hover:bg-pink-50 text-slate-600 hover:text-[#ff2a85] transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-xl border border-pink-200 hover:bg-pink-50 text-slate-600 hover:text-[#ff2a85] transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 3. Days Grid */}
                      <div className="space-y-1">
                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 text-center">
                          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
                            <span
                              key={d}
                              className={`text-[11px] font-bold py-1 ${
                                i === 0 ? "text-rose-500 font-extrabold" : "text-slate-400"
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Days Cells */}
                        <div className="grid grid-cols-7 gap-y-1 text-center">
                          {getDaysMatrix(viewYear, viewMonth).map((item, idx) => {
                            const isSelected =
                              item.isCurrentMonth &&
                              item.day === selectedDay &&
                              new Date(promoEndDate).getMonth() === viewMonth &&
                              new Date(promoEndDate).getFullYear() === viewYear;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  if (item.isCurrentMonth) {
                                    setSelectedDay(item.day);
                                    setActivePreset(null);
                                  } else if (item.monthOffset === -1) {
                                    handlePrevMonth();
                                    setSelectedDay(item.day);
                                    setActivePreset(null);
                                  } else if (item.monthOffset === 1) {
                                    handleNextMonth();
                                    setSelectedDay(item.day);
                                    setActivePreset(null);
                                  }
                                }}
                                className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#ff2a85] text-white font-black shadow-md shadow-pink-500/30 scale-105"
                                    : item.isCurrentMonth
                                    ? "text-slate-800 hover:bg-pink-50 hover:text-[#ff2a85]"
                                    : "text-slate-300 hover:text-slate-500"
                                }`}
                              >
                                {item.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Divider & Time Controls */}
                      <div className="pt-3 border-t border-pink-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-slate-800">
                              Atur Jam & Menit Berakhir
                            </span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-lg bg-pink-100/70 text-[#ff2a85] font-black text-xs font-mono">
                            {String(selectedHour).padStart(2, "0")}:{String(selectedMinute).padStart(2, "0")} WIB
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Jam (00 - 23)
                            </label>
                            <select
                              value={selectedHour}
                              onChange={(e) => setSelectedHour(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                            >
                              {Array.from({ length: 24 }).map((_, h) => (
                                <option key={h} value={h}>
                                  {String(h).padStart(2, "0")} : 00
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Menit (00 - 59)
                            </label>
                            <select
                              value={selectedMinute}
                              onChange={(e) => setSelectedMinute(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                            >
                              {Array.from({ length: 60 }).map((_, m) => (
                                <option key={m} value={m}>
                                  Menit {String(m).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <button
                          type="button"
                          onClick={handleApplyPromoTime}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-extrabold text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-2"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Terapkan Waktu Promo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-section: Foto / Background Banner Promo (Hero Web Pelanggan) */}
              <div className="pt-3 border-t border-pink-50 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shrink-0 mt-0.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ff2a85]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Foto / Background Banner Promo (Hero Web Pelanggan)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Upload foto ilustrasi atau background banner promo yang akan muncul pada card pink promo di header website pelanggan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Left: Upload Banner Baru */}
                  <div className="p-4 rounded-3xl border border-pink-100 bg-pink-50/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <UploadCloud className="w-4 h-4 text-[#ff2a85]" />
                        <span>Upload Banner Baru</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        PNG / JPG / WEBP
                      </span>
                    </div>

                    <label className="relative border-2 border-dashed border-pink-200 hover:border-[#ff2a85] bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2 group shadow-xs">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadFile(file, "banner");
                          }
                        }}
                      />
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#ff2a85] flex items-center justify-center group-hover:scale-105 transition-transform border border-pink-100">
                        <UploadCloud className="w-5 h-5 text-[#ff2a85]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#ff2a85]">
                          Upload Foto Banner Promo
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Tarik banner ke sini atau klik browse
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Right: Preview Foto Banner */}
                  <div className="p-4 rounded-3xl border border-pink-100 bg-pink-50/20 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Eye className="w-4 h-4 text-[#ff2a85]" />
                        <span>Preview Foto Banner</span>
                      </div>
                      {bannerImageUrl && (
                        <button
                          type="button"
                          onClick={() => setBannerImageUrl("")}
                          className="text-[10px] font-bold text-rose-500 hover:underline"
                        >
                          Hapus Banner
                        </button>
                      )}
                    </div>

                    <div className="flex-1 border-2 border-dashed border-pink-100 bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[120px] shadow-xs">
                      {bannerImageUrl ? (
                        <div className="relative w-full h-24 rounded-xl overflow-hidden group">
                          <img
                            src={bannerImageUrl}
                            alt="Preview Banner Promo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
                              Banner Terpasang
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 py-2">
                          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 mx-auto flex items-center justify-center">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-slate-500">
                            Belum ada foto banner
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Tampilan default background pink
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
                {/* 1. QRIS Barcode Card & Preview */}
                <div className="p-5 rounded-3xl bg-pink-50/20 border border-pink-100 space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Status Barcode QRIS
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Terpasang
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      NMID: ID1029384756102
                    </p>
                  </div>

                  {/* QRIS Image Preview Box */}
                  <div
                    onClick={() => setPreviewModalImage(qrisImageUrl || "/logo.png")}
                    className="relative bg-white border-2 border-dashed border-pink-200 hover:border-[#ff2a85] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer group transition-all shadow-xs"
                  >
                    <div className="relative w-36 h-36 bg-white rounded-xl p-2 border border-pink-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={qrisImageUrl}
                        alt="QRIS Barcode"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <span className="text-white text-[10px] font-bold bg-black/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Lihat Penuh
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">
                      Klik gambar untuk memperbesar QRIS
                    </p>
                  </div>

                  {/* Upload QRIS Action */}
                  <div className="pt-1">
                    <label className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadFile(file, "qris");
                          }
                        }}
                      />
                      <UploadCloud className="w-3.5 h-3.5 text-[#ff2a85]" />
                      <span>Ganti Barcode QRIS</span>
                    </label>
                  </div>
                </div>

                {/* 2. Logo Storefront Card & Preview */}
                <div className="p-5 rounded-3xl bg-pink-50/20 border border-pink-100 space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Status Logo Storefront
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Terpasang
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      /public/logo.png
                    </p>
                  </div>

                  {/* Logo Image Preview Box */}
                  <div
                    onClick={() => setPreviewModalImage(logoImageUrl)}
                    className="relative bg-white border-2 border-dashed border-pink-200 hover:border-[#ff2a85] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer group transition-all shadow-xs"
                  >
                    <div className="relative w-36 h-36 bg-pink-50/40 rounded-xl p-3 border border-pink-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoImageUrl}
                        alt="Logo Storefront"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <span className="text-white text-[10px] font-bold bg-black/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Lihat Penuh
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">
                      Klik gambar untuk memperbesar Logo
                    </p>
                  </div>

                  {/* Upload Logo Action */}
                  <div className="pt-1">
                    <label className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadFile(file, "logo");
                          }
                        }}
                      />
                      <UploadCloud className="w-3.5 h-3.5 text-[#ff2a85]" />
                      <span>Ganti Logo Storefront</span>
                    </label>
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

      {/* Lightbox Modal for QRIS / Logo / Banner preview */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-sm w-full bg-white rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-pink-100 flex items-center justify-center p-3">
              <img
                src={previewModalImage}
                alt="Pratinjau Penuh"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-center text-xs font-bold text-slate-600">
              Klik di mana saja untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
