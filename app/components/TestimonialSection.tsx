"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Lock,
  MessageCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

interface TestimonialItem {
  id: number;
  initial: string;
  initialBg: string;
  username: string;
  time: string;
  rating: number;
  comment: string;
  robuxAmount: string;
  hasProofImage?: boolean;
  proofImageUrl?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    initial: "L",
    initialBg: "bg-rose-500",
    username: "@Londoireng61",
    time: "Baru saja",
    rating: 4,
    comment: "Sedikit slowrespon ehee overall semuanya aman kok, robux langsung landing!",
    robuxAmount: "4.200 Robux",
    hasProofImage: true,
    proofImageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    initial: "C",
    initialBg: "bg-pink-600",
    username: "@Crasiel17",
    time: "15 menit yang lalu",
    rating: 5,
    comment: "Mantap banget min, proses cepet bgt 5 menit langsung masuk ke akun Roblox ku! Rekomendasi poll 🔥",
    robuxAmount: "2.200 Robux",
    hasProofImage: true,
    proofImageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    initial: "R",
    initialBg: "bg-purple-600",
    username: "@Rian_Gamer99",
    time: "1 jam yang lalu",
    rating: 5,
    comment: "Top up 10.000 robux tanpa password, akun aman 100%. CS ramah banget di WhatsApp.",
    robuxAmount: "10.000 Robux",
    hasProofImage: true,
    proofImageUrl:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    initial: "D",
    initialBg: "bg-fuchsia-500",
    username: "@DindaCutie",
    time: "2 jam yang lalu",
    rating: 5,
    comment: "Harga paling murah dibanding toko lain, legal terpercaya!",
    robuxAmount: "1.800 Robux",
    hasProofImage: false,
  },
];

interface TestimonialSectionProps {
  onOpenCS: () => void;
}

export default function TestimonialSection({
  onOpenCS,
}: TestimonialSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section
      id="testimoni"
      className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 scroll-mt-20"
    >
      <div className="rounded-3xl bg-white border border-pink-100 p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-2xl bg-[#ff2a85] text-white flex items-center justify-center shadow-xs shrink-0">
            <Star className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Testimoni Member
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Apa kata mereka yang sudah top up Robux di official.mriyy
            </p>
          </div>
        </div>

        {/* 2 Column Layout: Left (Review Cards), Right (Verification Lock Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl bg-pink-50/20 border border-pink-100/90 p-4 sm:p-5 hover:bg-pink-50/50 transition-all space-y-3"
              >
                {/* User Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full ${t.initialBg} text-white flex items-center justify-center font-black text-sm shadow-xs`}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                          {t.username}
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {t.time}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-slate-800 text-xs font-bold shadow-xs">
                    <div className="relative w-4 h-4 shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{t.robuxAmount}</span>
                    {t.hasProofImage && (
                      <span className="text-emerald-600 font-semibold text-[11px] ml-1 flex items-center gap-0.5">
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
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-pink-200 bg-slate-900 cursor-pointer group shadow-xs"
                    >
                      <Image
                        src={t.proofImageUrl}
                        alt="Bukti transaksi"
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-1 right-1 p-1 rounded-md bg-black/60 text-white text-[9px] flex items-center gap-0.5">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>Bukti</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Verification Lock Card (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border-2 border-dashed border-pink-200/90 bg-pink-50/20 p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4">
              {/* Lock Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#ff2a85] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <Lock className="w-7 h-7" />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-300/80 text-[#ff2a85] font-extrabold text-[10px] tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ULASAN TERVERIFIKASI PEMBELI</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-black text-slate-900">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span>Hubungi CS / Minta Link Review</span>
              </button>
            </div>
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
