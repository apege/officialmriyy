import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderCode: string }> }
) {
  try {
    const { orderCode } = await params;

    if (!orderCode) {
      return NextResponse.json(
        { error: "Kode pesanan tidak valid" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_code", orderCode)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}
