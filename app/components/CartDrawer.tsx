"use client";

import React from "react";
import Image from "next/image";
import { X, ShoppingBag, ArrowRight, Zap, ShieldCheck, Plus, Minus, Trash2 } from "lucide-react";
import { RobuxPackage } from "./OrderSection";

export interface CartItem {
  package: RobuxPackage;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (pkgId: number, delta: number) => void;
  onRemoveItem: (pkgId: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.package ? item.package.price * (item.quantity || 1) : 0),
    0
  );

  const totalRobux = cartItems.reduce(
    (sum, item) => sum + (item.package ? item.package.amount * (item.quantity || 1) : 0),
    0
  );

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen max-w-md bg-white shadow-2xl border-l border-pink-100 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-pink-50 border border-pink-200 text-[#ff2a85] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Keranjang Belanja
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  {totalItemsCount} Item Robux di keranjang
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body / Cart Items */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-3xl bg-pink-50 text-pink-300 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-700">
                  Keranjang masih kosong
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Silakan klik tanda (+) pada pilihan paket Robux untuk menambahkan ke keranjang.
                </p>
              </div>
            ) : (
              cartItems
                .filter((item) => Boolean(item.package))
                .map((item) => (
                <div
                  key={item.package.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-pink-50/30 border border-pink-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-pink-200 p-1 shrink-0 flex items-center justify-center shadow-xs">
                        <Image
                          src="/robux.webp"
                          alt="Robux"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                          {formatRobux(item.package.amount)} Robux
                        </h4>
                        <p className="text-xs font-black text-[#ff2a85]">
                          {formatRupiah(item.package.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.package.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Counter */}
                  <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                      Jumlah:
                    </span>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-pink-200 px-2 py-1 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.package.id, -1)}
                        className="w-5 h-5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#ff2a85] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-800 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.package.id, 1)}
                        className="w-5 h-5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#ff2a85] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Guarantee Badge */}
            {cartItems.length > 0 && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-medium leading-tight">
                  Garansi 100% uang kembali jika Robux gagal masuk ke akun Anda.
                </span>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-pink-100 bg-white space-y-3">
              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Total Robux</span>
                  <span className="font-bold text-slate-700">
                    {formatRobux(totalRobux)} Robux
                  </span>
                </div>
                <div className="pt-2 border-t border-pink-100 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-800">Total Pembayaran</span>
                  <span className="font-black text-base sm:text-lg text-[#ff2a85]">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#f43f7e] hover:from-[#e60067] hover:to-[#e11d67] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 shrink-0" />
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
