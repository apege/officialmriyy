import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://diubszypyvusdalylrnb.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable__E9FHrfPph8MrEgoVf-wBA_yORCoNfJ";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// 1. Public client for client-side browser usage (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 2. Admin client for server-side API routes & server actions (service role key, bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
