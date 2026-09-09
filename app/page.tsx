"use client";

import React, { useState } from "react";
import PetalBackground from "./components/PetalBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureBar from "./components/FeatureBar";
import OrderSection, {
  ROBUX_PACKAGES,
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
  // Global order state
  const [username, setUsername] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(
    ROBUX_PACKAGES[1] // Default to 2.200 Robux Promo
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("website");

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { package: ROBUX_PACKAGES[1], quantity: 1 },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCSOpen, setIsCSOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setCartItems((prev) => prev.filter((item) => item.package.id !== pkgId));
  };

  // Cart totals calculation
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.package.price * item.quantity,
    0
  );
  const totalRobux = cartItems.reduce(
    (sum, item) => sum + item.package.amount * item.quantity,
    0
  );

  // Quick CTA actions
  const handleSelectPromo = () => {
    const promoItem = ROBUX_PACKAGES.find((p) => p.amount === 2200) || ROBUX_PACKAGES[0];
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
      const orderElem = document.getElementById("order-section");
      if (orderElem) {
        orderElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Hero Showcase with Countdown */}
        <HeroSection
          onSelectPromo={handleSelectPromo}
          onOpenTestimonial={handleScrollToTestimonial}
        />

        {/* 5 Value Badges */}
        <FeatureBar />

        {/* 3-Step Interactive Ordering */}
        <OrderSection
          username={username}
          setUsername={setUsername}
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={setWhatsappNumber}
          selectedPackage={selectedPackage}
          setSelectedPackage={setSelectedPackage}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onAddToCart={handleAddToCart}
        />

        {/* Cara Order / Alur Transaksi */}
        <AlurTransaksi />

        {/* Testimoni Member (Dibawah Cara Order) */}
        <TestimonialSection onOpenCS={() => setIsCSOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Order Summary Bottom Bar */}
      <StickyBottomBar
        totalAmount={totalAmount > 0 ? totalAmount : selectedPackage.price}
        totalRobux={totalRobux > 0 ? totalRobux : selectedPackage.amount}
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
        setWhatsappNumber={setWhatsappNumber}
        selectedPackage={selectedPackage}
        cartItems={cartItems}
        paymentMethod={paymentMethod}
      />

      <CustomerServiceModal
        isOpen={isCSOpen}
        onClose={() => setIsCSOpen(false)}
      />
    </div>
  );
}
