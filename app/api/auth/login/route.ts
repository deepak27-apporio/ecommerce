import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    const setCookieHeader = res.headers.get("set-cookie");

    if (setCookieHeader) {
      const refreshToken = setCookieHeader
        .split(";")[0]
        .replace("refreshToken=", "")
        .trim();


      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, 
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
