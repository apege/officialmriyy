"use client";

import React, { useState } from "react";
import PetalBackground from "./components/PetalBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureBar from "./components/FeatureBar";
import OrderSection, {
  RobuxPackage,
  PaymentMethod,
} from "./components/OrderSection";
import AlurTransaksi from "./components/AlurTransaksi";
import TestimonialSection from "./components/TestimonialSection";
import Footer from "./components/Footer";
import StickyBottomBar from "./components/StickyBottomBar";
import CheckoutModal from "./components/CheckoutModal";
import CustomerServiceModal from "./components/CustomerServiceModal";
import CartDrawer, { CartItem } from "./components/CartDrawer";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  // Global store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "official.mriyy",
    whatsappNumber: "6285624695885",
    logoUrl: "/logo.png",
    qrisImageUrl: "/qris.png",
    bannerImageUrl: "",
    promoActive: true,
    promoTitle: "⚡ PROMO FLASH SALE ROBUX HARI INI!",
    promoSubtitle: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
    promoRobuxAmount: 2200,
    promoDiscountPrice: 45000,
    promoOriginalLabel: "2.000 Robux",
    promoEndDate: "2026-09-30T23:59:59Z",
  });

  // Global order state
  const [username, setUsername] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage | null>(null);
  const [packagesList, setPackagesList] = useState<RobuxPackage[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("website");

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCSOpen, setIsCSOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize store settings & products on mount
  React.useEffect(() => {
    // 1. Fetch Store Settings
    fetch("/api/store-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          const s = data.settings;
          setStoreSettings({
            storeName: s.store_name || "official.mriyy",
            whatsappNumber: s.whatsapp_number || "6285624695885",
            logoUrl: s.logo_image_path || "/logo.png",
            qrisImageUrl: s.qris_image_path || "/qris.png",
            bannerImageUrl: s.banner_image_path || "",
            promoActive: s.promo_active !== undefined ? Boolean(s.promo_active) : true,
            promoTitle: s.promo_title || "⚡ PROMO FLASH SALE ROBUX HARI INI!",
            promoSubtitle: s.promo_subtitle || "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
            promoRobuxAmount: s.promo_robux_amount || 2200,
            promoDiscountPrice: s.promo_discount_price || 45000,
            promoOriginalLabel: s.promo_original_label || "2.000 Robux",
            promoEndDate: s.promo_end_date || "2026-09-30T23:59:59Z",
          });
        }
      })
      .catch((err) => console.error("Error loading store settings:", err));

    // 2. Fetch Active Products (Cached for fast instant load & minimal Supabase egress)
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          const mapped: RobuxPackage[] = data.products.map((p: any) => ({
            id: p.id,
            amount: Number(p.robux),
            price: Number(p.price),
            category: p.category || "reguler",
            tag: p.tag,
            inStock: p.is_active ?? true,
          }));

          setPackagesList(mapped);
          if (mapped.length > 0) {
            const promoItem = mapped.find((m) => m.tag === "PROMO") || mapped[0];
            setSelectedPackage(promoItem);
            setCartItems([{ package: promoItem, quantity: 1 }]);
          }
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // Package selection handler (syncs cart when user clicks on a package card)
  const handleSelectPackage = (pkg: RobuxPackage) => {
    setSelectedPackage(pkg);
    setCartItems([{ package: pkg, quantity: 1 }]);
  };

  // Cart operations
  const handleAddToCart = (pkg: RobuxPackage) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.package.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.package.id === pkg.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { package: pkg, quantity: 1 }];
    });

    // Also select this package as current active
    setSelectedPackage(pkg);

    // Show brief toast
    setToastMessage(`${new Intl.NumberFormat("id-ID").format(pkg.amount)} Robux ditambahkan ke keranjang!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateQuantity = (pkgId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.package.id === pkgId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (pkgId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.package.id !== pkgId);
      if (updated.length > 0) {
        setSelectedPackage(updated[0].package);
      }
      return updated;
    });
  };

  // Cart totals calculation
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.package ? item.package.price * (item.quantity || 1) : 0),
    0
  );
  const totalRobux = cartItems.reduce(
    (sum, item) => sum + (item.package ? item.package.amount * (item.quantity || 1) : 0),
    0
  );

  // Quick CTA actions
  const handleSelectPromo = () => {
    const promoItem = packagesList.find((p) => p.tag === "PROMO") || packagesList[0];
    if (!promoItem) return;
    setSelectedPackage(promoItem);
    handleAddToCart(promoItem);
    const orderElem = document.getElementById("order-section");
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToTestimonial = () => {
    const testimoniElem = document.getElementById("testimoni");
    if (testimoniElem) {
      testimoniElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePayClick = () => {
    if (!username.trim()) {
      setToastMessage("Harap isi Username Roblox Anda di Langkah 1!");
      setTimeout(() => setToastMessage(null), 3500);
      const orderElem = document.getElementById("order-section");
      if (orderElem) {
        orderElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => {
        const input = document.getElementById("input-roblox-username");
        if (input) input.focus();
      }, 300);
      return;
    }

    const cleanWA = whatsappNumber.replace(/\D/g, "");
    if (!whatsappNumber.trim() || cleanWA.length < 8) {
      setToastMessage("Harap isi Nomor WhatsApp Anda di Langkah 1!");
      setTimeout(() => setToastMessage(null), 3500);
      const orderElem = document.getElementById("order-section");
      if (orderElem) {
        orderElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => {
        const input = document.getElementById("input-whatsapp-number");
        if (input) input.focus();
      }, 300);
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FFF9FA] overflow-x-clip">
      {/* Floating Sakura Petals */}
      <PetalBackground />

      {/* Toast Notification when adding to cart */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-pink-500/30 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Navbar */}
      <Navbar
        onOpenCS={() => setIsCSOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        storeName={storeSettings.storeName}
        logoUrl={storeSettings.logoUrl}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Hero Showcase with Countdown */}
        <HeroSection
          onSelectPromo={handleSelectPromo}
          onOpenTestimonial={handleScrollToTestimonial}
          promoActive={storeSettings.promoActive}
          promoTitle={storeSettings.promoTitle}
          promoSubtitle={storeSettings.promoSubtitle}
          bannerImageUrl={storeSettings.bannerImageUrl}
          promoRobuxAmount={storeSettings.promoRobuxAmount}
          promoDiscountPrice={storeSettings.promoDiscountPrice}
          promoOriginalLabel={storeSettings.promoOriginalLabel}
          promoEndDate={storeSettings.promoEndDate}
          logoImageUrl={storeSettings.logoUrl}
        />

        {/* 5 Value Badges */}
        <FeatureBar />

        {/* 3-Step Interactive Ordering */}
        <OrderSection
          username={username}
          setUsername={setUsername}
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={setWhatsappNumber}
          selectedPackage={selectedPackage as RobuxPackage}
          setSelectedPackage={handleSelectPackage}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onAddToCart={handleAddToCart}
          packages={packagesList}
        />

        {/* Cara Order / Alur Transaksi */}
        <AlurTransaksi />

        {/* Testimoni Member (Dibawah Cara Order) */}
        <TestimonialSection onOpenCS={() => setIsCSOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        storeName={storeSettings.storeName}
        whatsappNumber={storeSettings.whatsappNumber}
        logoUrl={storeSettings.logoUrl}
      />

      {/* Floating Order Summary Bottom Bar */}
      <StickyBottomBar
        totalAmount={totalAmount > 0 ? totalAmount : (selectedPackage?.price ?? 0)}
        totalRobux={totalRobux > 0 ? totalRobux : (selectedPackage?.amount ?? 0)}
        totalItemsCount={totalCartCount > 0 ? totalCartCount : 1}
        onPayClick={handlePayClick}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handlePayClick}
      />

      {/* Modals & Drawers */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        username={username}
        whatsappNumber={whatsappNumber}
        selectedPackage={selectedPackage as RobuxPackage}
        cartItems={cartItems}
        paymentMethod={paymentMethod}
        whatsappCS={storeSettings.whatsappNumber}
        qrisImageUrl={storeSettings.qrisImageUrl}
        storeName={storeSettings.storeName}
      />

      <CustomerServiceModal
        isOpen={isCSOpen}
        onClose={() => setIsCSOpen(false)}
        whatsappNumber={storeSettings.whatsappNumber}
        storeName={storeSettings.storeName}
      />
    </div>
  );
}
