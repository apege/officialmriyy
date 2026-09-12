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

export default function BlacklistTab() {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formUsername, setFormUsername] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [formReason, setFormReason] = useState("");

  const fetchBlacklists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blacklists");
      if (res.ok) {
        const data = await res.json();
        if (data.blacklists && Array.isArray(data.blacklists)) {
          const mapped: BlacklistItem[] = data.blacklists.map((b: any) => ({
            id: `BLK-${String(b.id).padStart(3, "0")}`,
            username: b.roblox_username,
            whatsapp: b.phone || "Belum terdata",
            reason: b.reason || "Indikasi Penipuan",
            totalOrders: 0,
            totalSpent: 0,
            createdAt: b.created_at ? new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Hari ini",
          }));
          setBlacklist(mapped);
        }
      }
    } catch (err) {
      console.error("Error fetching blacklists:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlacklists();
  }, []);

  const filteredBlacklist = blacklist.filter(
    (b) =>
      b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.whatsapp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblock = async (item: BlacklistItem) => {
    if (!confirm(`Buka blokir untuk akun @${item.username}?`)) return;

    setBlacklist((prev) => prev.filter((b) => b.id !== item.id));

    try {
      await fetch(`/api/blacklists?username=${encodeURIComponent(item.username)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error removing from blacklist:", err);
      fetchBlacklists();
    }
  };

  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim()) return;

    const rawUser = formUsername.replace(/^@/, "").trim();
    const reason = formReason.trim() || "Indikasi Penipuan atau Penyalahgunaan";
    const phone = formWhatsapp.trim() || null;

    try {
      const res = await fetch("/api/blacklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roblox_username: rawUser,
          reason,
          phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newItem: BlacklistItem = {
          id: `BLK-${String(data.blacklist?.id || Date.now()).slice(-3)}`,
          username: rawUser,
          whatsapp: phone || "Belum terdata",
          reason,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: "Hari ini",
        };
        setBlacklist((prev) => [newItem, ...prev]);
      }
    } catch (err) {
      console.error("Error adding blacklist:", err);
    }

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
            onClick={fetchBlacklists}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Memuat..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Blacklist Container (Matching BloxyLucy 1-Column List) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Search & Meta Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari akun blacklist..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
            Menampilkan <span className="font-extrabold text-slate-900">{filteredBlacklist.length}</span> akun blacklist
          </div>
        </div>

        {/* Blacklist List Items (1-Column Full Width Rows) */}
        {filteredBlacklist.length === 0 ? (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <ShieldAlert className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              Tidak ada akun di dalam blacklist.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pink-100/60 border-t border-pink-100/60">
            {filteredBlacklist.map((item) => (
              <div
                key={item.id}
                className="py-4 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors hover:bg-pink-50/10 px-2 sm:px-3 rounded-2xl"
              >
                {/* Left Column: Username & Reason */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-rose-600 line-through tracking-tight font-mono">
                      @{item.username}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-wider shrink-0">
                      BLACKLISTED
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-2 flex-wrap">
                    <span>ID: <span className="text-slate-700">{item.id}</span></span>
                    <span className="text-slate-300">•</span>
                    <span>WA: <span className="text-emerald-600 font-bold">{item.whatsapp}</span></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400">Ditambahkan: {item.createdAt}</span>
                  </div>

                  {item.reason && (
                    <p className="text-xs text-rose-500 font-medium">
                      Alasan: <span className="text-slate-700">{item.reason}</span>
                    </p>
                  )}
                </div>

                {/* Right Column: Orders & Unblock Button */}
                <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 shrink-0">
                  <div className="text-left lg:text-right space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.totalOrders} Pesanan
                    </p>
                    <p className="text-sm sm:text-base font-black text-slate-900">
                      {formatRupiah(item.totalSpent)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUnblock(item)}
                    className="px-4 sm:px-5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs border border-emerald-200 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Buka Blokir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
