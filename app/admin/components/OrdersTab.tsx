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
  const [storageStats, setStorageStats] = useState({
    activeCount: 0,
    expiringSoonCount: 0,
    expiredCount: 0,
    retentionDays: 90,
  });

  const fetchStorageStats = async () => {
    try {
      const res = await fetch(`/api/storage-cleanup?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.stats) {
          setStorageStats({
            activeCount: Number(data.stats.activeCount ?? data.stats.active ?? 0),
            expiringSoonCount: Number(data.stats.expiringSoonCount ?? data.stats.expiring ?? 0),
            expiredCount: Number(data.stats.expiredCount ?? data.stats.expired ?? 0),
            retentionDays: Number(data.stats.retentionDays || 90),
          });
        }
      }
    } catch (err) {
      console.error("Error fetching storage stats:", err);
    }
  };

  React.useEffect(() => {
    fetchStorageStats();
  }, [orders]);

  // Fallback calculation directly from current orders if stats are 0 but local orders have proof
  const localProofCount = orders.filter(
    (o) => o.paymentProof && String(o.paymentProof).trim() !== ""
  ).length;

  const displayActiveCount =
    storageStats.activeCount > 0 ? storageStats.activeCount : localProofCount;

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
            <button
              onClick={fetchStorageStats}
              title="Refresh Statistik Storage"
              className="p-2 rounded-2xl bg-white hover:bg-pink-50 text-slate-500 hover:text-[#ff2a85] border border-pink-200 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Kapasitas Storage Terkelola ({displayActiveCount} Bukti Aktif)
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl mt-1">
            Seluruh foto bukti transfer baru akan tersimpan selama {storageStats.retentionDays} hari. Sistem akan otomatis memunculkan peringatan H-7 sebelum bukti dihapus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Aktif: <span className="font-extrabold text-slate-900">{displayActiveCount}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>H-7 Expiring: <span className="font-extrabold text-slate-900">{storageStats.expiringSoonCount}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Expired (&gt;90d): <span className="font-extrabold text-slate-900">{storageStats.expiredCount}</span></span>
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

      {/* 3. Main Orders Container (Matching BloxyLucy List Design) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Search Bar & Count Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter order atau username..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
            Menampilkan <span className="font-extrabold text-slate-900">{filteredOrders.length}</span> pesanan
          </div>
        </div>

        {/* Orders List (1-Column Full Width Horizontal Rows) */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <Package className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              {emptyStateMessage}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pink-100/60 border-t border-pink-100/60">
            {filteredOrders.map((order) => {
              const displayOrderId = order.id.startsWith("MRY")
                ? order.id
                : `MRY${order.id.replace(/^[^0-9]+/, "")}`;

              return (
                <div
                  key={order.id}
                  className="py-4 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors hover:bg-pink-50/10 px-2 sm:px-3 rounded-2xl"
                >
                  {/* Left Column: Order ID + Status, and Customer Details */}
                  <div className="space-y-1.5 min-w-0">
                    {/* Line 1: Order ID & Status Badge */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-sm sm:text-base text-[#ff2a85] font-mono tracking-tight">
                        #{displayOrderId}
                      </span>

                      {order.status === "pending" && (
                        <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                          Menunggu Bayar
                        </span>
                      )}
                      {order.status === "processing" && (
                        <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                          Diproses
                        </span>
                      )}
                      {order.status === "completed" && (
                        <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          Selesai
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                          Dibatalkan
                        </span>
                      )}
                    </div>

                    {/* Line 2: Customer Username, Date, Payment Channel, Photo Status */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="font-bold text-slate-900">@{order.username}</span>
                      <span className="text-slate-300">•</span>
                      <span>{order.createdAt}</span>
                      <span className="text-slate-300">•</span>
                      {order.paymentMethod === "website" ? (
                        <span className="px-2.5 py-0.5 rounded-md border border-pink-300 text-[#ff2a85] bg-white text-[10px] font-extrabold uppercase tracking-wider">
                          WEBSITE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md border border-emerald-400 text-emerald-700 bg-white text-[10px] font-extrabold uppercase tracking-wider">
                          WHATSAPP
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 italic">
                        {order.paymentProof ? "(Ada foto)" : "(Tanpa foto)"}
                      </span>
                    </div>
                  </div>

                  {/* Middle / Right: Amounts & Action Buttons */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 shrink-0">
                    {/* Robux Amount & Price */}
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {formatRobux(order.robuxAmount)} Robux
                      </div>
                      <div className="text-sm sm:text-base font-black text-[#ff2a85]">
                        {formatRupiah(order.price)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {order.status === "pending" && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "processing")}
                          className="px-4 sm:px-5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs border border-blue-200 shadow-2xs transition-all cursor-pointer active:scale-95"
                        >
                          Proses
                        </button>
                      )}

                      {order.status === "processing" && (
                        <button
                          onClick={() => onUpdateStatus(order.id, "completed")}
                          className="px-4 sm:px-5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 shadow-2xs transition-all cursor-pointer active:scale-95"
                        >
                          Selesaikan
                        </button>
                      )}

                      {order.status === "completed" && (
                        <a
                          href={`https://wa.me/${(order.whatsapp.startsWith("+") ? order.whatsapp : `+62${order.whatsapp.replace(/^0/, "")}`).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo kak @${order.username}! 👋✨\n\nTerima kasih banyak telah top up Robux ${formatRobux(order.robuxAmount)} Robux di official.mriyy! 🎉\nPesanan #${displayOrderId} telah SELESAI.\n\nMohon luangkan waktu 1 menit untuk memberikan ulasan & rating di link berikut ya kak:\n👉 ${typeof window !== "undefined" ? window.location.origin : "https://officialmriyy.com"}/?token=${displayOrderId}#testimoni ⭐⭐⭐⭐⭐`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          title="Kirim Link Review via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Kirim Review</span>
                        </a>
                      )}

                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-4 sm:px-5 py-1.5 rounded-full bg-[#ff2a85] hover:bg-[#e60067] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
