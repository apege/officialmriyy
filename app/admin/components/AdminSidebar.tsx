"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Users,
  ShieldAlert,
  MessageSquare,
  Wallet,
  CreditCard,
  Settings,
  ExternalLink,
  ShieldCheck,
  Power,
  MessageCircle,
  LogOut,
  Tag,
  X,
} from "lucide-react";
import { AdminTab } from "../types";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount?: number;
  processingCount?: number;
  completedCount?: number;
  cancelledCount?: number;
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  processingCount = 0,
  completedCount = 0,
  cancelledCount = 0,
  isStoreOpen,
  setIsStoreOpen,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("officialmriyy_admin_auth");
    }
    router.push("/admin/login");
  };

  const handleTabClick = (tab: AdminTab) => {
    setActiveTab(tab);
    if (onClose) {
      onClose();
    }
  };

  const SidebarContent = () => (
    <>
      {/* 1. FIXED TOP HEADER */}
      <div className="shrink-0 p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => onClose?.()}>
          <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="official.mriyy logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none block">
              official<span className="text-[#ff2a85]">.mriyy</span>
            </span>
            <span className="text-[10px] font-bold text-[#ff2a85] tracking-wider uppercase inline-flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              TOP UP ROBUX
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#ff2a85] transition-colors cursor-pointer"
            title="Tutup Menu"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE MIDDLE NAVIGATION AREA */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-2 space-y-4 min-h-0">
        {/* Main Dashboard */}
        <div>
          <button
            onClick={() => handleTabClick("overview")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-pink-100/80 text-[#ff2a85] shadow-xs"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#ff2a85]" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* ORDER MANAGEMENT */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            ORDER MANAGEMENT
          </p>

          <button
            onClick={() => handleTabClick("order_masuk")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "order_masuk"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Order Masuk</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-[#ff2a85]">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => handleTabClick("order_diproses")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "order_diproses"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Order Diproses</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-[#ff2a85]">
              {processingCount}
            </span>
          </button>

          <button
            onClick={() => handleTabClick("order_selesai")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "order_selesai"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            <span>Order Selesai</span>
          </button>

          <button
            onClick={() => handleTabClick("order_dibatalkan")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "order_dibatalkan"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Order Dibatalkan</span>
          </button>
        </div>

        {/* PRICELIST */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            PRICELIST
          </p>

          <button
            onClick={() => handleTabClick("products")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <Tag className="w-4 h-4 text-slate-400" />
            <span>Pricelist Robux</span>
          </button>
        </div>

        {/* PELANGGAN */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            PELANGGAN
          </p>

          <button
            onClick={() => handleTabClick("pelanggan")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "pelanggan"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Daftar Pelanggan</span>
          </button>

          <button
            onClick={() => handleTabClick("blacklist")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "blacklist"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Blacklist</span>
          </button>
        </div>

        {/* KONTEN & ULASAN */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            KONTEN & ULASAN
          </p>

          <button
            onClick={() => handleTabClick("testimoni")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "testimoni"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Kelola Testimoni</span>
          </button>
        </div>

        {/* KEUANGAN */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            KEUANGAN
          </p>

          <button
            onClick={() => handleTabClick("keuangan")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "keuangan"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <Wallet className="w-4 h-4 text-slate-400" />
            <span>Riwayat Pembayaran</span>
          </button>
        </div>

        {/* PENGATURAN */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            PENGATURAN
          </p>

          <button
            onClick={() => handleTabClick("settings")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-pink-100/80 text-[#ff2a85]"
                : "text-slate-600 hover:bg-pink-50/70 hover:text-[#ff2a85]"
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Pengaturan Toko</span>
          </button>
        </div>
      </nav>

      {/* 3. FIXED BOTTOM FOOTER AREA */}
      <div className="shrink-0 p-3 border-t border-pink-100 space-y-2 bg-white">
        {/* Support Help Card */}
        <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100 text-center space-y-2">
          <p className="text-xs font-black text-[#ff2a85]">Butuh Bantuan?</p>
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            Tim official.mriyy siap membantu kamu!
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-pink-100 text-slate-800 text-xs font-bold border border-pink-200 shadow-xs transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            <span>Chat Admin</span>
          </a>
        </div>

        {/* Footer links */}
        <div className="pt-1 flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 hover:text-[#ff2a85] transition-colors"
          >
            <span>Lihat Toko</span>
            <ExternalLink className="w-3 h-3 text-pink-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Visible only on lg and above) */}
      <aside className="hidden lg:flex lg:w-64 bg-white border-r border-pink-100 flex-col justify-between shrink-0 shadow-xs lg:h-screen lg:sticky lg:top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Slide-Over Drawer (Visible only on mobile/tablet when open) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-pink-100 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
