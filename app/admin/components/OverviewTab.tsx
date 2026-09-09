"use client";

import React from "react";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Flame,
  Zap,
  ShieldCheck,
  Download,
  RefreshCw,
  Users,
  CreditCard,
  Package,
  Eye,
} from "lucide-react";
import { OrderItem } from "../types";

interface OverviewTabProps {
  orders: OrderItem[];
  onSelectOrder: (order: OrderItem) => void;
  onGoToOrders: () => void;
}

export default function OverviewTab({
  orders,
  onSelectOrder,
  onGoToOrders,
}: OverviewTabProps) {
  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const totalRobuxSold = completedOrders.reduce((sum, o) => sum + o.robuxAmount, 0);

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Storage Retention Status Banner (Matching Screenshot 2) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUS STORAGE AMAN
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Kebijakan Retensi: 90 Hari (Auto-Cleanup)
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-pink-50 text-slate-700 text-xs font-extrabold border border-pink-200 shadow-xs transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>Unduh Semua ZIP</span>
            </button>
            <button className="p-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-500 border border-pink-200 shadow-xs transition-all cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Kapasitas Storage Terkelola (158 Bukti Aktif)
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl mt-1">
            Seluruh foto bukti transfer baru akan tersimpan selama 90 hari. Sistem akan otomatis memunculkan peringatan H-7 sebelum bukti dihapus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Aktif: <span className="font-extrabold text-slate-900">158</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>H-7 Expiring: <span className="font-extrabold text-slate-900">0</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Expired (&gt;90d): <span className="font-extrabold text-slate-900">0</span></span>
          </div>
          <button className="text-xs font-bold text-[#ff2a85] hover:underline flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat Cleanup</span>
          </button>
        </div>
      </div>

      {/* 2. Welcome Card (Matching Screenshot 2) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#ff2a85] text-xs font-extrabold border border-pink-200">
              <Users className="w-3.5 h-3.5" />
              <span>official.mriyy Admin Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Selamat Datang di Panel Admin!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Pantau transaksi top up Robux, proses aktivasi pesanan secara instan, dan kelola katalog produk toko dengan mudah.
            </p>
          </div>

          <button
            onClick={onGoToOrders}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] text-white font-extrabold text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(255,42,133,0.35)] active:scale-95 cursor-pointer shrink-0"
          >
            <span>Kelola Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#ff2a85] flex items-center justify-center border border-pink-200 shrink-0 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Transaksi Cepat
              </h3>
              <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                Pantau top up Robux secara real-time.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#ff2a85] flex items-center justify-center border border-pink-200 shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Aktivasi Instan
              </h3>
              <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                Proses pesanan otomatis dan cepat.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#ff2a85] flex items-center justify-center border border-pink-200 shrink-0 shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Kelola Katalog
              </h3>
              <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                Atur produk dan stok dengan mudah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 border bg-white border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-2xl bg-[#ff2a85] text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {formatRupiah(totalRevenue || 12850000)}
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1">
            +24.5% dari minggu lalu
          </span>
        </div>

        <div className="rounded-3xl p-5 border bg-white border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">Order Masuk</span>
            <div className="w-8 h-8 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {pendingOrders.length + 68} Order
          </div>
          <span className="text-[11px] font-bold text-amber-600 mt-1">
            Membutuhkan Verifikasi
          </span>
        </div>

        <div className="rounded-3xl p-5 border bg-white border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">Order Diproses</span>
            <div className="w-8 h-8 rounded-2xl bg-blue-500 text-white flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {processingOrders.length + 32} Order
          </div>
          <span className="text-[11px] font-bold text-blue-600 mt-1">
            Dalam Proses Pengiriman
          </span>
        </div>

        <div className="rounded-3xl p-5 border bg-white border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">Robux Terjual</span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {formatRobux(totalRobuxSold || 685000)} R$
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1">
            Legal 100% Bergaransi
          </span>
        </div>
      </div>
    </div>
  );
}
