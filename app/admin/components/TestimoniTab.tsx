"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Plus,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Reply,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  X,
  UploadCloud,
  ImageIcon,
  MessageSquare,
  Sparkles,
  CornerDownRight,
} from "lucide-react";

export interface TestimonialData {
  id: string;
  username: string;
  initial: string;
  initialBg: string;
  rating: number;
  time: string;
  comment: string;
  robuxAmount: string;
  orderTag?: string;
  isVerified: boolean;
  isVisible: boolean; // Tampil / Sembunyikan
  hasProofImage: boolean;
  proofImageUrl?: string;
  adminReply?: {
    text: string;
    repliedAt: string;
  };
}

const ROBUX_PACKAGES = [
  "100 Robux",
  "500 Robux",
  "1.000 Robux",
  "1.800 Robux Populer",
  "2.200 Robux Promo",
  "3.700 Robux Reguler",
  "4.200 Robux",
  "10.000 Robux",
  "25.000 Robux Sultan",
  "33.000 Robux Sultan",
];

export default function TestimoniTab() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<
    "semua" | "aktif" | "sembunyi" | "perlu_balasan"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialData | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formRobuxAmount, setFormRobuxAmount] = useState("4.200 Robux");
  const [formCustomRobux, setFormCustomRobux] = useState(false);
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formProofUrl, setFormProofUrl] = useState("");

  // Reply Modal states
  const [replyingItem, setReplyingItem] = useState<TestimonialData | null>(null);
  const [replyText, setReplyText] = useState("");

  // Lightbox Image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials?approved_only=false&_t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.testimonials && Array.isArray(data.testimonials)) {
          const mapped: TestimonialData[] = data.testimonials.map((t: any, index: number) => {
            const rawUser = t.name.replace(/^@/, "");
            return {
              id: `TESTI-${String(t.id).padStart(3, "0")}`,
              username: rawUser,
              initial: rawUser.charAt(0).toUpperCase() || "M",
              initialBg: [
                "bg-rose-500",
                "bg-pink-600",
                "bg-purple-600",
                "bg-fuchsia-500",
                "bg-indigo-500",
                "bg-sky-500",
                "bg-amber-500",
              ][index % 7],
              rating: t.rating || 5,
              time: t.created_at
                ? new Date(t.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })
                : "Baru saja",
              comment: t.message,
              robuxAmount: t.order_code ? `#${t.order_code}` : "Robux",
              orderTag: t.order_code ? `#${t.order_code}` : undefined,
              isVerified: true,
              isVisible: t.status === "approved",
              hasProofImage: !!t.image_path,
              proofImageUrl: t.image_path || undefined,
              adminReply: t.admin_reply || undefined,
            };
          });
          setTestimonials(mapped);
        }
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTestimonials();
  }, []);

  // Stats calculation
  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.isVisible).length;
  const hiddenCount = testimonials.filter((t) => !t.isVisible).length;
  const needReplyCount = testimonials.filter(
    (t) => !t.adminReply || !t.adminReply.text
  ).length;

  const avgRating =
    totalCount > 0
      ? (
          testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalCount
        ).toFixed(1)
      : "5.0";

  // Filtered list
  const filteredList = testimonials.filter((item) => {
    // Tab filter
    if (filterTab === "aktif" && !item.isVisible) return false;
    if (filterTab === "sembunyi" && item.isVisible) return false;
    if (filterTab === "perlu_balasan" && item.adminReply?.text) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUser = item.username.toLowerCase().includes(q);
      const matchComment = item.comment.toLowerCase().includes(q);
      const matchRobux = item.robuxAmount.toLowerCase().includes(q);
      return matchUser || matchComment || matchRobux;
    }

    return true;
  });

  // Handle open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormUsername("");
    setFormRating(5);
    setFormComment("");
    setFormRobuxAmount("4.200 Robux");
    setFormCustomRobux(false);
    setFormIsVisible(true);
    setFormProofUrl("");
    setIsModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (item: TestimonialData) => {
    setEditingItem(item);
    setFormUsername(item.username);
    setFormRating(item.rating);
    setFormComment(item.comment);
    setFormRobuxAmount(item.robuxAmount);
    setFormCustomRobux(false);
    setFormIsVisible(item.isVisible);
    setFormProofUrl(item.proofImageUrl || "");
    setIsModalOpen(true);
  };

  // Handle submit Create / Edit
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formComment.trim()) {
      alert("Mohon isi username dan ulasan!");
      return;
    }

    const cleanUsername = formUsername.replace(/^@/, "").trim();

    if (editingItem) {
      // Edit existing
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                username: cleanUsername,
                rating: formRating,
                comment: formComment,
                robuxAmount: formRobuxAmount,
                orderTag: `#${formRobuxAmount}`,
                isVisible: formIsVisible,
                hasProofImage: !!formProofUrl.trim(),
                proofImageUrl: formProofUrl.trim() || undefined,
              }
            : t
        )
      );

      const rawId = parseInt(editingItem.id.replace(/\D/g, ""), 10);
      if (!isNaN(rawId)) {
        try {
          await fetch("/api/testimonials", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: rawId,
              status: formIsVisible ? "approved" : "rejected",
            }),
          });
        } catch (err) {
          console.error("Error updating testimonial:", err);
        }
      }
      showToast(`Testimoni @${cleanUsername} berhasil diperbarui!`);
    } else {
      // Create new
      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanUsername,
            message: formComment,
            rating: formRating,
            image_path: formProofUrl.trim() || null,
            order_code: formRobuxAmount,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const newItem: TestimonialData = {
            id: `TESTI-${String(data.testimonial?.id || Date.now()).slice(-4)}`,
            username: cleanUsername,
            initial: cleanUsername.charAt(0).toUpperCase() || "M",
            initialBg: "bg-pink-600",
            rating: formRating,
            time: "Baru saja",
            comment: formComment,
            robuxAmount: formRobuxAmount,
            orderTag: `#${formRobuxAmount}`,
            isVerified: true,
            isVisible: true,
            hasProofImage: !!formProofUrl.trim(),
            proofImageUrl: formProofUrl.trim() || undefined,
          };
          setTestimonials((prev) => [newItem, ...prev]);
        }
      } catch (err) {
        console.error("Error saving testimonial:", err);
      }
      showToast(`Testimoni @${cleanUsername} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  // Handle toggle visibility (Tampil / Sembunyikan)
  const handleToggleVisibility = async (id: string) => {
    const target = testimonials.find((t) => t.id === id);
    if (!target) return;
    const nextVal = !target.isVisible;

    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isVisible: nextVal } : t))
    );

    const rawId = parseInt(id.replace(/\D/g, ""), 10);
    if (!isNaN(rawId)) {
      try {
        await fetch("/api/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: rawId,
            status: nextVal ? "approved" : "rejected",
          }),
        });
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }

    showToast(
      nextVal
        ? `Testimoni @${target.username} sekarang DITAMPILKAN di website.`
        : `Testimoni @${target.username} DISEMBUNYIKAN dari website.`
    );
  };

  // Handle delete testimonial
  const handleDeleteTestimonial = async (item: TestimonialData) => {
    if (!confirm(`Hapus testimoni dari @${item.username}?`)) return;

    setTestimonials((prev) => prev.filter((t) => t.id !== item.id));

    const rawId = parseInt(item.id.replace(/\D/g, ""), 10);
    if (!isNaN(rawId)) {
      try {
        await fetch(`/api/testimonials?id=${rawId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Error deleting testimonial:", err);
      }
    }
    showToast(`Testimoni @${item.username} berhasil dihapus.`);
  };

  // Handle open Reply modal
  const handleOpenReplyModal = (item: TestimonialData) => {
    setReplyingItem(item);
    setReplyText(item.adminReply?.text || "");
  };

  // Handle submit Reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingItem) return;

    const rawId = parseInt(replyingItem.id.replace(/\D/g, ""), 10);
    const replyObj = replyText.trim()
      ? { text: replyText.trim(), repliedAt: "Baru saja" }
      : null;

    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === replyingItem.id ? { ...t, adminReply: replyObj || undefined } : t
      )
    );

    if (!isNaN(rawId)) {
      try {
        await fetch("/api/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: rawId,
            admin_reply: replyObj,
          }),
        });
      } catch (err) {
        console.error("Error saving admin reply:", err);
      }
    }

    if (!replyText.trim()) {
      showToast(`Balasan untuk @${replyingItem.username} dihapus.`);
    } else {
      showToast(`Balasan berhasil dikirim untuk @${replyingItem.username}!`);
    }

    setReplyingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#ff2a85]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Testimoni & Ulasan
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Moderasi ulasan pembeli, tambah ulasan manual, balas testimoni, dan kontrol publikasi di website
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#ff2a85] hover:bg-[#e02073] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
          </button>

          <button
            onClick={() => {
              fetchTestimonials();
              showToast("Data testimoni berhasil diperbarui!");
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 font-bold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Memuat..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ulasan */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            TOTAL ULASAN
          </p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalCount}
          </p>
        </div>

        {/* Rating Rata-rata */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            RATING RATA-RATA
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500">
              {avgRating}
            </span>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Aktif (Tampil) */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            AKTIF (TAMPIL)
          </p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {activeCount}
          </p>
        </div>

        {/* Perlu Balasan */}
        <div className="bg-white border border-pink-100 rounded-3xl p-5 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            PERLU BALASAN
          </p>
          <p className="text-2xl sm:text-3xl font-black text-[#ff2a85] mt-1">
            {needReplyCount}
          </p>
        </div>
      </div>

      {/* 3. Main Testimonials Container (Matching BloxyLucy 1-Column List Design) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterTab("semua")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterTab === "semua"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-pink-50/50 hover:bg-pink-100 text-slate-600"
              }`}
            >
              Semua ({totalCount})
            </button>

            <button
              onClick={() => setFilterTab("aktif")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterTab === "aktif"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-pink-50/50 hover:bg-pink-100 text-slate-600"
              }`}
            >
              Aktif ({activeCount})
            </button>

            <button
              onClick={() => setFilterTab("sembunyi")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterTab === "sembunyi"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-pink-50/50 hover:bg-pink-100 text-slate-600"
              }`}
            >
              Disembunyikan ({hiddenCount})
            </button>

            <button
              onClick={() => setFilterTab("perlu_balasan")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterTab === "perlu_balasan"
                  ? "bg-[#ff2a85] text-white shadow-xs"
                  : "bg-pink-50/50 hover:bg-pink-100 text-slate-600"
              }`}
            >
              Perlu Balasan ({needReplyCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari username atau ulasan..."
              className="w-full pl-11 pr-4 py-2 rounded-full bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Testimonial List Items (1-Column Full Width) */}
        {filteredList.length === 0 ? (
          <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
              <MessageSquare className="w-7 h-7 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-slate-800">
              Tidak ada ulasan ditemukan
            </p>
            <p className="text-xs text-slate-400">
              Coba sesuaikan filter atau kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pink-100/60 border-t border-pink-100/60">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className={`py-5 sm:py-6 space-y-3.5 transition-colors px-2 sm:px-3 rounded-2xl ${
                  item.isVisible
                    ? "hover:bg-pink-50/10"
                    : "bg-slate-50/60 opacity-75"
                }`}
              >
                {/* Top Row: User Avatar, Badges & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${item.initialBg} text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0`}
                    >
                      {item.initial}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          @{item.username}
                        </span>

                        {item.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Terverifikasi
                          </span>
                        )}

                        <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#ff2a85] text-[10px] font-black">
                          {item.robuxAmount}
                        </span>

                        {item.orderTag && (
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {item.orderTag}
                          </span>
                        )}
                      </div>

                      {/* Rating & Time */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-slate-200 text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top-Right Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 flex-wrap">
                    {/* Tampil / Sembunyikan Toggle */}
                    <button
                      onClick={() => handleToggleVisibility(item.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                        item.isVisible
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tampil</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          <span>Sembunyi</span>
                        </>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>

                    {/* Balas */}
                    <button
                      onClick={() => handleOpenReplyModal(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                        item.adminReply?.text
                          ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                          : "bg-pink-50 border-pink-200 text-[#ff2a85] hover:bg-pink-100"
                      }`}
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>
                        {item.adminReply?.text ? "Edit Balasan" : "Balas"}
                      </span>
                    </button>

                    {/* Hapus */}
                    <button
                      onClick={() => handleDeleteTestimonial(item)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Testimoni"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="pl-0 sm:pl-13">
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>

                  {/* Proof Image Box */}
                  {item.hasProofImage && item.proofImageUrl && (
                    <div className="mt-3">
                      <div
                        onClick={() => setPreviewImage(item.proofImageUrl || null)}
                        className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl border border-pink-100 bg-pink-50/30 hover:bg-pink-50 cursor-pointer transition-all group"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={item.proofImageUrl}
                            alt="Bukti Pembeli"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-extrabold text-slate-900 group-hover:text-[#ff2a85] transition-colors">
                            Lihat Foto Bukti Pembeli
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Klik untuk memperbesar
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Reply Box */}
                  {item.adminReply && item.adminReply.text && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/70 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-black text-[#ff2a85]">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Balasan Admin official.mriyy</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.adminReply.repliedAt}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium pl-5 leading-relaxed">
                        {item.adminReply.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. MODAL TAMBAH / EDIT TESTIMONI (Matching Screenshots 2 & 3) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 border border-pink-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <h2 className="text-lg font-black text-slate-900">
                {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitModal} className="space-y-4">
              {/* Username Roblox */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Username Roblox <span className="text-[#ff2a85]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#ff2a85]">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="Contoh: APG_Channel11"
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Rating Kepuasan */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2">
                  Rating Kepuasan (1 - 5 Bintang)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                        star <= formRating
                          ? "bg-amber-50 border-amber-300 text-amber-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formRating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-black text-amber-600">
                    {formRating} Bintang
                  </span>
                </div>
              </div>

              {/* Isi Ulasan Testimoni */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Isi Ulasan Testimoni <span className="text-[#ff2a85]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tuliskan pengalaman / ulasan kepuasan pembeli..."
                  className="w-full p-4 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                />
              </div>

              {/* Foto Bukti Transfer / Landing (Opsional) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Foto Bukti Transfer / Landing (Opsional)
                </label>

                {formProofUrl ? (
                  <div className="p-3 rounded-2xl border border-pink-200 bg-pink-50/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={formProofUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Foto bukti terpasang
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Format JPG/PNG online
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormProofUrl("")}
                      className="px-3 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      const url = prompt(
                        "Masukkan URL Gambar Bukti Transaksi (misal: link imgur atau unsplash):",
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                      );
                      if (url) setFormProofUrl(url);
                    }}
                    className="border-2 border-dashed border-pink-200 hover:border-[#ff2a85] bg-pink-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-[#ff2a85] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Klik untuk upload foto bukti
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Format JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Paket Robux / Kode Order (Opsional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800">
                    Paket Robux / Kode Order (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormCustomRobux(!formCustomRobux)}
                    className="text-[11px] font-bold text-[#ff2a85] hover:underline"
                  >
                    {formCustomRobux ? "Pilih dari Dropdown" : "Pilih dari List atau Ketik"}
                  </button>
                </div>

                {formCustomRobux ? (
                  <input
                    type="text"
                    value={formRobuxAmount}
                    onChange={(e) => setFormRobuxAmount(e.target.value)}
                    placeholder="Contoh: 4.200 Robux Promo"
                    className="w-full px-4 py-3 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-bold text-slate-900 outline-none transition-all"
                  />
                ) : (
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-pink-100 text-[#ff2a85] flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <select
                      value={formRobuxAmount}
                      onChange={(e) => setFormRobuxAmount(e.target.value)}
                      className="w-full pl-11 pr-8 py-3 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {ROBUX_PACKAGES.map((pkg) => (
                        <option key={pkg} value={pkg}>
                          {pkg}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Checkbox Publikasi */}
              <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsVisible}
                  onChange={(e) => setFormIsVisible(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff2a85] focus:ring-[#ff2a85] accent-[#ff2a85] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 select-none">
                  Publikasikan dan Tampilkan Testimoni di Website
                </span>
              </label>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#ff2a85] hover:bg-[#e02073] text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition-all cursor-pointer active:scale-95"
                >
                  {editingItem ? "Simpan Perubahan" : "Tambah Testimoni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL BALAS TESTIMONI */}
      {replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-pink-100">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <h2 className="text-base font-black text-slate-900">
                Balas Testimoni @{replyingItem.username}
              </h2>
              <button
                onClick={() => setReplyingItem(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs text-slate-600 italic">
              &ldquo;{replyingItem.comment}&rdquo;
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Tulis Balasan Admin
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Contoh: Terima kasih banyak atas ulasannya kak! Selamat bermain..."
                  className="w-full p-3.5 rounded-2xl bg-pink-50/20 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingItem(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#ff2a85] hover:bg-[#e02073] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  Kirim Balasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. LIGHTBOX PREVIEW FOTO BUKTI */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-lg max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
            <img
              src={previewImage}
              alt="Foto Bukti Pembeli"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <p className="text-center text-xs font-bold text-slate-600 mt-2">
              Klik di mana saja untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
