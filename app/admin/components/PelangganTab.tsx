"use client";

import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Phone,
  Layers,
} from "lucide-react";

export interface CustomerItem {
  id: string;
  username: string;
  robloxDisplay?: string;
  robloxUserId?: string;
  whatsapp: string;
  totalOrders: number;
  totalSpent: number;
  status: "AKTIF" | "BLACKLIST";
  lastOrderDate?: string;
}

export default function PelangganTab() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const [ordersRes, blacklistRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/blacklists"),
      ]);

      let ordersList: any[] = [];
      let blacklistUsers = new Set<string>();

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        if (oData.orders && Array.isArray(oData.orders)) {
          ordersList = oData.orders;
        }
      }

      if (blacklistRes.ok) {
        const bData = await blacklistRes.json();
        if (bData.blacklists && Array.isArray(bData.blacklists)) {
          bData.blacklists.forEach((b: any) =>
            blacklistUsers.add(b.roblox_username.toLowerCase())
          );
        }
      }

      if (ordersList.length > 0) {
        const customerMap = new Map<string, CustomerItem>();
        ordersList.forEach((ord: any) => {
          const userKey = (ord.roblox_username || "anonymous").toLowerCase();
          const existing = customerMap.get(userKey);

          const spent = ord.order_status !== "cancelled" ? Number(ord.price) || 0 : 0;
          const isBlk = blacklistUsers.has(userKey);

          if (existing) {
            existing.totalOrders += 1;
            existing.totalSpent += spent;
            existing.status = isBlk ? "BLACKLIST" : existing.status;
          } else {
            customerMap.set(userKey, {
              id: `CUST-${String(customerMap.size + 1).padStart(3, "0")}`,
              username: ord.roblox_username || "User",
              robloxDisplay: ord.roblox_username || "User",
              robloxUserId: ord.roblox_user_id || undefined,
              whatsapp: ord.customer_phone || "WhatsApp Direct",
              totalOrders: 1,
              totalSpent: spent,
              status: isBlk ? "BLACKLIST" : "AKTIF",
              lastOrderDate: ord.created_at
                ? new Date(ord.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })
                : "Hari ini",
            });
          }
        });
        setCustomers(Array.from(customerMap.values()));
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.username.toLowerCase().includes(q) ||
      (c.robloxDisplay && c.robloxDisplay.toLowerCase().includes(q)) ||
      (c.robloxUserId && c.robloxUserId.toLowerCase().includes(q)) ||
      c.whatsapp.toLowerCase().includes(q)
    );
  });

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleToggleBlacklist = async (cust: CustomerItem) => {
    const isBlacklisted = cust.status === "BLACKLIST";
    const nextStatus = isBlacklisted ? "AKTIF" : "BLACKLIST";

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === cust.id ? { ...item, status: nextStatus } : item
      )
    );

    try {
      if (isBlacklisted) {
        await fetch(`/api/blacklists?username=${encodeURIComponent(cust.username)}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/blacklists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roblox_username: cust.username,
            reason: "Diblokir oleh Admin dari daftar pelanggan",
            phone: cust.whatsapp !== "WhatsApp Direct" ? cust.whatsapp : null,
          }),
        });
      }
    } catch (err) {
      console.error("Error toggling blacklist for customer:", err);
    }

    setToastMsg(
      isBlacklisted
        ? `Akun @${cust.username} berhasil diaktifkan kembali`
        : `Akun @${cust.username} telah dimasukkan ke daftar Blacklist`
    );

    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom-5">
          <ShieldAlert className="w-4 h-4 text-[#ff2a85]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Daftar Pelanggan
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Data pembeli yang otomatis diagregasi langsung dari transaksi real database
          </p>
        </div>

        <button
          onClick={() => {
            fetchCustomers();
            setToastMsg("Data pelanggan berhasil diperbarui!");
            setTimeout(() => setToastMsg(null), 2500);
          }}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Memuat..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* 2. Main Customers Container (Matching BloxyLucy 1-Column List) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Search & Count Meta Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari username, ID Roblox, atau WhatsApp..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
            Menampilkan{" "}
            <span className="font-extrabold text-slate-900">
              {filteredCustomers.length}
            </span>{" "}
            pelanggan
          </div>
        </div>

        {/* Customer List Rows (1-Column Full Width) */}
        {filteredCustomers.length === 0 ? (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <Users className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              Belum ada data pelanggan
            </p>
            <p className="text-xs text-slate-400">
              Coba ubah kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pink-100/60 border-t border-pink-100/60">
            {filteredCustomers.map((cust) => {
              const displayName =
                cust.robloxDisplay && cust.robloxDisplay !== cust.username
                  ? `@${cust.username} (@${cust.robloxDisplay})`
                  : `@${cust.username}`;

              const isBlacklisted = cust.status === "BLACKLIST";

              return (
                <div
                  key={cust.id}
                  className="py-4 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors hover:bg-pink-50/10 px-2 sm:px-3 rounded-2xl"
                >
                  {/* Left Column: Customer Username & Meta */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-sm sm:text-base text-[#ff2a85] font-mono tracking-tight">
                        {displayName}
                      </span>
                      {isBlacklisted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black tracking-wide shrink-0">
                          <ShieldAlert className="w-3 h-3" />
                          BLACKLIST
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black tracking-wide shrink-0">
                          <UserCheck className="w-3 h-3" />
                          AKTIF
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>ID: {cust.robloxUserId || "-"}</span>
                      <span className="text-slate-300">•</span>
                      <span>WA: {cust.whatsapp}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">Order terakhir: {cust.lastOrderDate || "Hari ini"}</span>
                    </div>
                  </div>

                  {/* Middle & Right: Spent & Action Button */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 shrink-0">
                    <div className="text-left lg:text-right space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {cust.totalOrders}x order
                      </p>
                      <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                        {formatRupiah(cust.totalSpent)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleBlacklist(cust)}
                      className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isBlacklisted
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-xs"
                          : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs"
                      }`}
                    >
                      {isBlacklisted ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Batal Blacklist</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Blacklist</span>
                        </>
                      )}
                    </button>
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

