"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Users,
  Edit2,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Star,
  Share2,
  Send,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { OrderItem, AdminTab } from "../types";

interface OrderDetailViewProps {
  order: OrderItem;
  activeTab: AdminTab;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderItem["status"]) => void;
}

export default function OrderDetailView({
  order,
  activeTab,
  onBack,
  onUpdateStatus,
}: OrderDetailViewProps) {
  const [adminNote, setAdminNote] = useState(order.adminNotes || "");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fullOrder, setFullOrder] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [previewProofModal, setPreviewProofModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoadingDetail(true);
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setFullOrder(data.order);
            if (data.order.admin_notes) {
              setAdminNote(data.order.admin_notes);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [order.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} disalin ke clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
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

  // Dynamic back label based on activeTab
  const getBackLabel = () => {
    if (activeTab === "order_masuk") return "Kembali ke Order Masuk";
    if (activeTab === "order_diproses") return "Kembali ke Order Diproses";
    if (activeTab === "order_selesai") return "Kembali ke Order Selesai";
    if (activeTab === "order_dibatalkan") return "Kembali ke Order Dibatalkan";
    return "Kembali ke Daftar Transaksi";
  };

  const proofPath = fullOrder?.payment_proof_path || order.paymentProof;
  const robloxUserId = fullOrder?.roblox_user_id || order.robloxUserId || "5565988785";
  const customerNotes = fullOrder?.customer_notes || order.customerNotes;

  const whatsappNumber = order.whatsapp.startsWith("+")
    ? order.whatsapp
    : `+62${order.whatsapp.replace(/^0/, "")}`;

  const cleanOrderId = order.id.startsWith("MRY")
    ? order.id
    : `MRY${order.id.replace(/^[^0-9]+/, "")}`;

  // Review URL & WhatsApp Message for completed orders
  const reviewUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?token=${cleanOrderId}#testimoni`
    : `https://officialmriyy.com/?token=${cleanOrderId}#testimoni`;

  const reviewMessageText = `Halo kak @${order.username}! 👋✨

Terima kasih banyak telah melakukan top up Robux sebanyak *${formatRobux(order.robuxAmount)} Robux* di *official.mriyy*! 🎉

Pesanan dengan ID *#${cleanOrderId}* telah *SELESAI* diproses dan Robux sudah berhasil dikirimkan ke akun Roblox kamu.

Kami sangat menghargai feedback kamu. Mohon luangkan waktu 1 menit untuk memberikan ulasan & rating di link berikut ya kak:
👉 ${reviewUrl}

Terima kasih banyak dan selamat bermain Roblox! ⭐⭐⭐⭐⭐`;

  const reviewWaUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(reviewMessageText)}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-pink-500/30 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#ff2a85] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{getBackLabel()}</span>
      </button>

      {/* Order Header Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#ff2a85] tracking-tight font-mono">
            ORDER #{cleanOrderId}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {order.createdAt.includes("WIB")
              ? order.createdAt
              : "10 September 2026 pukul 16.57 WIB"}
          </p>
        </div>

        <div>
          {order.status === "pending" && (
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold shadow-2xs">
              Menunggu Pembayaran
            </span>
          )}
          {order.status === "processing" && (
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold shadow-2xs">
              Sedang Diproses
            </span>
          )}
          {order.status === "completed" && (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shadow-2xs">
              Selesai
            </span>
          )}
          {order.status === "cancelled" && (
            <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold shadow-2xs">
              Dibatalkan
            </span>
          )}
        </div>
      </div>

      {/* SPECIAL BANNER: KIRIM LINK REVIEW FOR COMPLETED ORDERS */}
      {order.status === "completed" && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-pink-50 to-emerald-50 border border-pink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#ff2a85] text-white flex items-center justify-center shadow-xs shrink-0">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-slate-900">
                  Kirim Link Review & Rating Testimoni
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Order Selesai
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Kirim pesan ulasan otomatis ke nomor WhatsApp <span className="font-bold text-slate-800">({whatsappNumber})</span> atau salin link review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => copyToClipboard(reviewUrl, "Link Review")}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              title="Salin URL Link Review"
            >
              {copiedField === "Link Review" ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#ff2a85]" />
              )}
              <span>Salin Link Review</span>
            </button>

            <button
              onClick={() => copyToClipboard(reviewMessageText, "Pesan Ulasan WhatsApp")}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              title="Salin Format Lengkap Pesan WA"
            >
              {copiedField === "Pesan Ulasan WhatsApp" ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Salin Pesan WA</span>
            </button>

            <a
              href={reviewWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Link Review</span>
            </a>
          </div>
        </div>
      )}

      {/* UBAH STATUS CEPAT Action Bar */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400">
          UBAH STATUS CEPAT:
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              onUpdateStatus(order.id, "processing");
              showToast("Status pesanan diubah ke: Sedang Diproses");
            }}
            className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Proses Pesanan
          </button>

          <button
            onClick={() => {
              onUpdateStatus(order.id, "completed");
              showToast("Status pesanan diubah ke: Selesai");
            }}
            className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Selesaikan Order
          </button>

          <button
            onClick={() => {
              onUpdateStatus(order.id, "cancelled");
              showToast("Status pesanan diubah ke: Dibatalkan");
            }}
            className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Batalkan
          </button>

          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-100" />
            <span>Chat Pelanggan</span>
          </a>
        </div>
      </div>

      {/* CARD 1: DETAIL PESANAN */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 text-[#ff2a85] flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <span>DETAIL PESANAN</span>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-pink-50 pb-2">
            <span>PRODUK</span>
            <span>HARGA</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 shrink-0">
                <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">
                {formatRobux(order.robuxAmount)} Robux
              </span>
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              {formatRupiah(order.price)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-pink-50 pt-3">
            <span className="text-xs font-bold text-slate-600">Metode Pembayaran</span>
            {order.paymentMethod === "whatsapp" ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black">
                WHATSAPP
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-pink-50 border border-pink-300 text-[#ff2a85] text-xs font-black">
                WEBSITE
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-2 border-t border-pink-100 pt-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#ff2a85]">
              TOTAL PEMBAYARAN
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#ff2a85]">
              {formatRupiah(order.price)}
            </span>
          </div>

          {/* Photo Proof Container */}
          {proofPath ? (
            <div className="p-4 rounded-2xl bg-pink-50/30 border border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Foto Bukti Transfer Pembeli
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Terlampir
                </span>
              </div>

              <div
                onClick={() => setPreviewProofModal(proofPath)}
                className="relative w-full max-w-sm mx-auto aspect-video rounded-2xl overflow-hidden border border-pink-200 bg-slate-900 group cursor-pointer shadow-xs flex items-center justify-center"
              >
                <img
                  src={proofPath}
                  alt="Bukti Transfer Pembeli"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/70 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Foto Penuh (Perbesar)
                  </span>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 font-medium">
                Klik foto di atas untuk memperbesar bukti pembayaran
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-center text-xs text-slate-500 font-medium">
              {loadingDetail
                ? "Memuat data bukti transfer..."
                : "Foto bukti transfer telah dibersihkan oleh sistem retensi atau tidak diunggah."}
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: INFORMASI PELANGGAN */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 text-[#ff2a85] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span>INFORMASI PELANGGAN</span>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          {/* Username */}
          <div className="flex items-center justify-between py-2 border-b border-pink-50">
            <span className="text-slate-500 font-bold">Username</span>
            <a
              href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(order.username)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-[#ff2a85] text-sm flex items-center gap-1 hover:underline"
            >
              <span>@{order.username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* User ID Roblox */}
          <div className="flex items-center justify-between py-2 border-b border-pink-50">
            <span className="text-slate-500 font-bold">User ID Roblox</span>
            <div className="flex items-center gap-2 font-mono font-bold text-slate-800 text-sm">
              <span>{robloxUserId}</span>
              <button
                onClick={() => copyToClipboard(robloxUserId, "User ID Roblox")}
                className="p-1 hover:bg-pink-50 rounded text-slate-400 hover:text-[#ff2a85] transition-colors cursor-pointer"
                title="Salin ID"
              >
                {copiedField === "User ID Roblox" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* No WhatsApp */}
          <div className="flex items-center justify-between py-2 border-b border-pink-50">
            <span className="text-slate-500 font-bold">No. WhatsApp</span>
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                {whatsappNumber}
              </a>
              <button
                onClick={() => copyToClipboard(whatsappNumber, "No. WhatsApp")}
                className="p-1 hover:bg-pink-50 rounded text-slate-400 hover:text-[#ff2a85] transition-colors cursor-pointer"
                title="Salin No WhatsApp"
              >
                {copiedField === "No. WhatsApp" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Catatan Pelanggan */}
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 font-bold">Catatan Pelanggan</span>
            <span className="font-medium text-slate-700">
              {customerNotes
                ? customerNotes
                : order.paymentMethod === "whatsapp"
                ? "Pemesanan via WhatsApp Direct"
                : "Sudah scan QRIS otomatis"}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: CATATAN ADMIN */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 text-[#ff2a85] flex items-center justify-center">
            <Edit2 className="w-4 h-4" />
          </div>
          <span>CATATAN ADMIN</span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Tulis catatan untuk order ini (hanya admin)..."
            className="w-full p-4 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all resize-none"
          />

          <button
            onClick={async () => {
              try {
                await fetch("/api/orders", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    order_code: order.id,
                    admin_notes: adminNote,
                  }),
                });
                showToast("Catatan admin berhasil disimpan!");
              } catch (err) {
                console.error("Error saving admin note:", err);
              }
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-black text-xs shadow-md shadow-pink-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Simpan Catatan
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Payment Proof Preview */}
      {previewProofModal && (
        <div
          onClick={() => setPreviewProofModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-pink-100 pb-2">
              <span className="text-xs font-black text-slate-900">
                Bukti Transfer - Order #{cleanOrderId}
              </span>
              <button
                onClick={() => setPreviewProofModal(null)}
                className="p-1.5 rounded-full bg-pink-50 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full max-h-[75vh] rounded-2xl overflow-hidden border border-pink-100 flex items-center justify-center bg-slate-900">
              <img
                src={previewProofModal}
                alt="Bukti Transfer Penuh"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <p className="text-center text-xs font-bold text-slate-500">
              Klik tombol close atau klik luar modal untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
