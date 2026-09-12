-- ==============================================================================
-- OFFICIAL.MRIYY SEED DATA
-- ==============================================================================

-- 1. Default Store Settings
INSERT INTO public.store_settings (
  store_name,
  whatsapp_number,
  qris_image_path,
  logo_image_path,
  banner_image_path,
  promo_active,
  promo_tag,
  promo_badge,
  promo_title,
  promo_subtitle,
  promo_robux_amount,
  promo_original_label,
  promo_discount_price,
  promo_end_date,
  admin_note
) VALUES (
  'official.mriyy',
  '081234567890',
  '/qris.png',
  '/logo.png',
  NULL,
  true,
  'PROMO SPESIAL BULAN INI',
  'LIMITED STOCK',
  'ROBUX BULAN INI',
  'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!',
  2200,
  '2.000 Robux',
  45000,
  '2026-09-30 23:59:59+00',
  'Official store official.mriyy'
) ON CONFLICT DO NOTHING;

-- 2. Default Products (Robux Packages)
INSERT INTO public.products (name, robux, price, is_active, image_path) VALUES
('100 Robux', 100, 2500, true, NULL),
('500 Robux', 500, 11000, true, NULL),
('1.000 Robux', 1000, 20000, true, NULL),
('1.800 Robux Populer', 1800, 35000, true, NULL),
('2.200 Robux Promo', 2200, 45000, true, NULL),
('2.700 Robux Reguler', 2700, 50000, true, NULL),
('3.700 Robux Reguler', 3700, 70000, true, NULL),
('4.200 Robux', 4200, 80000, true, NULL),
('5.500 Robux', 5500, 100000, true, NULL),
('10.000 Robux', 10000, 185000, true, NULL),
('25.000 Robux Sultan', 25000, 450000, true, NULL),
('33.000 Robux Sultan', 33000, 675000, true, NULL)
ON CONFLICT DO NOTHING;

-- 3. Initial Testimonials
INSERT INTO public.testimonials (name, message, rating, status, order_code, admin_reply) VALUES
('Londoireng61', 'Sedikit slowrespon ehee overall semuanya aman kok, robux langsung mendarat!', 4, 'approved', 'MRY68654782', NULL),
('Crasiel17', 'Mantap banget min, proses cepet bgt 5 menit langsung masuk ke akun Roblox ku! Rekomendasi poll 🔥', 5, 'approved', 'MRY09444411', NULL),
('Rian_Gamer99', 'Top up 10.000 robux tanpa password, akun aman 100%. CS ramah banget di WhatsApp.', 5, 'approved', 'MRY52690672', '{"text": "Terima kasih banyak kak Rian atas kepercayaannya! Ditunggu langganan selanjutnya ✨", "repliedAt": "1 jam lalu"}'),
('DindaCutie', 'Harga paling murah dibanding toko lain, legal terpercaya!', 5, 'approved', 'MRY21707876', '{"text": "Terima kasih kak Dinda! 🥰", "repliedAt": "2 jam lalu"}'),
('BloxyKing99', 'Pelayanan mantap dan admin sangat responsif. Top up kedua kalinya tetap memuaskan.', 5, 'approved', 'MRY31063080', NULL),
('RobloxSultan_ID', 'Langganan sultan, order 25.000 robux kilat masuk hitungan menit. Terbaik pokoknya!', 5, 'approved', 'MRY98210612', NULL)
ON CONFLICT DO NOTHING;

-- 4. Initial Orders for Testing
INSERT INTO public.orders (
  order_code,
  roblox_username,
  customer_phone,
  robux,
  price,
  payment_method,
  payment_status,
  order_status,
  roblox_user_id,
  customer_notes
) VALUES
('MRY68654782', 'Ekoo1801', '081234567890', 2200, 45000, 'website', 'pending', 'pending', '13292555', 'Gamepass sudah dibuat'),
('MRY09444411', 'ImLoveLilly', '085712345678', 1800, 35000, 'whatsapp', 'pending', 'pending', '8549372886', NULL),
('MRY52690672', 'makam_130', '089698765432', 33000, 675000, 'website', 'pending', 'pending', '8550186918', NULL),
('MRY21707876', 'hfdzzzz_1', '082133445566', 1800, 35000, 'website', 'pending', 'pending', '29481726', NULL),
('MRY31063080', 'Aliffauzi_90', '081377889900', 2200, 45000, 'whatsapp', 'pending', 'pending', '94810293', NULL),
('MRY98210612', 'AnimeRobloxer', '087811223344', 25000, 450000, 'whatsapp', 'paid', 'completed', '73629102', NULL),
('MRY982107', 'ChocoCookie_Gamer', '083899001122', 3700, 70000, 'website', 'failed', 'cancelled', '62510934', NULL)
ON CONFLICT (order_code) DO NOTHING;
