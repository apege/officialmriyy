import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not defined in .env.local");
      return NextResponse.json(
        { error: "Kredensial admin belum dikonfigurasi di environment server!" },
        { status: 500 }
      );
    }

    const isMatch =
      username?.trim() === validUsername.trim() &&
      password === validPassword;

    if (!isMatch) {
      return NextResponse.json(
        { error: "Username atau Password salah!" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        username: validUsername,
        role: "admin",
        fullName: "official.mriyy Super Admin",
      },
    });

    response.cookies.set("officialmriyy_admin_token", "valid_session", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to login" },
      { status: 500 }
    );
  }
}
