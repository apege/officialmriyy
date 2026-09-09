"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Eye,
  Check,
  MessageCircle,
  Copy,
  Calendar,
  Package,
} from "lucide-react";
import { OrderItem, AdminTab } from "../types";

interface OrdersTabProps {
  orders: OrderItem[];
  activeTab: AdminTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderItem["status"]) => void;
  onDeleteOrder: (orderId: string) => void;
  onSelectOrder: (order: OrderItem) => void;
}

export default function OrdersTab({
  orders,
  activeTab,
  searchQuery,
  setSearchQuery,
  onUpdateStatus,
  onDeleteOrder,
  onSelectOrder,
}: OrdersTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map activeTab to status filter, page titles, and empty states
  let currentStatus: OrderItem["status"] | "all" = "all";
  let pageTitle = "Semua Transaksi";
  let pageSubtitle = "Daftar seluruh pesanan top up Robux di official.mriyy";
  let emptyStateMessage = "Belum ada pesanan ditemukan.";

  if (activeTab === "order_masuk") {
    currentStatus = "pending";
    pageTitle = "Order Masuk";
    pageSubtitle = "Daftar pesanan baru yang membutuhkan verifikasi pembayaran";
    emptyStateMessage = "Tidak ada pesanan masuk.";
  } else if (activeTab === "order_diproses") {
    currentStatus = "processing";
    pageTitle = "Order Diproses";
    pageSubtitle = "Daftar pesanan yang sedang diproses pengiriman Robux ke akun pembeli";
    emptyStateMessage = "Tidak ada pesanan yang sedang diproses.";
  } else if (activeTab === "order_selesai") {
    currentStatus = "completed";
    pageTitle = "Order Selesai";
    pageSubtitle = "Riwayat seluruh pesanan Robux yang telah berhasil diselesaikan";
    emptyStateMessage = "Belum ada pesanan yang selesai.";
  } else if (activeTab === "order_dibatalkan") {
    currentStatus = "cancelled";
    pageTitle = "Order Dibatalkan";
    pageSubtitle = "Daftar pesanan yang telah dibatalkan oleh pembeli atau admin";
    emptyStateMessage = "Tidak ada pesanan yang dibatalkan.";
  }

  // Filter orders based on search query & currentStatus
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.whatsapp.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      currentStatus === "all" || order.status === currentStatus;

    return matchesSearch && matchesStatus;
  });

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
      {/* 1. Storage Retention Status Banner (Matching Screenshot 4) */}
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

      {/* 2. Page Section Header & Refresh Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {pageSubtitle}
          </p>
        </div>

        <button
          onClick={() => setSearchQuery(searchQuery)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 3. Search Bar & Count Meta */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter order atau username..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Menampilkan <span className="font-extrabold text-[#ff2a85]">{filteredOrders.length}</span> pesanan
        </div>
      </div>

      {/* 4. Order List Rows OR Empty State (Matching Screenshot 4) */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-pink-100 rounded-3xl p-16 sm:p-20 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <Package className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              {emptyStateMessage}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-pink-100 hover:border-pink-300 rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Info Column */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-black text-sm text-[#ff2a85]">
                    #{order.id.replace("TRX-", "BLX")}
                  </span>

                  {order.status === "pending" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase">
                      Menunggu Bayar
                    </span>
                  )}
                  {order.status === "processing" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase">
                      Diproses
                    </span>
                  )}
                  {order.status === "completed" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                      Selesai
                    </span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase">
                      Dibatalkan
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
                  <span className="font-extrabold text-slate-900">@{order.username}</span>
                  <span>•</span>
                  <span>{order.createdAt}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-100 text-[#ff2a85] text-[10px] font-black uppercase">
                    {order.paymentMethod === "website" ? "WEBSITE" : "WHATSAPP"}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    {order.paymentMethod === "website" ? "(Tanpa foto)" : "(Ada foto)"}
                  </span>
                </div>
              </div>

              {/* Middle Robux & Price Column */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative w-7 h-7">
                  <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {formatRobux(order.robuxAmount)} Robux
                  </p>
                  <p className="font-black text-sm text-[#ff2a85]">
                    {formatRupiah(order.price)}
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-pink-50">
                {order.status !== "completed" && (
                  <button
                    onClick={() => onUpdateStatus(order.id, "completed")}
                    className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs border border-emerald-200 shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    Selesaikan
                  </button>
                )}

                <button
                  onClick={() => onSelectOrder(order)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <span>Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
