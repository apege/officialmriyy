"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  Upload,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobuxPackage, PaymentMethod } from "./OrderSection";
import { CartItem } from "./CartDrawer";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  selectedPackage: RobuxPackage;
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  whatsappNumber,
  setWhatsappNumber,
  selectedPackage,
  cartItems,
  paymentMethod,
}: CheckoutModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [orderCode] = useState(() => `MRY-${Math.floor(100000 + Math.random() * 900000)}`);

  // Calculate totals from cart or fallback to selectedPackage
  const effectiveItems =
    cartItems.length > 0
      ? cartItems
      : [{ package: selectedPackage, quantity: 1 }];

  const totalAmount = effectiveItems.reduce(
    (sum, item) => sum + item.package.price * item.quantity,
    0
  );

  const totalRobux = effectiveItems.reduce(
    (sum, item) => sum + item.package.amount * item.quantity,
    0
  );

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

  const itemsSummary = effectiveItems
    .map((item) => `${formatRobux(item.package.amount)} Robux (x${item.quantity})`)
    .join(", ");

  if (!isOpen) return null;

  const handleConfirmPaid = () => {
    setIsPaid(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff2a85", "#ff758c", "#ff7eb3", "#ffd1ff", "#10b981"],
    });
  };

  const waMessage = `Halo Admin official.mriyy, saya ingin menyelesaikan pesanan Top Up Robux:
• Kode Pesanan: ${orderCode}
• Username Roblox: ${username || "-"}
• No. WhatsApp: ${whatsappNumber || "-"}
• Item: ${itemsSummary}
• Total Robux: ${formatRobux(totalRobux)} Robux
• Total Pembayaran: ${formatRupiah(totalAmount)}
• Metode: WhatsApp Direct

Mohon segera diproses, terima kasih!`;

  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-pink-200 shadow-2xl p-6 sm:p-8 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isPaid ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Pesanan Sedang Diproses!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Terima kasih! Bukti transaksi kamu untuk kode pesanan{" "}
              <span className="font-bold text-[#ff2a85]">{orderCode}</span> telah kami terima.
              Robux sebanyak <span className="font-bold">{formatRobux(totalRobux)} Robux</span> akan otomatis masuk ke akun{" "}
              <span className="font-bold text-slate-900">{username || "Roblox Anda"}</span> dalam 5 - 10 menit.
            </p>

            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Username Roblox:</span>
                <span className="font-bold text-slate-800">{username || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor WhatsApp:</span>
                <span className="font-bold text-slate-800">{whatsappNumber || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Robux:</span>
                <span className="font-bold text-slate-800">{formatRobux(totalRobux)} Robux</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bayar:</span>
                <span className="font-bold text-[#ff2a85]">{formatRupiah(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">Diproses Otomatis ⚡</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi CS WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Details */
          <>
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#ff2a85] font-extrabold text-[11px] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Konfirmasi Pembayaran</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Detail Transaksi Top Up
              </h3>
              <p className="text-xs text-slate-500">
                Kode Pesanan: <span className="font-mono font-bold text-slate-700">{orderCode}</span>
              </p>
            </div>

            {/* Order Items Review */}
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Username Roblox:</span>
                <span className="font-bold text-slate-900">{username || "Belum diisi"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nomor WhatsApp:</span>
                <span className="font-bold text-slate-900">{whatsappNumber || "Belum diisi"}</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Paket Item:</span>
                <span className="font-bold text-slate-900 text-right">
                  {itemsSummary}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Robux:</span>
                <span className="font-bold text-slate-900">
                  {formatRobux(totalRobux)} Robux
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold text-[#ff2a85]">
                  {paymentMethod === "website" ? "QRIS (Website)" : "WhatsApp CS"}
                </span>
              </div>
              <div className="pt-2 border-t border-pink-200/70 flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-700">Total Tagihan:</span>
                <span className="font-black text-lg sm:text-xl text-[#ff2a85]">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            {/* Input WhatsApp if not yet provided */}
            {!whatsappNumber.trim() && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Masukkan Nomor WhatsApp:</span>
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl bg-pink-50/40 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-slate-900 font-medium text-xs sm:text-sm"
                />
              </div>
            )}

            {/* Payment Specific Content */}
            {paymentMethod === "website" ? (
              <div className="space-y-4">
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-black text-slate-700 tracking-wider uppercase mb-3">
                    SCAN QRIS UNTUK SEMUA E-WALLET & BANK
                  </div>

                  {/* QR Box */}
                  <div className="relative p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <div className="w-44 h-44 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                      <div className="absolute inset-2 bg-white rounded flex items-center justify-center p-1.5">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=official.mriyy-${orderCode}-${totalAmount}`}
                          alt="QRIS official.mriyy"
                          width={180}
                          height={180}
                          unoptimized
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-500 font-medium">
                    BCA, BRI, Mandiri, BNI, DANA, GoPay, OVO, ShopeePay, LinkAja
                  </p>
                </div>

                {/* Upload Bukti Transfer */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Upload Bukti Transfer (Opsional / Otomatis Terdeteksi):
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/30 hover:bg-pink-50 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-pink-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-600">
                      {uploadedFile ? uploadedFile : "Klik untuk upload screenshot transfer"}
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG atau WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadedFile(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmPaid}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-black text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span>Saya Sudah Bayar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* WhatsApp Order Option */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Layanan Admin WhatsApp 24 Jam</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Klik tombol di bawah untuk langsung terhubung dengan admin resmi official.mriyy di WhatsApp. Pesanan kamu akan diproses dan dibantu langkah demi langkah sampai Robux sukses mendarat.
                  </p>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleConfirmPaid}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Kirim Pesanan ke WhatsApp Admin</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
