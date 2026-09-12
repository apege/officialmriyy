import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const q = searchParams.get("q");

    if (username) {
      const { data } = await supabaseAdmin
        .from("blacklists")
        .select("id, roblox_username, reason")
        .eq("roblox_username", username.trim())
        .maybeSingle();

      return NextResponse.json(
        {
          isBlacklisted: !!data,
          blacklist: data || null,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          },
        }
      );
    }

    let query = supabaseAdmin
      .from("blacklists")
      .select("id, roblox_username, reason, roblox_user_id, phone, created_at")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(
        `roblox_username.ilike.%${q}%,phone.ilike.%${q}%,reason.ilike.%${q}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blacklists: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch blacklist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roblox_username, reason, roblox_user_id, phone } = body;

    if (!roblox_username) {
      return NextResponse.json(
        { error: "Username Roblox harus diisi" },
        { status: 400 }
      );
    }

    const cleanUsername = roblox_username.replace(/^@/, "").trim();

    const { data, error } = await supabaseAdmin
      .from("blacklists")
      .upsert(
        [
          {
            roblox_username: cleanUsername,
            reason: reason || "Indikasi penipuan atau penyalahgunaan",
            roblox_user_id: roblox_user_id || null,
            phone: phone || null,
            created_at: new Date().toISOString(),
          },
        ],
        { onConflict: "roblox_username" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blacklist: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to add blacklist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    if (!id && !username) {
      return NextResponse.json(
        { error: "ID atau username wajib disertakan" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("blacklists").delete();

    if (id) {
      query = query.eq("id", Number(id));
    } else if (username) {
      query = query.eq("roblox_username", username.replace(/^@/, "").trim());
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dihapus dari blacklist",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to remove blacklist" },
      { status: 500 }
    );
  }
}
