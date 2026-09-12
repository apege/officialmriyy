import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: logs, error: logsErr } = await supabaseAdmin
      .from("storage_cleanup_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Query orders that actually have a payment proof (not null and not empty)
    const { data: allProofOrders } = await supabaseAdmin
      .from("orders")
      .select("id, order_code, created_at, payment_proof_path")
      .not("payment_proof_path", "is", null)
      .neq("payment_proof_path", "");

    const validProofOrders = (allProofOrders || []).filter(
      (o: any) => o.payment_proof_path && String(o.payment_proof_path).trim() !== ""
    );

    const activeCount = validProofOrders.length;
    const nowMs = Date.now();
    const eightyThreeDaysMs = 83 * 24 * 60 * 60 * 1000;
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

    let expiringCount = 0;
    let expiredCount = 0;

    validProofOrders.forEach((o: any) => {
      const orderAge = nowMs - new Date(o.created_at).getTime();
      if (orderAge >= ninetyDaysMs) {
        expiredCount++;
      } else if (orderAge >= eightyThreeDaysMs) {
        expiringCount++;
      }
    });

    return NextResponse.json({
      stats: {
        activeCount: activeCount,
        active: activeCount,
        expiringSoonCount: expiringCount,
        expiring: expiringCount,
        expiredCount: expiredCount,
        expired: expiredCount,
        retentionDays: 90,
      },
      logs: logs || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch storage cleanup stats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mode = "manual", executed_by = "admin" } = body;

    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

    // Find expired orders with payment proof
    const { data: expiredOrders, error: fetchErr } = await supabaseAdmin
      .from("orders")
      .select("id, order_code, payment_proof_path")
      .not("payment_proof_path", "is", null)
      .lte("created_at", ninetyDaysAgo);

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const orderCodes = (expiredOrders || []).map((o) => o.order_code);
    const cleanedCount = orderCodes.length;

    if (cleanedCount > 0) {
      // Clear payment proof paths from orders
      await supabaseAdmin
        .from("orders")
        .update({ payment_proof_path: null, updated_at: new Date().toISOString() })
        .in("id", (expiredOrders || []).map((o) => o.id));

      // Record cleanup log
      await supabaseAdmin.from("storage_cleanup_logs").insert([
        {
          cleaned_count: cleanedCount,
          order_codes: orderCodes,
          mode,
          executed_by,
          details: {
            retention_days: 90,
            timestamp: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      cleaned_count: cleanedCount,
      order_codes: orderCodes,
      message: `Berhasil membersihkan ${cleanedCount} bukti pembayaran yang kadaluarsa (>90 hari).`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to execute cleanup" },
      { status: 500 }
    );
  }
}
