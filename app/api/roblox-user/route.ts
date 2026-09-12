import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || !username.trim()) {
    return NextResponse.json(
      { error: "Username Roblox wajib diisi." },
      { status: 400 }
    );
  }

  const cleanUsername = username.trim();

  try {
    // 1. Fetch user data from Roblox official API
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames: [cleanUsername],
        excludeBannedUsers: false,
      }),
      next: { revalidate: 60 },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { error: "Gagal terhubung ke API Roblox. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const userData = await userRes.json();
    const user = userData.data?.[0];

    if (!user) {
      return NextResponse.json(
        {
          error: `Akun Roblox "${cleanUsername}" tidak ditemukan. Pastikan ejaan username benar!`,
        },
        { status: 404 }
      );
    }

    // 2. Fetch official Roblox Avatar headshot thumbnail
    let avatarUrl = "";
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
        { next: { revalidate: 60 } }
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        avatarUrl = thumbData.data?.[0]?.imageUrl || "";
      }
    } catch {
      // Fallback if thumbnail fetch fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        hasVerifiedBadge: !!user.hasVerifiedBadge,
        avatarUrl: avatarUrl,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi gangguan saat memproses pengecekan akun Roblox." },
      { status: 500 }
    );
  }
}
