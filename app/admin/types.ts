export interface OrderItem {
  id: string;
  username: string;
  whatsapp: string;
  packageName: string;
  robuxAmount: number;
  price: number;
  paymentMethod: "website" | "whatsapp";
  paymentGateway?: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  avatarSeed?: string;
  paymentProof?: string | null;
  customerNotes?: string | null;
  adminNotes?: string | null;
  robloxUserId?: string | null;
}

export type AdminTab =
  | "overview"
  | "order_masuk"
  | "order_diproses"
  | "order_selesai"
  | "order_dibatalkan"
  | "products"
  | "pelanggan"
  | "blacklist"
  | "testimoni"
  | "keuangan"
  | "settings";
