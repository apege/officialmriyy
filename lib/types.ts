export interface DbBlacklist {
  id: number;
  roblox_username: string;
  reason: string | null;
  created_at: string;
  roblox_user_id: string | null;
  phone: string | null;
}

export interface DbProfile {
  id: string; // uuid
  full_name: string | null;
  role: "member" | "admin";
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: number;
  name: string;
  robux: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_path: string | null;
}

export interface DbStoreSettings {
  id: number;
  store_name: string;
  whatsapp_number: string;
  qris_image_path: string | null;
  logo_image_path: string | null;
  updated_at: string;
  banner_image_path: string | null;
  promo_active: boolean;
  promo_tag: string | null;
  promo_badge: string | null;
  promo_title: string | null;
  promo_subtitle: string | null;
  promo_robux_amount: number | null;
  promo_original_label: string | null;
  promo_discount_price: number | null;
  promo_end_date: string | null;
  admin_note: string | null;
}

export interface DbOrder {
  id: number;
  order_code: string;
  product_id: number | null;
  user_id: string | null;
  roblox_username: string;
  customer_phone: string;
  robux: number;
  price: number;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed";
  payment_proof_path: string | null;
  order_status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  roblox_user_id: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  expires_at: string | null;
}

export interface DbTestimonial {
  id: number;
  user_id: string | null;
  name: string;
  message: string;
  rating: number;
  image_path: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  admin_reply: {
    text: string;
    repliedAt?: string;
  } | null;
  order_code: string | null;
}

export interface DbStorageCleanupLog {
  id: number;
  cleaned_count: number;
  order_codes: string[];
  mode: string;
  executed_by: string | null;
  details: Record<string, any> | null;
  created_at: string;
}
