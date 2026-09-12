import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCached, setCached, invalidateCache } from "@/lib/cache";

export async function GET() {
  try {
    // 1. Check in-memory server cache
    const cachedSettings = getCached<any>("store_settings");
    if (cachedSettings) {
      return NextResponse.json(
        { settings: cachedSettings, cached: true },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        }
      );
    }

    // 2. Query Supabase
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching store settings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      // Default fallback settings
      const defaultSettings = {
        store_name: "official.mriyy",
        whatsapp_number: "6285624695885",
        qris_image_path: "/qris.png",
        logo_image_path: "/logo.png",
        banner_image_path: null,
        promo_active: true,
        promo_tag: "PROMO SPESIAL BULAN INI",
        promo_badge: "LIMITED STOCK",
        promo_title: "⚡ PROMO FLASH SALE ROBUX HARI INI!",
        promo_subtitle:
          "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
        promo_robux_amount: 2200,
        promo_original_label: "2.000 Robux",
        promo_discount_price: 45000,
        promo_end_date: "2026-09-30T23:59:59Z",
        admin_note: "Official Store official.mriyy",
      };

      const { data: inserted } = await supabaseAdmin
        .from("store_settings")
        .insert([defaultSettings])
        .select()
        .single();

      const finalSettings = inserted || defaultSettings;
      setCached("store_settings", finalSettings, 60);

      return NextResponse.json(
        { settings: finalSettings },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        }
      );
    }

    setCached("store_settings", data, 60);

    return NextResponse.json(
      { settings: data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch store settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const updateData: Record<string, any> = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    delete updateData.id;

    // Check if record exists
    const { data: existing } = await supabaseAdmin
      .from("store_settings")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    let result;

    if (existing) {
      result = await supabaseAdmin
        .from("store_settings")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from("store_settings")
        .insert([
          {
            store_name: "official.mriyy",
            whatsapp_number: "6285624695885",
            ...updateData,
          },
        ])
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    // Invalidate store settings & products cache immediately
    invalidateCache("store_settings");
    invalidateCache("products");

    return NextResponse.json({ settings: result.data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update store settings" },
      { status: 500 }
    );
  }
}
