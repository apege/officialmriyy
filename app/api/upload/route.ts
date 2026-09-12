import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "payment-proofs";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(-6)}.${ext}`;

    // Upload to Supabase Storage bucket 'assets' or 'public'
    const bucketName = "store-assets";

    // Try to ensure bucket exists
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) {
      // If bucket doesn't exist or fails, fallback to Base64 data URL for instant reliability
      console.warn("Supabase storage upload fallback to base64:", uploadError.message);
      const base64Data = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: base64Data, fallback: true });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
