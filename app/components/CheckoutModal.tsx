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
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobuxPackage, PaymentMethod } from "./OrderSection";
import { CartItem } from "./CartDrawer";
import { compressImage } from "@/lib/image-compression";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  whatsappNumber: string;
  selectedPackage?: RobuxPackage | null;
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
  whatsappCS?: string;
  qrisImageUrl?: string;
  storeName?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  whatsappNumber,
  selectedPackage,
  cartItems = [],
  paymentMethod,
  whatsappCS = "6285624695885",
  qrisImageUrl = "/qris.png",
  storeName = "official.mriyy",
}: CheckoutModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string>("");

  // Calculate totals from cart or fallback to selectedPackage
  const effectiveItems =
    cartItems && cartItems.length > 0
      ? cartItems
      : selectedPackage
      ? [{ package: selectedPackage, quantity: 1 }]
      : [];

  const totalAmount = effectiveItems.reduce(
    (sum, item) => sum + (item.package ? item.package.price * (item.quantity || 1) : 0),
    0
  );

  const totalRobux = effectiveItems.reduce(
    (sum, item) => sum + (item.package ? item.package.amount * (item.quantity || 1) : 0),
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
    .filter((item) => item.package)
    .map((item) => `${formatRobux(item.package.amount)} Robux (x${item.quantity || 1})`)
    .join(", ");

  if (!isOpen) return null;

  const currentOrderCode = orderCode || "MRY...";
  const targetWaNumber = whatsappCS.replace(/\D/g, "");

  const waQrisMessage = `Halo Admin ${storeName}, saya sudah melakukan pembayaran Top Up Robux via QRIS Website:
• Kode Pesanan: ${currentOrderCode}
• Username Roblox: ${username || "-"}
• No. WhatsApp: ${whatsappNumber || "-"}
• Item: ${itemsSummary}
• Total Robux: ${formatRobux(totalRobux)} Robux
• Total Pembayaran: ${formatRupiah(totalAmount)}
• Metode: QRIS Website (Bukti Pembayaran Terlampir)

Mohon segera dicek dan diproses pengiriman Robux-nya, terima kasih!`;

  const waDirectMessage = `Halo Admin ${storeName}, saya ingin menyelesaikan pesanan Top Up Robux:
• Kode Pesanan: ${currentOrderCode}
• Username Roblox: ${username || "-"}
• No. WhatsApp: ${whatsappNumber || "-"}
• Item: ${itemsSummary}
• Total Robux: ${formatRobux(totalRobux)} Robux
• Total Pembayaran: ${formatRupiah(totalAmount)}
• Metode: WhatsApp Direct

Mohon bantuannya untuk proses transaksi, terima kasih!`;

  const waQrisUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(waQrisMessage)}`;
  const waDirectUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(waDirectMessage)}`;
  const activeWaUrl = paymentMethod === "website" ? waQrisUrl : waDirectUrl;

  const handleConfirmPaid = async () => {
    if (!uploadedFilePreview) {
      setFormError("Bukti transfer pembayaran QRIS wajib diunggah!");
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roblox_username: username.trim(),
          customer_phone: whatsappNumber.trim(),
          robux: totalRobux,
          price: totalAmount,
          payment_method: "Website",
          product_id: selectedPackage?.id || null,
          customer_notes: itemsSummary,
          payment_proof_path: uploadedFilePreview,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Gagal membuat pesanan.");
        setIsSubmitting(false);
        return;
      }

      if (data.order && data.order.order_code) {
        setOrderCode(data.order.order_code);
      }

      setIsPaid(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff2a85", "#ff758c", "#ff7eb3", "#ffd1ff", "#10b981"],
      });

      // Otomatis buka WhatsApp untuk konfirmasi pesanan ke admin
      const generatedWaUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(
        waQrisMessage.replace(currentOrderCode, data.order?.order_code || currentOrderCode)
      )}`;
      window.open(generatedWaUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roblox_username: username.trim(),
          customer_phone: whatsappNumber.trim(),
          robux: totalRobux,
          price: totalAmount,
          payment_method: "WhatsApp",
          product_id: selectedPackage?.id || null,
          customer_notes: itemsSummary,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Gagal membuat pesanan.");
        setIsSubmitting(false);
        return;
      }

      if (data.order && data.order.order_code) {
        setOrderCode(data.order.order_code);
      }

      setIsPaid(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#ff2a85", "#34d399"],
      });
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-pink-200 shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {isPaid ? (
          /* Success Screen */
          <div className="text-center py-4 sm:py-6 space-y-3 sm:space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Pesanan Sedang Diproses!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Terima kasih! Bukti transaksi kamu untuk kode pesanan{" "}
              <span className="font-bold text-[#ff2a85]">#{orderCode}</span> telah kami terima dan masuk ke sistem database.
              Robux sebanyak <span className="font-bold">{formatRobux(totalRobux)} Robux</span> akan otomatis masuk ke akun{" "}
              <span className="font-bold text-slate-900">@{username}</span> dalam 5 - 10 menit.
            </p>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Username Roblox:</span>
                <span className="font-bold text-slate-800">@{username}</span>
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <a
                href={activeWaUrl}
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#ff2a85] font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider mb-1.5 sm:mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Konfirmasi Pembayaran</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900">
                Detail Transaksi Top Up
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Sistem Checkout Otomatis • official.mriyy
              </p>
            </div>

            {/* Error Banner if validation fails */}
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Account Info & Order Review */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Username Roblox:</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                  @{username}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Nomor WhatsApp:</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-pink-200">
                  {whatsappNumber}
                </span>
              </div>

              <div className="pt-2 border-t border-pink-200/70 space-y-2">
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
                <div className="pt-2 border-t border-pink-200/70 flex items-center justify-between text-xs sm:text-base">
                  <span className="font-bold text-slate-700">Total Tagihan:</span>
                  <span className="font-black text-base sm:text-xl text-[#ff2a85]">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Specific Content */}
            {paymentMethod === "website" ? (
              <div className="space-y-3 sm:space-y-4">
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] sm:text-xs font-black text-slate-700 tracking-wider uppercase mb-2 sm:mb-3">
                    SCAN QRIS UNTUK SEMUA E-WALLET & BANK
                  </div>

                  {/* QR Box */}
                  <div className="relative p-2.5 sm:p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
                      <div className="relative w-full h-full flex items-center justify-center p-1 sm:p-1.5">
                        <img
                          src={qrisImageUrl || "/qris.png"}
                          alt={`QRIS ${storeName}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    BCA, BRI, Mandiri, BNI, DANA, GoPay, OVO, ShopeePay, LinkAja
                  </p>
                </div>

                {/* Upload Bukti Transfer (Wajib) */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>
                      Upload Bukti Transfer <span className="text-rose-500">* (Wajib)</span>:
                    </span>
                    {uploadedFile && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terupload
                      </span>
                    )}
                  </label>

                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {uploadedFilePreview ? (
                          <img
                            src={uploadedFilePreview}
                            alt="Bukti Transfer"
                            className="w-10 h-10 rounded-lg object-cover border border-emerald-300 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                            IMG
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{uploadedFile}</p>
                          <p className="text-[10px] text-emerald-700">Bukti transfer siap dikonfirmasi</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadedFilePreview(null);
                        }}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors shrink-0"
                        title="Hapus / Ganti File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center p-3.5 sm:p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                        formError && !uploadedFile
                          ? "border-rose-400 bg-rose-50/50"
                          : "border-pink-200 bg-pink-50/30 hover:bg-pink-50"
                      }`}
                    >
                      <Upload className="w-5 h-5 text-[#ff2a85] mb-1" />
                      <span className="text-xs font-semibold text-slate-700 text-center">
                        Klik untuk upload foto / screenshot bukti transfer
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                        Format: PNG, JPG, JPEG atau WEBP (Maks 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFile(file.name);
                            try {
                              const compressed = await compressImage(file, 1000, 0.75);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setUploadedFilePreview(event.target?.result as string);
                              };
                              reader.readAsDataURL(compressed);
                            } catch {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setUploadedFilePreview(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                            if (formError) setFormError(null);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmPaid}
                  className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-black text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      <span>Saya Sudah Bayar & Kirim Bukti</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* WhatsApp Order Option */
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Layanan Admin WhatsApp 24 Jam</span>
                  </div>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">
                    Klik tombol di bawah untuk langsung terhubung dengan admin resmi official.mriyy di WhatsApp. Pesanan kamu akan diproses dan dibantu langkah demi langkah sampai Robux sukses mendarat.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    await handleWhatsAppCheckout();
                    window.open(waDirectUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menghubungkan ke WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
                      <span>Kirim Pesanan ke WhatsApp Admin</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
