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
  const [packages, setPackages] = useState<ExtendedPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<ExtendedPackage | null>(null);

  // Form State: Only Robux amount and Price (Tags & Categories are 100% automated)
  const [formAmount, setFormAmount] = useState<number>(3000);
  const [formPrice, setFormPrice] = useState<number>(55000);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?all=true&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const mapped: ExtendedPackage[] = data.products.map((p: any) => ({
            id: p.id,
            amount: Number(p.robux),
            price: Number(p.price),
            category: p.category || "reguler",
            tag: p.tag,
            inStock: p.is_active ?? true,
          }));
          setPackages(mapped);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleToggleStock = async (id: number) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    const nextState = !target.inStock;

    // Optimistic UI
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: nextState } : p))
    );

    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: `${formatRobux(target.amount)} Robux`,
          robux: target.amount,
          price: target.price,
          is_active: nextState,
        }),
      });
    } catch (err) {
      console.error("Error toggling stock:", err);
      fetchProducts();
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm("Yakin ingin menghapus paket produk ini?")) return;

    setPackages((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      fetchProducts();
    }
  };

  const handleOpenAddModal = () => {
    setEditingPkg(null);
    setFormAmount(3000);
    setFormPrice(55000);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ExtendedPackage) => {
    setEditingPkg(pkg);
    setFormAmount(pkg.amount);
    setFormPrice(pkg.price);
    setIsAddModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const productName = `${formatRobux(formAmount)} Robux`;

    if (editingPkg) {
      // Optimistic update
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                amount: Number(formAmount),
                price: Number(formPrice),
              }
            : p
        )
      );

      try {
        await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPkg.id,
            name: productName,
            robux: Number(formAmount),
            price: Number(formPrice),
            is_active: editingPkg.inStock ?? true,
          }),
        });
        fetchProducts();
      } catch (err) {
        console.error("Error updating product:", err);
      }
    } else {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productName,
            robux: Number(formAmount),
            price: Number(formPrice),
            is_active: true,
          }),
        });

        if (res.ok) {
          fetchProducts();
        }
      } catch (err) {
        console.error("Error creating product:", err);
      }
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <span>{loading ? "Memuat..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#e60067] hover:from-[#e60067] hover:to-[#be1251] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Nominal Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Package Grid Cards */}
      {packages.length === 0 && !loading ? (
        <div className="rounded-3xl bg-white border border-pink-100 p-8 text-center space-y-3">
          <Package className="w-10 h-10 text-pink-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Belum ada paket produk di database.</p>
          <p className="text-xs text-slate-400">Klik &quot;Tambah Nominal Baru&quot; untuk menambahkan paket.</p>
        </div>
      ) : (
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
      )}

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
                  type="text"
                  inputMode="numeric"
                  value={formAmount > 0 ? new Intl.NumberFormat("id-ID").format(formAmount) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setFormAmount(raw ? Number(raw) : 0);
                  }}
                  required
                  placeholder="Contoh: 2.200"
                  className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Harga Jual (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formPrice > 0 ? new Intl.NumberFormat("id-ID").format(formPrice) : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setFormPrice(raw ? Number(raw) : 0);
                    }}
                    required
                    placeholder="Contoh: 45.000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white outline-none text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
