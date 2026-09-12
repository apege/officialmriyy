"use client";

import React from "react";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  CreditCard,
  Zap,
  Package,
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

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalOmset = orders.reduce((sum, o) => (o.status !== "cancelled" ? sum + o.price : sum), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Card */}
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

      {/* 2. Four Stat Cards (2x2 on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Omset */}
        <div className="rounded-3xl bg-white border border-pink-100 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="truncate">TOTAL OMSET</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(totalOmset)}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span>↑ {orders.length} total pesanan</span>
          </div>
        </div>

        {/* Order Masuk */}
        <div
          onClick={onGoToOrders}
          className="rounded-3xl bg-white border border-pink-100 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="truncate">ORDER MASUK</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-500">
            {pendingOrders.length}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-1 hover:underline">
            <span>{pendingOrders.length > 0 ? "Perlu diproses →" : "Semua selesai"}</span>
          </div>
        </div>

        {/* Sedang Diproses */}
        <div
          onClick={onGoToOrders}
          className="rounded-3xl bg-white border border-pink-100 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="truncate">DIPROSES</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-blue-600">
            {processingOrders.length}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
            <span>{processingOrders.length > 0 ? "Dalam antrean →" : "Tidak ada antrean"}</span>
          </div>
        </div>

        {/* Order Selesai */}
        <div className="rounded-3xl bg-white border border-pink-100 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="truncate">SELESAI</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600">
            {completedOrders.length}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-400">
            <span>Dari {orders.length} total order</span>
          </div>
        </div>
      </div>

      {/* 3. Pesanan Terbaru Card (Matching Uploaded Image) */}
      <div className="rounded-3xl bg-white border border-pink-100 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Pesanan Terbaru
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              5 transaksi terakhir yang masuk ke sistem
            </p>
          </div>
          <button
            onClick={onGoToOrders}
            className="text-xs font-black text-[#ff2a85] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of Recent Orders (Matching Bloxylucy 1-Column List Design) */}
        <div className="space-y-3">
          {orders.slice(0, 5).map((ord) => {
            const displayOrderId = ord.id.startsWith("MRY")
              ? ord.id
              : `MRY${ord.id.replace(/^[^0-9]+/, "")}`;

            return (
              <div
                key={ord.id}
                onClick={() => onSelectOrder(ord)}
                className="flex items-center justify-between p-4 rounded-2xl sm:rounded-3xl bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/20 shadow-xs transition-all cursor-pointer"
              >
                {/* Left: Coin Icon + Order Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-amber-50/80 border border-amber-200/60 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                    <div className="relative w-full h-full">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-[#ff2a85] font-mono tracking-tight">
                      #{displayOrderId}
                    </div>
                    <div className="text-xs text-slate-600 font-bold mt-0.5 truncate">
                      @{ord.username} • {formatRobux(ord.robuxAmount)} Robux
                    </div>
                  </div>
                </div>

                {/* Right: Price on top + Payment Badge on bottom (Bloxylucy style) */}
                <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {formatRupiah(ord.price)}
                  </div>

                  {ord.paymentMethod === "whatsapp" ? (
                    <span className="px-2.5 py-0.5 rounded-lg border border-emerald-400 text-emerald-700 bg-white text-[10px] font-black uppercase tracking-wider">
                      WHATSAPP
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg border border-pink-300 text-[#ff2a85] bg-white text-[10px] font-black uppercase tracking-wider">
                      WEBSITE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
