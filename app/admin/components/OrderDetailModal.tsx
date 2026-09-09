"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { OrderItem } from "../types";

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderItem["status"]) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

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

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(order.username)}&backgroundColor=ffd5dc,ffb3c6,ffdfba`;

  const handleCopyWaText = () => {
    const text = `Halo kak ${order.username}! 👋\n\nPesanan Top Up Robux di official.mriyy:\n📌 ID Transaksi: ${order.id}\n💎 Nominal: ${formatRobux(order.robuxAmount)} Robux\n💰 Total Bayar: ${formatRupiah(order.price)}\n STATUS: ${order.status.toUpperCase()}\n\nRobux kamu sedang diproses/dikirimkan oleh admin ⚡. Terima kasih sudah mempercayakan topup di official.mriyy!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-[#ff2a85] uppercase tracking-wider block">
              DETAIL TRANSAKSI ROBUX
            </span>
            <h2 className="text-lg font-black text-slate-900 font-mono">
              {order.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-[#ff2a85] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge & Actions */}
        <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Status Saat Ini</p>
            {order.status === "pending" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Pembayaran</span>
              </span>
            )}
            {order.status === "processing" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700">
                <Zap className="w-3.5 h-3.5" />
                <span>Sedang Diproses</span>
              </span>
            )}
            {order.status === "completed" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transaksi Selesai</span>
              </span>
            )}
            {order.status === "cancelled" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700">
                <X className="w-3.5 h-3.5" />
                <span>Dibatalkan</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {order.status !== "completed" && (
              <button
                onClick={() => onUpdateStatus(order.id, "completed")}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Set Selesai
              </button>
            )}
            {order.status === "pending" && (
              <button
                onClick={() => onUpdateStatus(order.id, "processing")}
                className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Set Diproses
              </button>
            )}
          </div>
        </div>

        {/* Customer Account Box */}
        <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-3 shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Informasi Akun Roblox & Kontak</span>
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-pink-100 border border-pink-200 relative shrink-0">
              <img src={avatarUrl} alt={order.username} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-400 uppercase">Username Roblox</p>
              <p className="text-sm font-black text-slate-900 truncate">
                {order.username}
              </p>
              <a
                href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-100" />
                <span>{order.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-2.5 shadow-xs">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>Rincian Item Robux</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-1 border-b border-pink-50">
            <span className="text-slate-500 font-medium">Paket Item:</span>
            <span className="font-extrabold text-slate-900 flex items-center gap-1">
              <Image src="/robux.webp" alt="Robux" width={16} height={16} />
              {formatRobux(order.robuxAmount)} Robux
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-pink-50">
            <span className="text-slate-500 font-medium">Metode Pembayaran:</span>
            <span className="font-bold text-slate-800">
              {order.paymentMethod === "website" ? "Website (QRIS)" : "WhatsApp"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-pink-50">
            <span className="text-slate-500 font-medium">Waktu Transaksi:</span>
            <span className="font-bold text-slate-800">{order.createdAt}</span>
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <span className="text-slate-700 font-extrabold">Total Pembayaran:</span>
            <span className="font-black text-base text-[#ff2a85]">
              {formatRupiah(order.price)}
            </span>
          </div>
        </div>

        {/* Action WhatsApp Quick Reply */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleCopyWaText}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-all cursor-pointer border border-emerald-200"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-600" />}
            <span>Salin Pesan WA Customer</span>
          </button>

          <a
            href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-100" />
            <span>Chat WA Langsung</span>
          </a>
        </div>
      </div>
    </div>
  );
}
