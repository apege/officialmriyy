import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCached, setCached, invalidateCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const status = searchParams.get("status");

    // Cache approved testimonials for storefront
    const isStorefrontApproved =
      !all &&
      (!status || status === "approved" || searchParams.get("approved_only") === "true");
    const hasCacheBuster = searchParams.has("_t") || searchParams.get("fresh") === "true";
    const cacheKey = "testimonials:approved";

    if (isStorefrontApproved && !hasCacheBuster) {
      const cached = getCached<any[]>(cacheKey);
      if (cached) {
        return NextResponse.json(
          { testimonials: cached, cached: true },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
          }
        );
      }
    }

    let query = supabaseAdmin
      .from("testimonials")
      .select("id, name, message, rating, image_path, status, created_at, updated_at, admin_reply, order_code")
      .order("created_at", { ascending: false });

    if (!all && !status) {
      query = query.eq("status", "approved").limit(20);
    } else if (status && status !== "semua") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching testimonials:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = data || [];

    // Enrich with robux amount from orders table if order_code exists
    const rawOrderCodes = list.map((t: any) => t.order_code).filter(Boolean);
    const lookupCodes: string[] = [];
    rawOrderCodes.forEach((code: string) => {
      const trimmed = code.trim();
      const clean = trimmed.replace(/^#/, "");
      lookupCodes.push(trimmed);
      lookupCodes.push(clean);
      if (clean.startsWith("MRY")) {
        lookupCodes.push(clean.replace(/^MRY/, ""));
      }
    });

    let robuxMap: Record<string, any> = {};
    if (lookupCodes.length > 0) {
      const { data: orderRows } = await supabaseAdmin
        .from("orders")
        .select("order_code, robux")
        .in("order_code", lookupCodes);
      if (orderRows) {
        orderRows.forEach((o: any) => {
          if (o.robux) {
            robuxMap[o.order_code] = o.robux;
            robuxMap[`#${o.order_code}`] = o.robux;
            if (o.order_code.startsWith("MRY")) {
              robuxMap[o.order_code.replace(/^MRY/, "")] = o.robux;
            }
          }
        });
      }
    }

    const enrichedList = list.map((t: any) => {
      const code = t.order_code ? t.order_code.trim() : "";
      const robuxVal =
        (code && robuxMap[code] !== undefined && robuxMap[code]) ||
        (code && robuxMap[code.replace(/^#/, "")] !== undefined && robuxMap[code.replace(/^#/, "")]) ||
        t.robux ||
        null;
      return {
        ...t,
        robux: robuxVal,
      };
    });

    if (isStorefrontApproved) {
      setCached(cacheKey, enrichedList, 60);
    }

    return NextResponse.json(
      { testimonials: enrichedList },
      {
        headers: isStorefrontApproved
          ? {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            }
          : undefined,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, message, rating, image_path, order_code, token, user_id, isAdmin } = body;

    if (!name || !message || !rating) {
      return NextResponse.json(
        { error: "Nama/username, pesan ulasan, dan rating wajib diisi" },
        { status: 400 }
      );
    }

    const effectiveToken = (token || order_code || "").trim();

    // If not admin, verify token & ensure single-use per order
    if (!isAdmin) {
      if (!effectiveToken) {
        return NextResponse.json(
          { error: "Token review / Kode transaksi wajib disertakan untuk mencegah spam." },
          { status: 400 }
        );
      }

      // 1. Verify token exists in orders table
      const { data: orderData, error: orderErr } = await supabaseAdmin
        .from("orders")
        .select("id, order_code, roblox_username, robux")
        .eq("order_code", effectiveToken)
        .maybeSingle();

      if (orderErr || !orderData) {
        return NextResponse.json(
          { error: "Token review tidak valid atau kode pesanan tidak ditemukan di database." },
          { status: 400 }
        );
      }

      // 2. Check if already reviewed (Single-use token verification)
      const { data: alreadyUsed } = await supabaseAdmin
        .from("testimonials")
        .select("id")
        .eq("order_code", effectiveToken)
        .maybeSingle();

      if (alreadyUsed) {
        return NextResponse.json(
          {
            error: "Token ini sudah pernah digunakan untuk mengirim testimoni. Setiap pesanan hanya dapat memberikan 1 kali ulasan.",
            alreadyUsed: true,
          },
          { status: 400 }
        );
      }
    }

    const newTesti = {
      name: name.replace(/^@/, "").trim(),
      message: message.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      image_path: image_path || null,
      order_code: effectiveToken || null,
      user_id: user_id || null,
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      admin_reply: null,
    };

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert([newTesti])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    invalidateCache("testimonials");

    return NextResponse.json({ testimonial: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, message, rating, status, image_path, admin_reply } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID testimoni wajib disertakan" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.replace(/^@/, "").trim();
    if (message !== undefined) updateData.message = message.trim();
    if (rating !== undefined) updateData.rating = Number(rating);
    if (status !== undefined) updateData.status = status;
    if (image_path !== undefined) updateData.image_path = image_path;
    if (admin_reply !== undefined) updateData.admin_reply = admin_reply;

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    invalidateCache("testimonials");

    return NextResponse.json({ testimonial: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID testimoni harus disertakan" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    invalidateCache("testimonials");

    return NextResponse.json({
      success: true,
      message: "Testimoni berhasil dihapus",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
