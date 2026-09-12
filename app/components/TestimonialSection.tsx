"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Lock,
  MessageCircle,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Send,
} from "lucide-react";
import { compressImage } from "@/lib/image-compression";

interface TestimonialItem {
  id: number | string;
  initial: string;
  initialBg: string;
  username: string;
  time: string;
  rating: number;
  comment: string;
  robuxAmount: string;
  hasProofImage?: boolean;
  proofImageUrl?: string;
  adminReply?: {
    text: string;
    repliedAt?: string;
  } | null;
}

interface TestimonialSectionProps {
  onOpenCS: () => void;
}

const BG_COLORS = [
  "bg-rose-500",
  "bg-pink-600",
  "bg-purple-600",
  "bg-fuchsia-500",
  "bg-indigo-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-emerald-500",
];

export default function TestimonialSection({
  onOpenCS,
}: TestimonialSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Token & Review Form States
  const [token, setToken] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<
    "idle" | "validating" | "valid" | "already_used" | "invalid"
  >("idle");
  const [tokenOrderData, setTokenOrderData] = useState<{
    order_code: string;
    username: string;
    robux_amount?: number;
    price?: number;
  } | null>(null);

  // Form Fields
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formatRobuxDisplay = (val: any) => {
    if (val === null || val === undefined || val === "") return "Robux Instant";
    if (typeof val === "string" && val.toLowerCase().includes("robux")) return val;
    const num = typeof val === "number" ? val : parseInt(String(val).replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num <= 0) return "Robux Instant";
    return `${new Intl.NumberFormat("id-ID").format(num)} Robux`;
  };

  // Fetch approved testimonials (Cached)
  const loadTestimonials = (forceFresh = false) => {
    const url = forceFresh
      ? `/api/testimonials?approved_only=true&_t=${Date.now()}`
      : `/api/testimonials?approved_only=true`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          const mapped: TestimonialItem[] = data.testimonials.map((t: any, index: number) => {
            const rawName = t.name.startsWith("@") ? t.name : `@${t.name}`;
            const cleanChar = t.name.replace(/^@/, "").charAt(0).toUpperCase() || "M";
            return {
              id: t.id,
              initial: cleanChar,
              initialBg: BG_COLORS[index % BG_COLORS.length],
              username: rawName,
              time: t.created_at
                ? new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                : "Baru saja",
              rating: t.rating || 5,
              comment: t.message,
              robuxAmount: formatRobuxDisplay(t.robux || t.robux_amount || t.robuxAmount),
              hasProofImage: !!t.image_path,
              proofImageUrl: t.image_path || undefined,
              adminReply: t.admin_reply,
            };
          });
          setTestimonials(mapped);
        }
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
      });
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Check URL query param for token
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token") || urlParams.get("reviewToken");

    if (urlToken) {
      setToken(urlToken);
      validateReviewToken(urlToken);
    }
  }, []);

  const validateReviewToken = async (t: string) => {
    try {
      setTokenStatus("validating");
      const res = await fetch(`/api/testimonials/validate?token=${encodeURIComponent(t)}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        setTokenStatus("valid");
        setTokenOrderData(data.order);
      } else if (data.reason === "already_used") {
        setTokenStatus("already_used");
      } else {
        setTokenStatus("invalid");
      }
    } catch (err) {
      console.error("Token validation error:", err);
      setTokenStatus("invalid");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compress to lightweight WebP image
      const compressed = await compressImage(file, 1000, 0.75);
      setProofFile(compressed);

      // Create preview URL
      const previewUrl = URL.createObjectURL(compressed);
      setProofPreview(previewUrl);
    } catch (err) {
      console.error("Error compressing proof image:", err);
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    if (proofPreview) {
      URL.revokeObjectURL(proofPreview);
      setProofPreview(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setSubmitError("Silakan tulis pesan ulasan kamu terlebih dahulu.");
      return;
    }

    if (!tokenOrderData || !token) {
      setSubmitError("Token pesanan tidak valid.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let imagePath: string | null = null;

      // Upload compressed image if attached
      if (proofFile) {
        const formData = new FormData();
        formData.append("file", proofFile);
        formData.append("folder", "testimonials");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imagePath = uploadData.url;
        }
      }

      // Submit testimonial with single-use token verification
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          order_code: tokenOrderData.order_code,
          name: tokenOrderData.username,
          message: message.trim(),
          rating: rating,
          image_path: imagePath,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Gagal mengirim ulasan");
      }

      setSubmitSuccess(true);
      setTokenStatus("already_used");
      loadTestimonials();
    } catch (err: any) {
      console.error("Submit review error:", err);
      setSubmitError(err.message || "Terjadi kesalahan saat mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "Sangat Puas ⭐⭐⭐⭐⭐";
      case 4:
        return "Puas ⭐⭐⭐⭐";
      case 3:
        return "Cukup Baik ⭐⭐⭐";
      case 2:
        return "Kurang Puas ⭐⭐";
      case 1:
        return "Kecewa ⭐";
      default:
        return "Sangat Puas ⭐⭐⭐⭐⭐";
    }
  };

  return (
    <section
      id="testimoni"
      className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 pb-24 sm:pb-8 scroll-mt-20"
    >
      <div className="rounded-3xl bg-white border border-pink-100 p-4 sm:p-8 lg:p-10 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#ff2a85] text-white flex items-center justify-center shadow-xs shrink-0">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Testimoni Member
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Apa kata mereka yang sudah top up Robux di official.mriyy
            </p>
          </div>
        </div>

        {/* 2 Column Layout: Left (Review Cards), Right (Verification Lock Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Left Column: Reviews List */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl bg-pink-50/20 border border-pink-100/90 p-3.5 sm:p-5 hover:bg-pink-50/50 transition-all space-y-2.5 sm:space-y-3"
              >
                {/* User Header */}
                <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${t.initialBg} text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shrink-0`}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                          {t.username}
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] sm:text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-0.5">
                        {t.time}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                          i < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>

                {/* Robux Package Badge & Proof Tag */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-pink-200 text-slate-800 text-[11px] sm:text-xs font-bold shadow-xs flex-wrap">
                    <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{t.robuxAmount}</span>
                    {t.hasProofImage && (
                      <span className="text-emerald-600 font-semibold text-[10px] sm:text-[11px] ml-1 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ada Foto Bukti</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Attachment Proof Image (if exists) */}
                {t.hasProofImage && t.proofImageUrl && (
                  <div className="pt-1">
                    <div
                      onClick={() => setSelectedImage(t.proofImageUrl || null)}
                      className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-pink-200 bg-slate-900 cursor-pointer group shadow-xs"
                    >
                      <Image
                        src={t.proofImageUrl}
                        alt="Bukti transaksi"
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-1 right-1 p-0.5 sm:p-1 rounded-md bg-black/60 text-white text-[8px] sm:text-[9px] flex items-center gap-0.5">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>Bukti</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Dynamic Action Box (Verified Review Form / Used Notice / Lock Card) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {/* 1. Loading State */}
            {tokenStatus === "validating" && (
              <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/20 p-8 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#ff2a85] animate-spin" />
                <p className="text-xs font-bold text-slate-700">
                  Memvalidasi Token Pesanan...
                </p>
              </div>
            )}

            {/* 2. Valid Token State: Interactive Review Form (Compact & Sleek) */}
            {tokenStatus === "valid" && tokenOrderData && (
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white to-pink-50/20 border border-pink-300 p-4 sm:p-5 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b border-pink-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      TOKEN REVIEW VALID
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-pink-100 text-[#ff2a85] text-[10px] font-black font-mono">
                    #{tokenOrderData.order_code}
                  </span>
                </div>

                {/* Title & Customer info */}
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
                    <span>Beri Ulasan Pesanan</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ulasan dari <strong className="text-slate-800">@{tokenOrderData.username}</strong> • <strong className="text-[#ff2a85]">{formatRobuxDisplay((tokenOrderData as any).robux || tokenOrderData.robux_amount)}</strong>
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-2.5">
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Rating Kepuasan:</span>
                      <span className="text-[10px] font-extrabold text-[#ff2a85]">
                        {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-pink-50/50 p-1.5 rounded-xl border border-pink-200/80 w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-0.5 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                              (hoverRating !== null ? star <= hoverRating : star <= rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Message Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Tulis Ulasan Kamu:
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Contoh: Proses cepat banget kurang dari 5 menit Robux langsung masuk, terpercaya! 🔥"
                      className="w-full p-2.5 rounded-xl bg-white border border-pink-200 focus:border-[#ff2a85] focus:ring-1 focus:ring-pink-500/20 outline-none text-xs text-slate-800 placeholder:text-slate-400 transition-all resize-none shadow-2xs font-medium"
                      required
                    />
                  </div>

                  {/* Optional Proof Image Upload (Compact Inline) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Foto Bukti (Opsional):
                    </label>

                    {proofPreview ? (
                      <div className="relative w-full h-16 rounded-xl overflow-hidden border border-pink-200 bg-slate-900 flex items-center justify-center group">
                        <img
                          src={proofPreview}
                          alt="Preview Bukti"
                          className="h-full w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveProof}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="border border-dashed border-pink-200 hover:border-[#ff2a85] rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer bg-pink-50/20 hover:bg-pink-50/40 transition-all">
                        <div className="flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-[#ff2a85] shrink-0" />
                          <span className="text-[11px] font-bold text-slate-700">
                            Pilih Screenshot Transaksi
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold text-[#ff2a85] bg-pink-100/80 px-2 py-0.5 rounded-md">
                          Browse
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Error Alert */}
                  {submitError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-black text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim Ulasan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Ulasan Sekarang</span>
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-slate-400 text-center font-medium">
                    🔒 Token ini hanya dapat digunakan 1 kali per order untuk mencegah spam.
                  </p>
                </form>
              </div>
            )}

            {/* 3. Already Used Token State */}
            {tokenStatus === "already_used" && (
              <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/30 p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  ULASAN SUDAH TERKIRIM
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {submitSuccess ? "Terima Kasih Banyak! 🎉" : "Link Ulasan Sudah Digunakan"}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm">
                  {submitSuccess
                    ? "Ulasan kamu telah berhasil dipublikasikan secara langsung di halaman testimoni."
                    : "Token pesanan ini sudah pernah digunakan untuk memberikan ulasan. Setiap pesanan dibatasi 1 ulasan untuk menjamin keaslian data."}
                </p>
              </div>
            )}

            {/* 4. Invalid Token State */}
            {tokenStatus === "invalid" && (
              <div className="rounded-3xl border-2 border-rose-200 bg-rose-50/30 p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                  TOKEN TIDAK VALID
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Token Ulasan Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm">
                  Kode token ulasan ini salah atau tidak terdaftar pada pesanan yang valid.
                </p>
                <button
                  onClick={onOpenCS}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Hubungi CS WhatsApp</span>
                </button>
              </div>
            )}

            {/* 5. Idle State (No Token in URL) - Default Locked Card */}
            {tokenStatus === "idle" && (
              <div className="rounded-3xl border-2 border-dashed border-pink-200/90 bg-pink-50/20 p-4 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                {/* Lock Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#ff2a85] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-pink-100/70 border border-pink-300/80 text-[#ff2a85] font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>ULASAN TERVERIFIKASI PEMBELI</span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-black text-slate-900">
                  Form Ulasan Khusus Pembeli
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                  Untuk menjaga ulasan 100% asli & bebas spam, formulir ini hanya
                  dapat diisi melalui <strong className="text-slate-800 font-bold">Link Token Review</strong> yang dikirimkan Admin setelah pesanan Robux selesai diproses.
                </p>

                {/* Action Button */}
                <button
                  onClick={onOpenCS}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  <span>Hubungi CS / Minta Link Review</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Proof Image */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-lg max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
            <img
              src={selectedImage}
              alt="Bukti Transfer"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <p className="text-center text-xs font-bold text-slate-600 mt-2">
              Klik di mana saja untuk menutup
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
