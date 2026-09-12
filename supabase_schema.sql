-- ==============================================================================
-- OFFICIAL.MRIYY SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  full_name text NULL,
  role text NOT NULL DEFAULT 'member'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT profiles_role_check CHECK (
    (role = ANY (ARRAY['member'::text, 'admin'::text]))
  )
) TABLESPACE pg_default;

-- 2. Products Table (Robux Packages)
CREATE TABLE IF NOT EXISTS public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  robux integer NOT NULL,
  price bigint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  image_path text NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_price_check CHECK ((price >= 0)),
  CONSTRAINT products_robux_check CHECK ((robux > 0))
) TABLESPACE pg_default;

-- 3. Blacklists Table
CREATE TABLE IF NOT EXISTS public.blacklists (
  id bigserial NOT NULL,
  roblox_username text NOT NULL,
  reason text NULL DEFAULT 'Indikasi penipuan atau penyalahgunaan'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  roblox_user_id text NULL,
  phone text NULL,
  CONSTRAINT blacklists_pkey PRIMARY KEY (id),
  CONSTRAINT blacklists_roblox_username_key UNIQUE (roblox_username)
) TABLESPACE pg_default;

-- 4. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  store_name text NOT NULL,
  whatsapp_number text NOT NULL,
  qris_image_path text NULL,
  logo_image_path text NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  banner_image_path text NULL,
  promo_active boolean NULL DEFAULT true,
  promo_tag text NULL DEFAULT 'PROMO SPESIAL BULAN INI'::text,
  promo_badge text NULL DEFAULT 'LIMITED STOCK'::text,
  promo_title text NULL DEFAULT 'ROBUX BULAN INI'::text,
  promo_subtitle text NULL DEFAULT 'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!'::text,
  promo_robux_amount integer NULL DEFAULT 2200,
  promo_original_label text NULL DEFAULT '2.000 Robux'::text,
  promo_discount_price integer NULL DEFAULT 45000,
  promo_end_date timestamp with time zone NULL DEFAULT '2026-09-30 23:59:59+00'::timestamp with time zone,
  admin_note text NULL,
  CONSTRAINT store_settings_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_code text NOT NULL,
  product_id bigint NULL,
  user_id uuid NULL,
  roblox_username text NOT NULL,
  customer_phone text NOT NULL,
  robux integer NOT NULL,
  price bigint NOT NULL,
  payment_method text NOT NULL DEFAULT 'Website'::text,
  payment_status text NOT NULL DEFAULT 'pending'::text,
  payment_proof_path text NULL,
  order_status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  roblox_user_id text NULL,
  customer_notes text NULL,
  admin_notes text NULL,
  expires_at timestamp with time zone NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_order_code_key UNIQUE (order_code),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE SET NULL,
  CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL,
  CONSTRAINT orders_price_check CHECK ((price >= 0)),
  CONSTRAINT orders_order_status_check CHECK (
    (
      order_status = ANY (
        ARRAY[
          'pending'::text,
          'processing'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  ),
  CONSTRAINT orders_robux_check CHECK ((robux > 0)),
  CONSTRAINT orders_payment_status_check CHECK (
    (
      payment_status = ANY (
        ARRAY['pending'::text, 'paid'::text, 'failed'::text]
      )
    )
  )
) TABLESPACE pg_default;

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NULL,
  name text NOT NULL,
  message text NOT NULL,
  rating integer NOT NULL,
  image_path text NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_reply jsonb NULL,
  order_code text NULL,
  CONSTRAINT testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT testimonials_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE SET NULL,
  CONSTRAINT testimonials_rating_check CHECK (
    (
      (rating >= 1)
      AND (rating <= 5)
    )
  ),
  CONSTRAINT testimonials_status_check CHECK (
    (
      status = ANY (
        ARRAY[
          'pending'::text,
          'approved'::text,
          'rejected'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- 7. Storage Cleanup Logs Table
CREATE TABLE IF NOT EXISTS public.storage_cleanup_logs (
  id bigserial NOT NULL,
  cleaned_count integer NOT NULL DEFAULT 0,
  order_codes text[] NOT NULL DEFAULT '{}'::text[],
  mode text NOT NULL DEFAULT 'cron'::text,
  executed_by text NULL DEFAULT 'system'::text,
  details jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT storage_cleanup_logs_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ==============================================================================
-- PERMISSIONS & ROLES GRANT
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_cleanup_logs ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies (Allow full service_role and public CRUD for store operations)
CREATE POLICY "Allow all access to service_role" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.blacklists FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.store_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to service_role" ON public.storage_cleanup_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read store settings" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert testimonials" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public read blacklists" ON public.blacklists FOR SELECT TO anon, authenticated USING (true);
