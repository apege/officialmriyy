"use client";

import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Save,
  Power,
  Edit2,
  ShieldCheck,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";

interface PaymentGateway {
  id: string;
  name: string;
  category: "qris" | "bank" | "ewallet";
  accountName: string;
  accountNumber: string;
  active: boolean;
}

export default function PaymentSettings() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: "qris",
      name: "QRIS All Payment (BCA/DANA/GoPay/OVO/ShopeePay)",
      category: "qris",
      accountName: "official.mriyy Top Up",
      accountNumber: "NMID: ID1029384756102",
      active: true,
    },
    {
      id: "bca",
      name: "Bank BCA",
      category: "bank",
      accountName: "MRIYY STORE INDONESIA",
      accountNumber: "8830-1928-301",
      active: true,
    },
    {
      id: "mandiri",
      name: "Bank Mandiri",
      category: "bank",
      accountName: "MRIYY STORE INDONESIA",
      accountNumber: "137-00-1928301-2",
      active: true,
    },
    {
      id: "dana",
      name: "DANA",
      category: "ewallet",
      accountName: "MRIYY STORE",
      accountNumber: "0812-3456-7890",
      active: true,
    },
    {
      id: "gopay",
      name: "GoPay",
      category: "ewallet",
      accountName: "MRIYY STORE",
      accountNumber: "0812-3456-7890",
      active: true,
    },
    {
      id: "ovo",
      name: "OVO",
      category: "ewallet",
      accountName: "MRIYY STORE",
      accountNumber: "0812-3456-7890",
      active: true,
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    );
  };

  const handleAccountChange = (id: string, field: "accountName" | "accountNumber", value: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Metode & Rekening Pembayaran</span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#ff2a85] text-xs font-black">
              {gateways.filter((g) => g.active).length} Aktif
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Atur nomor rekening, nama pemilik akun, dan aktifkan/nonaktifkan saluran pembayaran
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#ff2a85] hover:bg-[#e60067] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Tersimpan!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Payment Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl bg-white border p-5 transition-all shadow-xs space-y-4 ${
              item.active ? "border-pink-100" : "border-slate-200 opacity-60 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${item.category === 'qris' ? 'bg-pink-100 text-[#ff2a85]' : 'bg-slate-100 text-slate-700'}`}>
                  {item.category === 'qris' ? <QrCode className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Status Toggle */}
              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-black border transition-all cursor-pointer ${
                  item.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {item.active ? "🟢 Aktif" : "🔴 Nonaktif"}
              </button>
            </div>

            {/* Account Info Form */}
            <div className="space-y-3 pt-2 border-t border-pink-50">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Pemilik Akun / Rekening
                </label>
                <input
                  type="text"
                  value={item.accountName}
                  onChange={(e) => handleAccountChange(item.id, "accountName", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-pink-50/30 border border-pink-100 focus:border-[#ff2a85] outline-none text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nomor Rekening / No E-Wallet / NMID
                </label>
                <input
                  type="text"
                  value={item.accountNumber}
                  onChange={(e) => handleAccountChange(item.id, "accountNumber", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-pink-50/30 border border-pink-100 focus:border-[#ff2a85] outline-none text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
