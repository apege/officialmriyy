"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Flame,
  Crown,
  Package,
  X,
  PlusCircle,
} from "lucide-react";
import { RobuxPackage, ROBUX_PACKAGES } from "@/app/components/OrderSection";

interface ExtendedPackage extends RobuxPackage {
  inStock?: boolean;
}

export default function ProductsTab() {
  const [packages, setPackages] = useState<ExtendedPackage[]>(
    ROBUX_PACKAGES.map((p) => ({ ...p, inStock: true }))
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<ExtendedPackage | null>(null);

  // Form State
  const [formAmount, setFormAmount] = useState<number>(3000);
  const [formPrice, setFormPrice] = useState<number>(55000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(65000);
  const [formTag, setFormTag] = useState<"PROMO" | "POPULER" | "SULTAN" | "NONE">("NONE");
  const [formCategory, setFormCategory] = useState<"populer" | "promo" | "sultan" | "reguler">("reguler");

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

  const handleToggleStock = (id: number) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleDeletePackage = (id: number) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenAddModal = () => {
    setEditingPkg(null);
    setFormAmount(3000);
    setFormPrice(55000);
    setFormOriginalPrice(65000);
    setFormTag("NONE");
    setFormCategory("reguler");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ExtendedPackage) => {
    setEditingPkg(pkg);
    setFormAmount(pkg.amount);
    setFormPrice(pkg.price);
    setFormOriginalPrice(pkg.originalPrice || 0);
    setFormTag(pkg.tag || "NONE");
    setFormCategory(pkg.category);
    setIsAddModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const tagVal = formTag === "NONE" ? undefined : formTag;

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                amount: Number(formAmount),
                price: Number(formPrice),
                originalPrice: formOriginalPrice > 0 ? Number(formOriginalPrice) : undefined,
                tag: tagVal,
                category: formCategory,
              }
            : p
        )
      );
    } else {
      const newPkg: ExtendedPackage = {
        id: Date.now(),
        amount: Number(formAmount),
        price: Number(formPrice),
        originalPrice: formOriginalPrice > 0 ? Number(formOriginalPrice) : undefined,
        tag: tagVal,
        category: formCategory,
        inStock: true,
      };
      setPackages((prev) => [...prev, newPkg]);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Bar (Matching Screenshot 6) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Nominal Baru</span>
        </button>
      </div>

      {/* 2. Package Grid Cards (Matching Screenshot 6 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl bg-white border p-4 sm:p-5 transition-all shadow-xs flex flex-col justify-between space-y-4 ${
              pkg.inStock
                ? "border-pink-100 hover:border-pink-300"
                : "border-slate-200 opacity-60 bg-slate-50"
            }`}
          >
            {/* Top Card Row: Coin, Nominal + Badge, Status Pill */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Gold Robux Coin Icon */}
                <div className="relative w-9 h-9 shrink-0 mt-0.5">
                  <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-sm text-slate-900">
                      {formatRobux(pkg.amount)} Robux
                    </span>

                    {/* Tag Badges */}
                    {pkg.tag === "PROMO" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#ff2a85] text-white text-[8px] font-black uppercase tracking-wider">
                        <Flame className="w-2.5 h-2.5 fill-white" />
                        <span>PROMO</span>
                      </span>
                    )}
                    {pkg.tag === "SULTAN" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-black uppercase tracking-wider">
                        <Crown className="w-2.5 h-2.5 fill-white" />
                        <span>SULTAN</span>
                      </span>
                    )}
                    {pkg.tag === "POPULER" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-purple-600 text-white text-[8px] font-black uppercase tracking-wider">
                        <span>POPULER</span>
                      </span>
                    )}
                  </div>

                  <p className="font-black text-xs text-[#ff2a85]">
                    {formatRupiah(pkg.price)}
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                  pkg.inStock
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-slate-100 text-slate-400 border-slate-200"
                }`}
              >
                {pkg.inStock ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Bottom Card Row: Toggle Link & Action Buttons */}
            <div className="pt-3 border-t border-pink-50 flex items-center justify-between">
              <button
                onClick={() => handleToggleStock(pkg.id)}
                className="text-[11px] font-bold text-slate-500 hover:text-[#ff2a85] transition-colors cursor-pointer"
              >
                {pkg.inStock ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(pkg)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-[#ff2a85] hover:bg-pink-50 transition-all cursor-pointer"
                  title="Edit Nominal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Hapus Nominal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#ff2a85]" />
                <span>{editingPkg ? "Edit Paket Robux" : "Tambah Paket Robux Baru"}</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-[#ff2a85] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jumlah Robux
                </label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  required
                  placeholder="Contoh: 2200"
                  className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                    placeholder="Contoh: 45000"
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Harga Coret (Rp)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    placeholder="Opsional, misal: 52000"
                    className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Badge / Tag
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="NONE">Tanpa Badge</option>
                    <option value="PROMO">PROMO</option>
                    <option value="POPULER">POPULER</option>
                    <option value="SULTAN">SULTAN</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kategori Tab
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] outline-none text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="reguler">Reguler</option>
                    <option value="promo">Promo</option>
                    <option value="populer">Populer</option>
                    <option value="sultan">Paket Sultan</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
