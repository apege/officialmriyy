"use client";

import React from "react";
import { Search, Bell, Sparkles, UserCheck, RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pendingCount: number;
  onRefreshData?: () => void;
}

export default function AdminHeader({
  searchQuery,
  setSearchQuery,
  pendingCount,
  onRefreshData,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ID Transaksi, Username Roblox, atau No WA..."
          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-pink-50/40 border border-pink-100 focus:border-[#ff2a85] focus:bg-white text-xs sm:text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Action Indicators & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Refresh button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Refresh Data Transaksi"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-700 transition-all cursor-pointer relative"
            title="Notifikasi Transaksi Baru"
          >
            <Bell className="w-4 h-4 text-[#ff2a85]" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff2a85] text-[9px] font-extrabold text-white animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Live Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-200" />
          <span>Sistem Aktif</span>
        </div>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-pink-100">
          <div className="w-8 h-8 rounded-full bg-[#ff2a85] text-white font-extrabold text-xs flex items-center justify-center shadow-xs border-2 border-pink-200">
            AM
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-black text-slate-800 leading-tight flex items-center gap-1">
              Admin Mriyy
              <UserCheck className="w-3 h-3 text-emerald-500" />
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-none">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
