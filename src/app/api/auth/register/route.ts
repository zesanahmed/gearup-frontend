import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL;
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok || !data.success) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const response = NextResponse.json(data);
  response.cookies.set("token", data.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK,
  });

  return response;
}
