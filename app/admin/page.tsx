"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { OrderItem, AdminTab } from "./types";
import OverviewTab from "./components/OverviewTab";
import OrdersTab from "./components/OrdersTab";
import ProductsTab from "./components/ProductsTab";
import PelangganTab from "./components/PelangganTab";
import BlacklistTab from "./components/BlacklistTab";
import KeuanganTab from "./components/KeuanganTab";
import PaymentSettings from "./components/PaymentSettings";
import SettingsTab from "./components/SettingsTab";
import OrderDetailModal from "./components/OrderDetailModal";

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "TRX-982101",
    username: "BloxyKing99",
    whatsapp: "081234567890",
    packageName: "2.200 Robux Promo",
    robuxAmount: 2200,
    price: 45000,
    paymentMethod: "website",
    paymentGateway: "QRIS All Payment",
    status: "pending",
    createdAt: "Hari ini, 18:25 WIB",
  },
  {
    id: "TRX-982102",
    username: "RobloxSultan_ID",
    whatsapp: "085712345678",
    packageName: "10.000 Robux Sultan",
    robuxAmount: 10000,
    price: 190000,
    paymentMethod: "website",
    paymentGateway: "QRIS (BCA)",
    status: "processing",
    createdAt: "Hari ini, 18:10 WIB",
  },
  {
    id: "TRX-982103",
    username: "GamerGirl_Alya",
    whatsapp: "089698765432",
    packageName: "1.800 Robux Populer",
    robuxAmount: 1800,
    price: 35000,
    paymentMethod: "whatsapp",
    paymentGateway: "WhatsApp Admin",
    status: "completed",
    createdAt: "Hari ini, 17:45 WIB",
  },
  {
    id: "TRX-982104",
    username: "ProBuilder_Fajar",
    whatsapp: "082133445566",
    packageName: "5.500 Robux Promo",
    robuxAmount: 5500,
    price: 100000,
    paymentMethod: "website",
    paymentGateway: "QRIS (DANA)",
    status: "completed",
    createdAt: "Hari ini, 17:20 WIB",
  },
  {
    id: "TRX-982105",
    username: "NoobMaster69",
    whatsapp: "081377889900",
    packageName: "2.200 Robux Promo",
    robuxAmount: 2200,
    price: 45000,
    paymentMethod: "website",
    paymentGateway: "QRIS (GoPay)",
    status: "pending",
    createdAt: "Hari ini, 16:50 WIB",
  },
  {
    id: "TRX-982106",
    username: "AnimeRobloxer",
    whatsapp: "087811223344",
    packageName: "25.000 Robux Sultan",
    robuxAmount: 25000,
    price: 450000,
    paymentMethod: "whatsapp",
    status: "completed",
    createdAt: "Kemarin, 21:15 WIB",
  },
  {
    id: "TRX-982107",
    username: "ChocoCookie_Gamer",
    whatsapp: "083899001122",
    packageName: "3.700 Robux Reguler",
    robuxAmount: 3700,
    price: 70000,
    paymentMethod: "website",
    status: "cancelled",
    createdAt: "Kemarin, 19:30 WIB",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const pendingCount = orders.filter((o) => o.status === "pending").length + 66;
  const processingCount = orders.filter((o) => o.status === "processing").length + 31;

  const handleUpdateStatus = (orderId: string, newStatus: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }
  };

  // Map sub-order tabs to status filters for OrdersTab
  const getInitialStatusForTab = () => {
    if (activeTab === "order_masuk") return "pending";
    if (activeTab === "order_diproses") return "processing";
    if (activeTab === "order_selesai") return "completed";
    if (activeTab === "order_dibatalkan") return "cancelled";
    return "all";
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] flex flex-col lg:flex-row selection:bg-[#ff2a85] selection:text-white">
      {/* Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        processingCount={processingCount}
        isStoreOpen={isStoreOpen}
        setIsStoreOpen={setIsStoreOpen}
      />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingCount}
          onRefreshData={() => setOrders([...orders])}
        />

        {/* Tab Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {activeTab === "overview" && (
            <OverviewTab
              orders={orders}
              onSelectOrder={setSelectedOrder}
              onGoToOrders={() => setActiveTab("order_masuk")}
            />
          )}

          {(activeTab === "order_masuk" ||
            activeTab === "order_diproses" ||
            activeTab === "order_selesai" ||
            activeTab === "order_dibatalkan") && (
            <OrdersTab
              orders={orders}
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onUpdateStatus={handleUpdateStatus}
              onDeleteOrder={handleDeleteOrder}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activeTab === "products" && <ProductsTab />}

          {activeTab === "pelanggan" && <PelangganTab />}

          {activeTab === "blacklist" && <BlacklistTab />}

          {activeTab === "keuangan" && <KeuanganTab />}

          {activeTab === "payments" && <PaymentSettings />}

          {activeTab === "settings" && (
            <SettingsTab
              isStoreOpen={isStoreOpen}
              setIsStoreOpen={setIsStoreOpen}
            />
          )}
        </main>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
