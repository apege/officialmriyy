import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import fs from "fs";
import path from "path";

// Read .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://diubszypyvusdalylrnb.supabase.co";
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: ws,
  },
});

async function main() {
  console.log("Testing connection to Supabase:", supabaseUrl);

  // 1. Check Store Settings
  const { data: settings, error: sErr } = await supabase.from("store_settings").select("*").limit(1);
  console.log("store_settings check:", { count: settings?.length, error: sErr });

  if (!sErr && settings && settings.length === 0) {
    console.log("Seeding store_settings...");
    await supabase.from("store_settings").insert([
      {
        store_name: "official.mriyy",
        whatsapp_number: "081234567890",
        qris_image_path: "/qris.png",
        logo_image_path: "/logo.png",
        banner_image_path: null,
        promo_active: true,
        promo_tag: "PROMO SPESIAL BULAN INI",
        promo_badge: "LIMITED STOCK",
        promo_title: "ROBUX BULAN INI",
        promo_subtitle: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
        promo_robux_amount: 2200,
        promo_original_label: "2.000 Robux",
        promo_discount_price: 45000,
        promo_end_date: "2026-09-30T23:59:59Z",
        admin_note: "Official Store official.mriyy",
      },
    ]);
  }

  // 2. Check Products
  const { data: prods, error: pErr } = await supabase.from("products").select("*");
  console.log("products check:", { count: prods?.length, error: pErr });

  if (!pErr && prods && prods.length === 0) {
    console.log("Seeding default products...");
    await supabase.from("products").insert([
      { name: "100 Robux", robux: 100, price: 2500, is_active: true },
      { name: "500 Robux", robux: 500, price: 11000, is_active: true },
      { name: "1.000 Robux", robux: 1000, price: 20000, is_active: true },
      { name: "1.800 Robux Populer", robux: 1800, price: 35000, is_active: true },
      { name: "2.200 Robux Promo", robux: 2200, price: 45000, is_active: true },
      { name: "2.700 Robux Reguler", robux: 2700, price: 50000, is_active: true },
      { name: "3.700 Robux Reguler", robux: 3700, price: 70000, is_active: true },
      { name: "4.200 Robux", robux: 4200, price: 80000, is_active: true },
      { name: "5.500 Robux", robux: 5500, price: 100000, is_active: true },
      { name: "10.000 Robux", robux: 10000, price: 185000, is_active: true },
      { name: "25.000 Robux Sultan", robux: 25000, price: 450000, is_active: true },
      { name: "33.000 Robux Sultan", robux: 33000, price: 675000, is_active: true },
    ]);
  }

  // 3. Check Testimonials
  const { data: testis, error: tErr } = await supabase.from("testimonials").select("*");
  console.log("testimonials check:", { count: testis?.length, error: tErr });

  if (!tErr && testis && testis.length === 0) {
    console.log("Seeding default testimonials...");
    await supabase.from("testimonials").insert([
      { name: "Londoireng61", message: "Sedikit slowrespon ehee overall semuanya aman kok, robux langsung mendarat!", rating: 4, status: "approved", order_code: "MRY68654782" },
      { name: "Crasiel17", message: "Mantap banget min, proses cepet bgt 5 menit langsung masuk ke akun Roblox ku! Rekomendasi poll 🔥", rating: 5, status: "approved", order_code: "MRY09444411" },
      { name: "Rian_Gamer99", message: "Top up 10.000 robux tanpa password, akun aman 100%. CS ramah banget di WhatsApp.", rating: 5, status: "approved", order_code: "MRY52690672", admin_reply: { text: "Terima kasih banyak kak Rian atas kepercayaannya! Ditunggu langganan selanjutnya ✨", repliedAt: "1 jam lalu" } },
      { name: "DindaCutie", message: "Harga paling murah dibanding toko lain, legal terpercaya!", rating: 5, status: "approved", order_code: "MRY21707876", admin_reply: { text: "Terima kasih kak Dinda! 🥰", repliedAt: "2 jam lalu" } },
      { name: "BloxyKing99", message: "Pelayanan mantap dan admin sangat responsif. Top up kedua kalinya tetap memuaskan.", rating: 5, status: "approved", order_code: "MRY31063080" },
      { name: "RobloxSultan_ID", message: "Langganan sultan, order 25.000 robux kilat masuk hitungan menit. Terbaik pokoknya!", rating: 5, status: "approved", order_code: "MRY98210612" },
    ]);
  }

  // 4. Check Orders
  const { data: ords, error: oErr } = await supabase.from("orders").select("*");
  console.log("orders check:", { count: ords?.length, error: oErr });

  if (!oErr && ords && ords.length === 0) {
    console.log("Seeding default orders for testing...");
    await supabase.from("orders").insert([
      { order_code: "MRY68654782", roblox_username: "Ekoo1801", customer_phone: "081234567890", robux: 2200, price: 45000, payment_method: "website", payment_status: "pending", order_status: "pending", roblox_user_id: "13292555", customer_notes: "Gamepass sudah dibuat" },
      { order_code: "MRY09444411", roblox_username: "ImLoveLilly", customer_phone: "085712345678", robux: 1800, price: 35000, payment_method: "whatsapp", payment_status: "pending", order_status: "pending", roblox_user_id: "8549372886" },
      { order_code: "MRY52690672", roblox_username: "makam_130", customer_phone: "089698765432", robux: 33000, price: 675000, payment_method: "website", payment_status: "pending", order_status: "pending", roblox_user_id: "8550186918" },
      { order_code: "MRY21707876", roblox_username: "hfdzzzz_1", customer_phone: "082133445566", robux: 1800, price: 35000, payment_method: "website", payment_status: "pending", order_status: "pending", roblox_user_id: "29481726" },
      { order_code: "MRY31063080", roblox_username: "Aliffauzi_90", customer_phone: "081377889900", robux: 2200, price: 45000, payment_method: "whatsapp", payment_status: "pending", order_status: "pending", roblox_user_id: "94810293" },
      { order_code: "MRY98210612", roblox_username: "AnimeRobloxer", customer_phone: "087811223344", robux: 25000, price: 450000, payment_method: "whatsapp", payment_status: "paid", order_status: "completed", roblox_user_id: "73629102" },
      { order_code: "MRY982107", roblox_username: "ChocoCookie_Gamer", customer_phone: "083899001122", robux: 3700, price: 70000, payment_method: "website", payment_status: "failed", order_status: "cancelled", roblox_user_id: "62510934" },
    ]);
  }

  console.log("Database verification & seed script completed successfully!");
}

main().catch(console.error);
