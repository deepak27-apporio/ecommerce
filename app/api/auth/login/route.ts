import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
      console.log("body",body)
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json({
      accessToken: data.accessToken,
      user: data.user,
      success: data.success,
      message: data.message,
    });

    // ✅ Backend ki cookie read karo aur frontend domain pe set karo
    const setCookieHeader = res.headers.get("set-cookie");
    console.log("Backend set-cookie:", setCookieHeader);

    if (setCookieHeader) {
      // refreshToken value extract karo
      const refreshToken = setCookieHeader
        .split(";")[0]
        .replace("refreshToken=", "")
        .trim();

      console.log("Extracted refreshToken:", refreshToken);

      // ✅ Ab frontend domain pe set karo
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 din
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}