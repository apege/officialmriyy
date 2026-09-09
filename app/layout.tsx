import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "official.mriyy - Top Up Robux Resmi, Aman & Terpercaya",
  description:
    "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali. Proses 5-10 menit hanya butuh username Roblox!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FFF9FA] text-slate-800 min-h-screen flex flex-col selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
