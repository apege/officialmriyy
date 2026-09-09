"use client";

import React, { useState } from "react";
import { Search, RefreshCw, Users, MessageCircle, ShoppingBag, ShieldCheck } from "lucide-react";

export interface CustomerItem {
  id: string;
  username: string;
  whatsapp: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const MOCK_CUSTOMERS: CustomerItem[] = [
  {
    id: "CUST-001",
    username: "BloxyKing99",
    whatsapp: "081234567890",
    totalOrders: 5,
    totalSpent: 225000,
    lastOrderDate: "Hari ini, 18:25 WIB",
  },
  {
    id: "CUST-002",
    username: "RobloxSultan_ID",
    whatsapp: "085712345678",
    totalOrders: 12,
    totalSpent: 1850000,
    lastOrderDate: "Hari ini, 18:10 WIB",
  },
  {
    id: "CUST-003",
    username: "GamerGirl_Alya",
    whatsapp: "089698765432",
    totalOrders: 3,
    totalSpent: 105000,
    lastOrderDate: "Hari ini, 17:45 WIB",
  },
];

export default function PelangganTab() {
  const [customers, setCustomers] = useState<CustomerItem[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsapp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Bar (Matching Screenshot 7) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Daftar Pelanggan
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Kelola seluruh data akun pelanggan aktif dan riwayat belanja Robux
          </p>
        </div>

        <button
          onClick={() => setCustomers([...customers])}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#ff2a85] font-extrabold text-xs border border-pink-200 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Search & Meta Bar (Matching Screenshot 7) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username atau email pelanggan..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 focus:border-[#ff2a85] focus:bg-white text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Menampilkan <span className="font-extrabold text-[#ff2a85]">{filteredCustomers.length}</span> pelanggan
        </div>
      </div>

      {/* 3. Customer List or Empty State (Matching Screenshot 7) */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-pink-100 rounded-3xl p-16 sm:p-24 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-pink-50 text-[#ff2a85] flex items-center justify-center border border-pink-100 shadow-xs">
            <Users className="w-7 h-7 stroke-[1.8]" />
          </div>
          <p className="font-extrabold text-sm sm:text-base text-slate-800">
            Belum ada data pelanggan
          </p>
        </div>
      ) : (
        <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50/50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-pink-100">
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">No WhatsApp</th>
                  <th className="p-4">Total Order</th>
                  <th className="p-4">Total Belanja</th>
                  <th className="p-4">Transaksi Terakhir</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-xs font-semibold text-slate-700">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center font-extrabold text-xs text-[#ff2a85] shrink-0">
                          {cust.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            @{cust.username}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{cust.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={`https://wa.me/${cust.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-100" />
                        <span>{cust.whatsapp}</span>
                      </a>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#ff2a85] font-black text-xs">
                        {cust.totalOrders} Transaksi
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      {formatRupiah(cust.totalSpent)}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{cust.lastOrderDate}</td>
                    <td className="p-4 text-center">
                      <a
                        href={`https://wa.me/${cust.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-100" />
                        <span>Chat WA</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
