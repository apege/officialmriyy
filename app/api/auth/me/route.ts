import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("officialmriyy_admin_token");

  if (!token || token.value !== "valid_session") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: process.env.ADMIN_USERNAME || "admin_official.mriyy",
      role: "admin",
      fullName: "official.mriyy Super Admin",
    },
  });
}
