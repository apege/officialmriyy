"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Search,
  CheckCircle,
  AlertCircle,
  QrCode,
  MessageCircle,
  Check,
  Plus,
  Flame,
  Zap,
  Crown,
  Layers,
  ShieldCheck,
  Loader2,
  Phone,
} from "lucide-react";

export interface RobuxPackage {
  id: number;
  amount: number;
  price: number;
  originalPrice?: number;
  tag?: "PROMO" | "POPULER" | "SULTAN";
  category: "populer" | "promo" | "sultan" | "reguler";
}

export const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: 1, amount: 1800, price: 35000, tag: "POPULER", category: "populer" },
  {
    id: 2,
    amount: 2200,
    price: 45000,
    originalPrice: 52000,
    tag: "PROMO",
    category: "promo",
  },
  { id: 3, amount: 2700, price: 50000, category: "reguler" },
  { id: 4, amount: 3200, price: 60000, category: "reguler" },
  { id: 5, amount: 3700, price: 70000, category: "reguler" },
  { id: 6, amount: 4200, price: 80000, tag: "POPULER", category: "populer" },
  { id: 7, amount: 4700, price: 90000, category: "reguler" },
  {
    id: 8,
    amount: 5500,
    price: 100000,
    originalPrice: 115000,
    tag: "PROMO",
    category: "promo",
  },
  { id: 9, amount: 7000, price: 135000, tag: "SULTAN", category: "sultan" },
  { id: 10, amount: 10000, price: 190000, tag: "SULTAN", category: "sultan" },
  { id: 11, amount: 15000, price: 280000, tag: "SULTAN", category: "sultan" },
  { id: 12, amount: 25000, price: 450000, tag: "SULTAN", category: "sultan" },
];

export type PaymentMethod = "website" | "whatsapp";

