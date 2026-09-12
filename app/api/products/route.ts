import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCached, setCached, invalidateCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const cacheKey = all ? "products:all" : "products:active";

    // 1. Check in-memory server cache first (bypass if _t cache-buster is passed)
    const hasCacheBuster = searchParams.has("_t") || searchParams.get("fresh") === "true";
    if (!hasCacheBuster) {
      const cachedData = getCached<any[]>(cacheKey);
      if (cachedData) {
        return NextResponse.json(
          { products: cachedData, cached: true },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
          }
        );
      }
    }

    // 2. Query Supabase with column projection
    let query = supabaseAdmin
      .from("products")
      .select("id, name, robux, price, is_active, created_at, updated_at, image_path")
      .order("price", { ascending: true });

    if (!all) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let rawProducts = data || [];

    // Query store settings for promo package
    const { data: storeSettings } = await supabaseAdmin
      .from("store_settings")
      .select("promo_active, promo_robux_amount, promo_discount_price")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    const promoActive = storeSettings?.promo_active ?? true;
    const promoRobux = Number(storeSettings?.promo_robux_amount) || 2200;

    // Query popular packages based on order counts in database
    const { data: orderRows } = await supabaseAdmin
      .from("orders")
      .select("robux")
      .neq("order_status", "cancelled");

    const orderCountMap: Record<number, number> = {};
    if (orderRows && orderRows.length > 0) {
      orderRows.forEach((o: any) => {
        const amt = Number(o.robux);
        if (amt) {
          orderCountMap[amt] = (orderCountMap[amt] || 0) + 1;
        }
      });
    }

    // Identify popular packages (top sold packages under 10k that are not the promo)
    const nonSultanNonPromo = rawProducts.filter(
      (p: any) => Number(p.robux) <= 10000 && (!promoActive || Number(p.robux) !== promoRobux)
    );

    const sortedByOrders = [...nonSultanNonPromo].sort((a: any, b: any) => {
      const countA = orderCountMap[Number(a.robux)] || 0;
      const countB = orderCountMap[Number(b.robux)] || 0;
      return countB - countA;
    });

    const popularSet = new Set<number>();
    const hasAnyRealOrders = sortedByOrders.some((p: any) => (orderCountMap[Number(p.robux)] || 0) > 0);
    if (hasAnyRealOrders) {
      sortedByOrders.slice(0, 2).forEach((p: any) => {
        if ((orderCountMap[Number(p.robux)] || 0) > 0) {
          popularSet.add(Number(p.robux));
        }
      });
    } else {
      // Default popular packages if no orders yet
      popularSet.add(1800);
      popularSet.add(3700);
    }

    // Apply automatic tags and categories
    const products = rawProducts.map((p: any) => {
      const robuxNum = Number(p.robux);
      let tag: "PROMO" | "POPULER" | "SULTAN" | undefined = undefined;
      let category: "promo" | "populer" | "sultan" | "reguler" = "reguler";

      // 1. Promo: dari set promo di pengaturan toko
      if (promoActive && robuxNum === promoRobux) {
        tag = "PROMO";
        category = "promo";
      }
      // 3. Sultan: di atas 10.000 Robux
      else if (robuxNum > 10000) {
        tag = "SULTAN";
        category = "sultan";
      }
      // 2. Populer: dari banyak paket yang dibeli
      else if (popularSet.has(robuxNum)) {
        tag = "POPULER";
        category = "populer";
      }

      return {
        ...p,
        robux: robuxNum,
        price: Number(p.price),
        tag,
        category,
        order_count: orderCountMap[robuxNum] || 0,
      };
    });

    setCached(cacheKey, products, 60); // 60s TTL

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: any) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, robux, price, is_active, image_path } = body;

    if (!name || !robux || price === undefined) {
      return NextResponse.json(
        { error: "Nama produk, jumlah Robux, dan harga harus diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name,
          robux: Number(robux),
          price: Number(price),
          is_active: is_active ?? true,
          image_path: image_path || null,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate product cache immediately
    invalidateCache("products");

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, robux, price, is_active, image_path } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID produk wajib disertakan" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (robux !== undefined) updateData.robux = Number(robux);
    if (price !== undefined) updateData.price = Number(price);
    if (is_active !== undefined) updateData.is_active = is_active;
    if (image_path !== undefined) updateData.image_path = image_path;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate product cache immediately
    invalidateCache("products");

    return NextResponse.json({ product: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
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
        { error: "ID produk harus disertakan" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate product cache immediately
    invalidateCache("products");

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
