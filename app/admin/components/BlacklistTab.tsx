"use client";

import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  ShieldAlert,
  Unlock,
  MessageCircle,
  X,
  ShieldCheck,
} from "lucide-react";

export interface BlacklistItem {
  id: string;
  username: string;
  whatsapp: string;
  reason: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

const MOCK_BLACKLIST: BlacklistItem[] = [
  {
    id: "BLK-001",
    username: "Perusuh",
    whatsapp: "08123456789",
    reason: "Indikasi Bukti Palsu",
    totalOrders: 0,
    totalSpent: 0,
    createdAt: "9 Sep 2026",
  },
];

export default function BlacklistTab() {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>(MOCK_BLACKLIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formUsername, setFormUsername] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [formReason, setFormReason] = useState("");

  const filteredBlacklist = blacklist.filter(
    (b) =>
      b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.whatsapp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblock = (id: string) => {
    setBlacklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim()) return;

    const newItem: BlacklistItem = {
      id: `BLK-${Date.now().toString().slice(-3)}`,
      username: formUsername.trim(),
      whatsapp: formWhatsapp.trim() || "Belum terdata",
      reason: formReason.trim() || "Indikasi Penipuan",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: "Hari ini",
    };

    setBlacklist((prev) => [newItem, ...prev]);
    setFormUsername("");
    setFormWhatsapp("");
    setFormReason("");
    setIsAddModalOpen(false);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Bar (Matching Screenshot 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Daftar Blacklist
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Daftar akun pelanggan yang diblokir karena indikasi penipuan atau penyalahgunaan
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Blacklist</span>
          </button>

          <button
            onClick={() => setBlacklist([...blacklist])}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Meta Bar (Matching Screenshot 8) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari akun blacklist..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Menampilkan <span className="font-extrabold text-[#ff2a85]">{filteredBlacklist.length}</span> akun blacklist
        </div>
      </div>

      {/* 3. Blacklist List Items (Matching Screenshot 8 Layout) */}
      <div className="space-y-3">
        {filteredBlacklist.length === 0 ? (
          <div className="bg-white border border-pink-100 rounded-3xl p-16 sm:p-20 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <ShieldAlert className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              Tidak ada akun di dalam blacklist.
            </p>
          </div>
        ) : (
          filteredBlacklist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-pink-100 hover:border-pink-300 rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Info Column */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-slate-900 line-through text-rose-600">
                    @{item.username}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#ff2a85] text-[10px] font-black uppercase tracking-wider">
                    BLACKLISTED
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span>ID: <span className="text-slate-700">{item.id}</span></span>
                  <span>•</span>
                  <span>WA:</span>
                  <span className="text-emerald-600 font-bold">{item.whatsapp}</span>
                </div>
              </div>

              {/* Middle Orders & Spent Column */}
              <div className="text-left md:text-right text-xs space-y-0.5">
                <p className="font-extrabold text-slate-900">{item.totalOrders} Pesanan</p>
                <p className="font-bold text-slate-400">Total: {formatRupiah(item.totalSpent)}</p>
              </div>

              {/* Right Action Button: Buka Blokir */}
              <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-pink-50">
                <button
                  onClick={() => handleUnblock(item.id)}
                  className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs border border-emerald-200 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Blokir</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Blacklist Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#ff2a85]" />
                <span>Tambah Akun Ke Blacklist</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-[#ff2a85] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBlacklist} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Username Roblox
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  required
                  placeholder="Contoh: Perusuh123"
                  className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="text"
                  value={formWhatsapp}
                  onChange={(e) => setFormWhatsapp(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alasan Blokir
                </label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Contoh: Indikasi Bukti Palsu / Penipuan"
                  className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  Simpan Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
