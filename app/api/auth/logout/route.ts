// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Backend ko bhi logout karo
    if (refreshToken) {
      await fetch(`${process.env.API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
    }

    const response = NextResponse.json({ success: true });

    // ✅ Cookie clear karo
    response.cookies.delete("refreshToken");

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}