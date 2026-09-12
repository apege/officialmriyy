"use client";

import React, { useState, useEffect } from "react";
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
  inStock?: boolean;
}

export const ROBUX_PACKAGES: RobuxPackage[] = [
  {
    id: 1,
    amount: 1800,
    price: 35000,
    category: "populer",
    tag: "POPULER",
    inStock: true,
  },
  {
    id: 2,
    amount: 2200,
    price: 45000,
    originalPrice: 52000,
    category: "promo",
    tag: "PROMO",
    inStock: true,
  },
  {
    id: 3,
    amount: 3700,
    price: 70000,
    category: "reguler",
    inStock: true,
  },
  {
    id: 4,
    amount: 4200,
    price: 80000,
    category: "reguler",
    inStock: true,
  },
  {
    id: 5,
    amount: 10000,
    price: 185000,
    category: "reguler",
    inStock: true,
  },
  {
    id: 6,
    amount: 25000,
    price: 450000,
    category: "sultan",
    tag: "SULTAN",
    inStock: true,
  },
  {
    id: 7,
    amount: 33000,
    price: 675000,
    category: "sultan",
    tag: "SULTAN",
    inStock: true,
  },
];

export type PaymentMethod = "website" | "whatsapp";

interface OrderSectionProps {
  username: string;
  setUsername: (val: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  selectedPackage?: RobuxPackage | null;
  setSelectedPackage: (pkg: RobuxPackage) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onAddToCart: (pkg: RobuxPackage) => void;
  packages?: RobuxPackage[];
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
  packages: initialPackages,
}: OrderSectionProps) {
  const [packages, setPackages] = useState<RobuxPackage[]>(initialPackages || []);
  const [isLoadingPackages, setIsLoadingPackages] = useState(!initialPackages?.length);
  const [activeTab, setActiveTab] = useState<"all" | "populer" | "promo" | "sultan">("all");
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  const [accountChecked, setAccountChecked] = useState(false);
  const [accountCheckError, setAccountCheckError] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setPackages(initialPackages);
      setIsLoadingPackages(false);
    } else if (initialPackages && initialPackages.length === 0) {
      // Still waiting for parent page.tsx to finish initial fetch
      setIsLoadingPackages(true);
    }
  }, [initialPackages]);

  // Filter packages based on tab
  const filteredPackages = packages.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "populer") return item.category === "populer" || item.tag === "POPULER";
    if (activeTab === "promo") return item.category === "promo" || item.tag === "PROMO";
    if (activeTab === "sultan") return item.category === "sultan" || item.tag === "SULTAN";
    return true;
  });

  const countPromo = packages.filter((p) => p.category === "promo" || p.tag === "PROMO").length;
  const countPopuler = packages.filter((p) => p.category === "populer" || p.tag === "POPULER").length;
  const countSultan = packages.filter((p) => p.category === "sultan" || p.tag === "SULTAN").length;

  const handleCheckAccount = async () => {
    if (!username.trim()) return;
    setIsCheckingAccount(true);
    setAccountChecked(false);
    setAccountCheckError(null);

    try {
      const res = await fetch(`/api/roblox-user?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setAccountChecked(true);
        setAvatarUrl(data.user.avatarUrl || "");
        setUserDisplayName(data.user.displayName || data.user.name);
        setUsername(data.user.name);
      } else {
        setAccountCheckError(data.error || `Akun Roblox "${username}" tidak ditemukan.`);
        setAvatarUrl(null);
        setUserDisplayName(null);
      }
    } catch {
      setAccountCheckError("Gagal memeriksa akun Roblox. Silakan coba sesaat lagi.");
    } finally {
      setIsCheckingAccount(false);
    }
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
    <div id="order-section" className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 space-y-3 sm:space-y-4">
      {/* ========================================================================= */}
      {/* STEP 1: MASUKKAN DATA AKUN */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-4 sm:p-7 shadow-xs">
        {/* Step Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
              Masukkan Data Akun
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Isi data username Roblox kamu untuk pengiriman pesanan otomatis
            </p>
          </div>
        </div>

        {/* Input & Check Account Box */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <User className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Username Roblox <span className="text-rose-500">*</span></span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            <div className="relative flex-1">
              <input
                id="input-roblox-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAccountChecked(false);
                  setAccountCheckError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCheckAccount();
                  }
                }}
                placeholder="Contoh: BloxyGamer123"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-slate-900 font-medium text-xs sm:text-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            <button
              onClick={handleCheckAccount}
              disabled={!username.trim() || isCheckingAccount}
              className="flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
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
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in duration-200">
              {avatarUrl ? (
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border-2 border-emerald-300 shadow-sm relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  RBX
                </div>
              )}
              <div className="text-xs">
                <div className="flex items-center gap-1.5 font-black text-slate-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{username}</span>
                  {userDisplayName && userDisplayName !== username && (
                    <span className="text-slate-500 font-semibold text-[11px]">({userDisplayName})</span>
                  )}
                </div>
                <p className="text-emerald-700 text-[11px] font-medium mt-0.5">
                  Akun Roblox Resmi Terverifikasi. Robux siap dikirimkan otomatis ke akun ini.
                </p>
              </div>
            </div>
          )}

          {/* Account Error Message */}
          {accountCheckError && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{accountCheckError}</span>
            </div>
          )}

          {/* Nomor WhatsApp Input Field */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 flex-wrap">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nomor WhatsApp <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-pink-600 font-semibold">(Untuk Notifikasi & Bukti)</span>
            </label>

            <input
              id="input-whatsapp-number"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-slate-900 font-medium text-xs sm:text-sm placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Note Info */}
          <div className="flex items-start gap-1.5 text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#ff2a85] shrink-0 mt-0.5" />
            <p className="italic leading-tight">
              *Silakan masukkan username Roblox Anda dengan benar untuk proses transaksi otomatis 5-10 menit. Akun aman dan privasi terjaga 100%.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2: PILIH ROBUX */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-4 sm:p-7 shadow-xs">
        {/* Step Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              2
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
                <span>Pilih Robux</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#ff2a85]">
                  (Pricelist Resmi official.mriyy)
                </span>
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                Pilih paket nominal Robux yang ingin Anda beli
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar sm:flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-[#ff2a85]"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Semua ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("populer")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
        {isLoadingPackages ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff2a85]" />
            <p className="text-xs font-bold">Memuat daftar harga Robux...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative rounded-2xl p-3 sm:p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? "bg-white border-2 border-[#ff2a85] shadow-[0_4px_15px_-3px_rgba(255,42,133,0.25)]"
                      : "bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/20"
                  }`}
                >
                  {/* Top Badge (if any) & Selection Indicator */}
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2 min-h-[20px]">
                    {pkg.tag === "PROMO" && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#ff2a85] text-white text-[8px] sm:text-[9px] font-black tracking-wider uppercase shadow-xs">
                        PROMO
                      </span>
                    )}
                    {pkg.tag === "POPULER" && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500 text-white text-[8px] sm:text-[9px] font-black tracking-wider uppercase shadow-xs">
                        POPULER
                      </span>
                    )}
                    {pkg.tag === "SULTAN" && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-600 text-white text-[8px] sm:text-[9px] font-black tracking-wider uppercase shadow-xs">
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
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${
                        isSelected
                          ? "bg-[#ff2a85] text-white hover:bg-[#e60067]"
                          : "bg-pink-50 hover:bg-[#ff2a85] text-[#ff2a85] hover:text-white border border-pink-200/60"
                      }`}
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Robux Coin Icon & Amount */}
                  <div className="flex items-center gap-2 sm:gap-3 my-1">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain drop-shadow-xs"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-xs sm:text-base text-slate-900 leading-tight truncate">
                        {formatRobux(pkg.amount)}{" "}
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                          Robux
                        </span>
                      </div>
                      {pkg.originalPrice && (
                        <div className="text-[8px] sm:text-[9px] text-slate-400 line-through font-semibold truncate">
                          {formatRupiah(pkg.originalPrice)}
                        </div>
                      )}
                      <div className="font-black text-xs sm:text-sm text-[#ff2a85] truncate">
                        {formatRupiah(pkg.price)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: INSTAN & Status */}
                  <div className="mt-2 pt-2 border-t border-pink-50 flex items-center justify-between text-[9px] sm:text-[10px]">
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* STEP 3: PILIH PEMBAYARAN */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-pink-100 p-4 sm:p-7 shadow-xs">
        {/* Step Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff2a85] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
              Pilih Pembayaran
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Pilih metode pembayaran yang paling nyaman untuk Anda
            </p>
          </div>
        </div>

        {/* 2 Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Option 1: Pembayaran via Website (QRIS) */}
          <div
            onClick={() => setPaymentMethod("website")}
            className={`rounded-2xl p-3.5 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
              paymentMethod === "website"
                ? "bg-white border-2 border-[#ff2a85] shadow-xs"
                : "bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      Pembayaran via Website
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-semibold text-[#ff2a85]">
                      Scan QRIS & Upload Bukti
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
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

              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed mb-3">
                Scan barcode QRIS (BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay) lalu upload bukti transfer langsung di website.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-pink-50 text-[9px] sm:text-[10px]">
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
            className={`rounded-2xl p-3.5 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
              paymentMethod === "whatsapp"
                ? "bg-white border-2 border-emerald-500 shadow-xs"
                : "bg-white border border-pink-100 hover:border-emerald-300 hover:bg-emerald-50/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <MessageCircle className="w-4 h-4 fill-emerald-100" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      Pembayaran via WhatsApp
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-semibold text-emerald-600">
                      Chat Langsung dengan Admin
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
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

              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed mb-3">
                Pesan langsung melalui WhatsApp resmi official.mriyy dengan format pesanan instan, dibantu langsung oleh admin sampai selesai.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-50 text-[9px] sm:text-[10px]">
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
