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
import TestimoniTab from "./components/TestimoniTab";
import KeuanganTab from "./components/KeuanganTab";
import SettingsTab from "./components/SettingsTab";
import OrderDetailView from "./components/OrderDetailView";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // 1. Check Authentication on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("officialmriyy_admin_auth");
      const hasCookie = document.cookie.includes("officialmriyy_admin_token");
      if (!isAuth && !hasCookie) {
        router.replace("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          const mapped: OrderItem[] = data.orders.map((o: any) => {
            const isWa = String(o.payment_method || "").toLowerCase().includes("whatsapp");
            return {
              id: o.order_code,
              username: o.roblox_username,
              whatsapp: o.customer_phone,
              packageName: `${new Intl.NumberFormat("id-ID").format(o.robux)} Robux`,
              robuxAmount: Number(o.robux) || 0,
              price: Number(o.price) || 0,
              paymentMethod: isWa ? "whatsapp" : "website",
              paymentGateway: isWa ? "WhatsApp Admin" : "QRIS All Payment",
              status: o.order_status,
              paymentProof: o.payment_proof_path || null,
              customerNotes: o.customer_notes || null,
              adminNotes: o.admin_notes || null,
              robloxUserId: o.roblox_user_id || null,
              createdAt: o.created_at
                ? new Date(o.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) + " WIB"
                : "Hari ini",
            };
          });
          setOrders(mapped);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders();

    // 1. Polling every 60s only when tab is active (saves Supabase quota/egress)
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchOrders();
      }
    }, 60000);

    // 2. Fetch immediately when switching back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const processingCount = orders.filter((o) => o.status === "processing").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

  const handleUpdateStatus = async (orderId: string, newStatus: OrderItem["status"]) => {
    // Optimistic UI
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_code: orderId,
          order_status: newStatus,
        }),
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Hapus pesanan #${orderId}?`)) return;

    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }

    try {
      await fetch(`/api/orders?order_code=${orderId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting order:", err);
      fetchOrders();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-200 text-[#ff2a85] flex items-center justify-center animate-bounce mb-3 shadow-sm">
          <span className="font-black text-xs">MRY</span>
        </div>
        <p className="text-xs font-bold text-slate-600 animate-pulse">
          Memverifikasi Keamanan Akses Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FA] flex flex-col lg:flex-row selection:bg-[#ff2a85] selection:text-white">
      {/* Responsive Sidebar (Desktop Sticky + Mobile Drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedOrder(null);
          setActiveTab(tab);
        }}
        pendingCount={pendingCount}
        processingCount={processingCount}
        completedCount={completedCount}
        cancelledCount={cancelledCount}
        isStoreOpen={isStoreOpen}
        setIsStoreOpen={setIsStoreOpen}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingCount}
          onRefreshData={fetchOrders}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          orders={orders}
          onSelectOrder={setSelectedOrder}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              activeTab={activeTab}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <>
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

              {activeTab === "testimoni" && <TestimoniTab />}

              {activeTab === "keuangan" && <KeuanganTab />}

              {activeTab === "settings" && (
                <SettingsTab
                  isStoreOpen={isStoreOpen}
                  setIsStoreOpen={setIsStoreOpen}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
