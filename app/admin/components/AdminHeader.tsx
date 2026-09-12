"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, LogOut, Menu, X, ArrowRight, User, Phone, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { OrderItem, AdminTab } from "../types";

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pendingCount?: number;
  onRefreshData?: () => void;
  onToggleSidebar?: () => void;
  orders?: OrderItem[];
  onSelectOrder?: (order: OrderItem) => void;
  setActiveTab?: (tab: AdminTab) => void;
}

export default function AdminHeader({
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
  orders = [],
  onSelectOrder,
  setActiveTab,
}: AdminHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("officialmriyy_admin_auth");
    }
    router.push("/admin/login");
  };

  // Filter matching orders
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^#/, "");
    if (!q) return [];
    return orders
      .filter((o) => {
        const idMatch = o.id.toLowerCase().includes(q);
        const userMatch = o.username.toLowerCase().includes(q);
        const waMatch = o.whatsapp.toLowerCase().includes(q);
        return idMatch || userMatch || waMatch;
      })
      .slice(0, 6);
  }, [searchQuery, orders]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (order: OrderItem) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectItem(searchResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
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
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4 shadow-xs">
      {/* Mobile Hamburger Button */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] border border-pink-200 transition-all cursor-pointer shrink-0 active:scale-95"
          title="Buka Menu Sidebar"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search Bar with Autocomplete */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        
        <input
          type="text"
          value={searchQuery}
          onFocus={() => {
            if (searchQuery.trim()) setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Cari ID Transaksi, Username Roblox, atau No WA..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 focus:border-[#ff2a85] focus:bg-white text-xs sm:text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
            title="Hapus pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {isOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2.5 bg-pink-50/50 border-b border-pink-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Hasil Pencarian Transaksi</span>
              <span className="text-[#ff2a85] font-extrabold">{searchResults.length} Ditemukan</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-pink-50">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center space-y-1.5 text-slate-400">
                  <AlertCircle className="w-6 h-6 mx-auto text-pink-300" />
                  <p className="text-xs font-bold text-slate-600">Tidak ada transaksi yang cocok</p>
                  <p className="text-[11px] text-slate-400">
                    Coba ketikkan ID pesanan, username Roblox, atau nomor WhatsApp yang sesuai
                  </p>
                </div>
              ) : (
                searchResults.map((item, index) => {
                  const isHighlighted = selectedIndex === index;
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-200">
                      Pending
                    </span>
                  );
                  if (item.status === "processing") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-600 border border-sky-200">
                        Diproses
                      </span>
                    );
                  } else if (item.status === "completed") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Selesai
                      </span>
                    );
                  } else if (item.status === "cancelled") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                        Batal
                      </span>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isHighlighted ? "bg-pink-50/80" : "hover:bg-pink-50/40"
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs text-[#ff2a85]">
                            #{item.id}
                          </span>
                          {statusBadge}
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-700">
                          <span className="font-extrabold text-slate-900 flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-pink-500 shrink-0" />
                            @{item.username}
                          </span>

                          <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0">
                            <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                            {item.whatsapp}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2.5">
                        <div>
                          <p className="text-xs font-black text-slate-900">
                            {formatRobux(item.robuxAmount)} Robux
                          </p>
                          <p className="text-[11px] font-bold text-[#ff2a85]">
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        <div className="w-6 h-6 rounded-full bg-pink-100 text-[#ff2a85] flex items-center justify-center shrink-0">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Profile & Logout (Matching Reference Screenshot) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Profile Card */}
        <div className="flex items-center gap-2.5">
          {/* Circular Logo Avatar with Pink Ring */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-[#ff2a85] ring-offset-1 p-0.5 overflow-hidden shrink-0 bg-pink-50 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Admin Profile Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              official.mriyy
            </p>
            <p className="text-[10px] sm:text-[11px] font-extrabold text-[#ff2a85] leading-none mt-0.5">
              Super Admin
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 sm:h-8 w-px bg-pink-200 mx-1 sm:mx-1.5" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3.5 sm:px-4 py-2 rounded-full border border-pink-200 hover:border-pink-300 bg-white hover:bg-pink-50 text-[#ff2a85] font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
          title="Keluar dari Admin Panel"
        >
          <LogOut className="w-3.5 h-3.5 text-[#ff2a85]" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
