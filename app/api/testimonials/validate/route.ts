import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = (searchParams.get("token") || "").trim();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token tidak ditemukan" },
        { status: 400 }
      );
    }

    // 1. Check if order exists with this order_code
    const { data: orderData, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, order_code, roblox_username, robux, price, order_status, created_at")
      .eq("order_code", token)
      .maybeSingle();

    if (orderErr || !orderData) {
      return NextResponse.json({
        valid: false,
        error: "Token review tidak valid atau kode pesanan tidak ditemukan.",
      });
    }

    // 2. Check if this token has already been used in testimonials table
    const { data: existingReview } = await supabaseAdmin
      .from("testimonials")
      .select("id, created_at")
      .eq("order_code", token)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json({
        valid: false,
        alreadyUsed: true,
        error: "Link ulasan ini sudah pernah digunakan sebelumnya (1 transaksi = 1 ulasan).",
        order: {
          order_code: orderData.order_code,
          username: orderData.roblox_username,
        },
      });
    }

    return NextResponse.json({
      valid: true,
      alreadyUsed: false,
      order: {
        order_code: orderData.order_code,
        username: orderData.roblox_username,
        robux: orderData.robux,
        price: orderData.price,
      },
    });
  } catch (err: any) {
    console.error("Token validation error:", err);
    return NextResponse.json(
      { valid: false, error: "Gagal memverifikasi token ulasan" },
      { status: 500 }
    );
  }
}
