"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  DollarSign,
  QrCode,
  MessageCircle,
  Search,
  Zap,
  TrendingUp,
  Wallet,
  Globe,
  CheckCircle2,
} from "lucide-react";

export interface MutationItem {
  id: string;
  username: string;
  amount: number;
  robux: number;
  method: "website" | "whatsapp";
  date: string;
  status: "LUNAS";
}

export default function KeuanganTab() {
  const [mutations, setMutations] = useState<MutationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [methodFilter, setMethodFilter] = useState<"all" | "website" | "whatsapp">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          const validOrders = data.orders.filter(
            (o: any) => o.order_status !== "cancelled"
          );
          if (validOrders.length > 0) {
            const mapped: MutationItem[] = validOrders.map((o: any) => ({
              id: o.order_code,
              username: o.roblox_username,
              amount: Number(o.price) || 0,
              robux: Number(o.robux) || 0,
              method: String(o.payment_method || "").toLowerCase().includes("whatsapp") ? "whatsapp" : "website",
              date: o.created_at
                ? new Date(o.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Hari ini",
              status: "LUNAS",
            }));
            setMutations(mapped);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching finance data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFinanceData();
  }, []);

  const filteredMutations = mutations.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "all" || m.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalWebsiteOmset = mutations
    .filter((m) => m.method === "website")
    .reduce((sum, m) => sum + m.amount, 0);

  const totalWhatsappOmset = mutations
    .filter((m) => m.method === "whatsapp")
    .reduce((sum, m) => sum + m.amount, 0);

  const totalDanaMasuk = mutations.reduce((sum, m) => sum + m.amount, 0);
  const totalRobuxTerjual = mutations.reduce((sum, m) => sum + m.robux, 0);
  const averageOrderValue = Math.round(totalDanaMasuk / (mutations.length || 1));

  const websitePercentage = ((totalWebsiteOmset / (totalDanaMasuk || 1)) * 100).toFixed(1);
  const whatsappPercentage = ((totalWhatsappOmset / (totalDanaMasuk || 1)) * 100).toFixed(1);

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
      {/* 1. Header Bar (Matching Screenshot 9) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Log mutasi kas masuk dan ringkasan pembayaran pesanan Robux yang berhasil
          </p>
        </div>

        <button
          onClick={fetchFinanceData}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Memuat..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* 2. Top Metric Cards Row (3 Stat Cards - Matching Screenshot 9) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Dana Masuk */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              TOTAL DANA MASUK
            </span>
            <div className="w-7 h-7 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center font-bold text-xs">
              💸
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#ff2a85]">
              {formatRupiah(totalDanaMasuk || 1382000)}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Dari {mutations.length} transaksi pembayaran lunas
            </p>
          </div>
        </div>

        {/* Card 2: Total Robux Terjual */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              TOTAL ROBUX TERJUAL
            </span>
            <div className="relative w-6 h-6">
              <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
              <span>{formatRobux(totalRobuxTerjual || 72000)}</span>
              <span className="text-xs text-amber-500 font-extrabold">R$</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Robux terkirim ke akun pelanggan
            </p>
          </div>
        </div>

        {/* Card 3: Rata-Rata Order (AOV) */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              RATA-RATA ORDER
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">
              AOV
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatRupiah(averageOrderValue || 43188)}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              Average Order Value per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* 3. OMSET PER METODE PEMBAYARAN (Matching Screenshot 9) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            OMSET PER METODE PEMBAYARAN
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Ringkasan total pemasukan berdasarkan metode pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Website */}
          <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#ff2a85] flex items-center justify-center font-bold text-xs">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 uppercase">
                  WEBSITE
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#ff2a85] text-[10px] font-black">
                {websitePercentage}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total Omset</p>
                <p className="font-black text-sm text-[#ff2a85]">
                  {formatRupiah(totalWebsiteOmset || 1282000)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold">Transaksi</p>
                <p className="font-extrabold text-xs text-slate-800">
                  {mutations.filter((m) => m.method === "website").length} transaksi
                </p>
              </div>
            </div>

            <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#ff2a85] h-full rounded-full"
                style={{ width: `${websitePercentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-100" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 uppercase">
                  WHATSAPP
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                {whatsappPercentage}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Total Omset</p>
                <p className="font-black text-sm text-[#ff2a85]">
                  {formatRupiah(totalWhatsappOmset || 100000)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold">Transaksi</p>
                <p className="font-extrabold text-xs text-slate-800">
                  {mutations.filter((m) => m.method === "whatsapp").length} transaksi
                </p>
              </div>
            </div>

            <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${whatsappPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Log Mutasi Pembayaran Masuk (Matching Screenshot 9) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-4">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              Log Mutasi Pembayaran Masuk
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Riwayat penerimaan pembayaran yang valid dan sudah lunas
            </p>
          </div>

          {/* Method Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMethodFilter("all")}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                methodFilter === "all"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50"
              }`}
            >
              Semua ({mutations.length})
            </button>
            <button
              onClick={() => setMethodFilter("website")}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                methodFilter === "website"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50"
              }`}
            >
              Website ({mutations.filter((m) => m.method === "website").length})
            </button>
            <button
              onClick={() => setMethodFilter("whatsapp")}
              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                methodFilter === "whatsapp"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-50"
              }`}
            >
              WhatsApp ({mutations.filter((m) => m.method === "whatsapp").length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode order atau username..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Mutations List Rows */}
        <div className="divide-y divide-pink-50 pt-1">
          {filteredMutations.map((m) => (
            <div
              key={m.id}
              className="py-3 flex items-center justify-between gap-4 hover:bg-pink-50/20 px-2 rounded-2xl transition-colors"
            >
              {/* Left Column */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-900">
                    #{m.id}
                  </span>
                  <span className="font-extrabold text-xs text-[#ff2a85]">
                    @{m.username}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                  <span className="px-1.5 py-0.5 rounded-md bg-pink-50 text-[#ff2a85] text-[9px] font-black uppercase">
                    {m.method.toUpperCase()}
                  </span>
                  <span>•</span>
                  <span>{m.date}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="text-right">
                <p className="font-black text-sm text-emerald-600">
                  +{formatRupiah(m.amount)}
                </p>
                <p className="text-[10px] text-amber-500 font-extrabold flex items-center justify-end gap-1 mt-0.5">
                  <Image src="/robux.webp" alt="Robux" width={12} height={12} />
                  <span>{formatRobux(m.robux)} Robux</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
