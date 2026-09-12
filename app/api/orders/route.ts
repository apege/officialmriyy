import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    let query = supabaseAdmin
      .from("orders")
      .select("id, order_code, roblox_username, customer_phone, robux, price, payment_method, payment_status, order_status, created_at, updated_at, admin_notes, roblox_user_id, customer_notes, payment_proof_path")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      query = query.eq("order_status", status);
    }

    if (q) {
      query = query.or(
        `order_code.ilike.%${q}%,roblox_username.ilike.%${q}%,customer_phone.ilike.%${q}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { orders: data || [] },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Orders API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roblox_username,
      customer_phone,
      robux,
      price,
      payment_method = "Website",
      product_id,
      roblox_user_id,
      customer_notes,
      payment_proof_path,
    } = body;

    if (!roblox_username || !customer_phone || !robux || !price) {
      return NextResponse.json(
        { error: "Username Roblox, nomor WhatsApp, jumlah Robux, dan nominal harus diisi" },
        { status: 400 }
      );
    }

    // 1. Check if user is in blacklist
    const { data: blacklisted } = await supabaseAdmin
      .from("blacklists")
      .select("id, reason")
      .eq("roblox_username", roblox_username.trim())
      .maybeSingle();

    if (blacklisted) {
      return NextResponse.json(
        {
          error: `Akun @${roblox_username} tidak dapat melakukan transaksi karena masuk dalam daftar Blacklist: ${
            blacklisted.reason || "Indikasi penyalahgunaan"
          }`,
          isBlacklisted: true,
        },
        { status: 403 }
      );
    }

    // 2. Safely check if product_id exists in database to prevent foreign key constraint error
    let validProductId: number | null = null;
    if (product_id && !isNaN(Number(product_id))) {
      try {
        const { data: prod } = await supabaseAdmin
          .from("products")
          .select("id")
          .eq("id", Number(product_id))
          .maybeSingle();

        if (prod) {
          validProductId = prod.id;
        }
      } catch {
        validProductId = null;
      }
    }

    // 3. Generate unique order code with MRY prefix
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000).toString();
    const order_code = `MRY${randomSuffix}`;

    const newOrder = {
      order_code,
      product_id: validProductId,
      roblox_username: roblox_username.trim(),
      customer_phone: customer_phone.trim(),
      robux: Number(robux),
      price: Number(price),
      payment_method: payment_method || "Website",
      payment_status: "pending",
      payment_proof_path: payment_proof_path || null,
      order_status: "pending",
      roblox_user_id: roblox_user_id || null,
      customer_notes: customer_notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, order_code, order_status, payment_status, admin_notes, payment_proof_path } =
      body;

    if (!id && !order_code) {
      return NextResponse.json(
        { error: "ID pesanan atau kode pesanan harus disertakan" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (order_status !== undefined) updateData.order_status = order_status;
    if (payment_status !== undefined) updateData.payment_status = payment_status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (payment_proof_path !== undefined)
      updateData.payment_proof_path = payment_proof_path;

    let query = supabaseAdmin.from("orders").update(updateData);

    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("order_code", order_code);
    }

    const { data, error } = await query.select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const order_code = searchParams.get("order_code");

    if (!id && !order_code) {
      return NextResponse.json(
        { error: "ID atau kode pesanan harus disertakan" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("orders").delete();

    if (id) {
      query = query.eq("id", Number(id));
    } else if (order_code) {
      query = query.eq("order_code", order_code);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Pesanan berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