interface OrderSectionProps {
  username: string;
  setUsername: (val: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  selectedPackage: RobuxPackage;
  setSelectedPackage: (pkg: RobuxPackage) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onAddToCart: (pkg: RobuxPackage) => void;
}

export default function OrderSection({
  username,
  setUsername,
  whatsappNumber,
  setWhatsappNumber,
  selectedPackage,
  setSelectedPackage,
  paymentMethod,
  setPaymentMethod,
  onAddToCart,
}: OrderSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "populer" | "promo" | "sultan">("all");
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  const [accountChecked, setAccountChecked] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Filter packages based on tab
  const filteredPackages = ROBUX_PACKAGES.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "populer") return item.category === "populer" || item.tag === "POPULER";
    if (activeTab === "promo") return item.category === "promo" || item.tag === "PROMO";
    if (activeTab === "sultan") return item.category === "sultan" || item.tag === "SULTAN";
    return true;
  });

  const countPromo = ROBUX_PACKAGES.filter((p) => p.category === "promo" || p.tag === "PROMO").length;
  const countPopuler = ROBUX_PACKAGES.filter((p) => p.category === "populer" || p.tag === "POPULER").length;
  const countSultan = ROBUX_PACKAGES.filter((p) => p.category === "sultan" || p.tag === "SULTAN").length;

  const handleCheckAccount = async () => {
    if (!username.trim()) return;
    setIsCheckingAccount(true);
    setAccountChecked(false);

    setTimeout(() => {
      setIsCheckingAccount(false);
      setAccountChecked(true);
      setAvatarUrl(
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username.trim())}&backgroundColor=ffd5dc,ffb3c6,ffdfba`
      );
    }, 600);
  };

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
    <div id="order-section" className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-4">
      {/* ========================================================================= */}
      {/* STEP 1: MASUKKAN DATA AKUN */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-5 sm:p-7 shadow-xs">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Masukkan Data Akun
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Isi data username Roblox kamu untuk pengiriman pesanan otomatis
            </p>
          </div>
        </div>

        {/* Input & Check Account Box */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <User className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Username Roblox</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAccountChecked(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCheckAccount();
                  }
                }}
                placeholder="Contoh: BloxyGamer123"
                className="w-full px-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-slate-900 font-medium text-xs sm:text-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            <button
              onClick={handleCheckAccount}
              disabled={!username.trim() || isCheckingAccount}
              className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            >
              {isCheckingAccount ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengecek...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Cek Akun</span>
                </>
              )}
            </button>
          </div>

          {/* Account Verified Indicator */}
          {accountChecked && username.trim() && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-in fade-in duration-200">
              {avatarUrl && (
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-emerald-300 shadow-xs relative">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-xs">
                <div className="flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Akun Ditemukan: {username}</span>
                </div>
                <p className="text-emerald-700 text-[10px] font-medium">
                  Robux siap dikirimkan otomatis ke akun ini setelah pembayaran.
                </p>
              </div>
            </div>
          )}

          {/* Nomor WhatsApp Input Field */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nomor WhatsApp</span>
              <span className="text-[10px] text-pink-600 font-semibold">(Untuk Notifikasi & Bukti)</span>
            </label>

            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-slate-900 font-medium text-xs sm:text-sm placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Note Info */}
          <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#ff2a85] shrink-0 mt-0.5" />
            <p className="italic">
              *Silakan masukkan username Roblox Anda dengan benar untuk proses transaksi otomatis 5-10 menit. Akun aman dan privasi terjaga 100%.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2: PILIH ROBUX */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-5 sm:p-7 shadow-xs">
        {/* Step Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              2
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
                <span>Pilih Robux</span>
                <span className="text-[11px] font-semibold text-[#ff2a85]">
                  (Pricelist Resmi official.mriyy)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Pilih paket nominal Robux yang ingin Anda beli
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-[#ff2a85]"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Semua ({ROBUX_PACKAGES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("populer")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === "populer"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-[#ff2a85]"
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Populer ({countPopuler})</span>
            </button>

            <button
              onClick={() => setActiveTab("promo")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === "promo"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-[#ff2a85]"
              }`}
            >
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Promo ({countPromo})</span>
            </button>

            <button
              onClick={() => setActiveTab("sultan")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === "sultan"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-[#ff2a85]"
              }`}
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>Paket Sultan ({countSultan})</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredPackages.map((pkg) => {
            const isSelected = selectedPackage.id === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`relative rounded-2xl p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none ${
                  isSelected
                    ? "bg-white border-2 border-[#ff2a85] shadow-[0_4px_15px_-3px_rgba(255,42,133,0.25)]"
                    : "bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/20"
                }`}
              >
                {/* Top Badge (if any) & Selection Indicator */}
                <div className="flex items-center justify-between mb-2 min-h-[20px]">
                  {pkg.tag === "PROMO" && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ff2a85] text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                      PROMO
                    </span>
                  )}
                  {pkg.tag === "POPULER" && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                      POPULER
                    </span>
                  )}
                  {pkg.tag === "SULTAN" && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                      SULTAN
                    </span>
                  )}
                  {!pkg.tag && <span />}

                  <button
                    type="button"
                    title="Tambah ke Keranjang"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(pkg);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${
                      isSelected
                        ? "bg-[#ff2a85] text-white hover:bg-[#e60067]"
                        : "bg-pink-50 hover:bg-[#ff2a85] text-[#ff2a85] hover:text-white border border-pink-200/60"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Robux Coin Icon & Amount */}
                <div className="flex items-center gap-3 my-1">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      fill
                      className="object-contain drop-shadow-xs"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      {formatRobux(pkg.amount)}{" "}
                      <span className="text-[10px] font-bold text-slate-400">
                        Robux
                      </span>
                    </div>
                    {pkg.originalPrice && (
                      <div className="text-[9px] text-slate-400 line-through font-semibold">
                        {formatRupiah(pkg.originalPrice)}
                      </div>
                    )}
                    <div className="font-black text-xs sm:text-sm text-[#ff2a85]">
                      {formatRupiah(pkg.price)}
                    </div>
                  </div>
                </div>

                {/* Card Footer: INSTAN & Status */}
                <div className="mt-3 pt-2.5 border-t border-pink-50 flex items-center justify-between text-[10px]">
                  <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 uppercase tracking-wider">
                    <Zap className="w-2.5 h-2.5 fill-emerald-500" />
                    <span>INSTAN</span>
                  </span>

                  <span
                    className={`font-semibold ${
                      isSelected ? "text-[#ff2a85]" : "text-slate-400"
                    }`}
                  >
                    {isSelected ? "Dipilih" : "Pilih"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 3: PILIH PEMBAYARAN */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-5 sm:p-7 shadow-xs">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Pilih Pembayaran
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Pilih metode pembayaran yang paling nyaman untuk Anda
            </p>
          </div>
        </div>

        {/* 2 Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Pembayaran via Website (QRIS) */}
          <div
            onClick={() => setPaymentMethod("website")}
            className={`rounded-2xl p-4 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
              paymentMethod === "website"
                ? "bg-white border-2 border-[#ff2a85] shadow-xs"
                : "bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      Pembayaran via Website
                    </h3>
                    <p className="text-[10px] font-semibold text-[#ff2a85]">
                      Scan QRIS & Upload Bukti
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === "website"
                      ? "bg-[#ff2a85] text-white"
                      : "border border-slate-200"
                  }`}
                >
                  {paymentMethod === "website" && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Scan barcode QRIS (BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay) lalu upload bukti transfer langsung di website.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-pink-50 text-[10px]">
              <span className="inline-flex items-center gap-1 font-bold text-[#ff2a85]">
                <Zap className="w-3 h-3 fill-[#ff2a85]" />
                <span>Verifikasi Otomatis</span>
              </span>

              <span
                className={`font-semibold ${
                  paymentMethod === "website" ? "text-[#ff2a85]" : "text-slate-400"
                }`}
              >
                {paymentMethod === "website" ? "Dipilih" : "Pilih"}
              </span>
            </div>
          </div>

          {/* Option 2: Pembayaran via WhatsApp */}
          <div
            onClick={() => setPaymentMethod("whatsapp")}
            className={`rounded-2xl p-4 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
              paymentMethod === "whatsapp"
                ? "bg-white border-2 border-emerald-500 shadow-xs"
                : "bg-white border border-pink-100 hover:border-emerald-300 hover:bg-emerald-50/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <MessageCircle className="w-4 h-4 fill-emerald-100" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      Pembayaran via WhatsApp
                    </h3>
                    <p className="text-[10px] font-semibold text-emerald-600">
                      Chat Langsung dengan Admin
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    paymentMethod === "whatsapp"
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-200"
                  }`}
                >
                  {paymentMethod === "whatsapp" && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Pesan langsung melalui WhatsApp resmi official.mriyy dengan format pesanan instan, dibantu langsung oleh admin sampai selesai.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-50 text-[10px]">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                <span>Fast Respon 24 Jam</span>
              </span>

              <span
                className={`font-semibold ${
                  paymentMethod === "whatsapp" ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {paymentMethod === "whatsapp" ? "Dipilih" : "Pilih"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
