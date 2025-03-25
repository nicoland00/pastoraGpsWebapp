import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.IXORIGUE_TOKEN;
  const baseUrl = process.env.IXORIGUE_API_URL || "https://api.ixorigue.com";

  if (!token) {
    return NextResponse.json({ error: "No token set" }, { status: 500 });
  }

  const res = await fetch(`${baseUrl}/api/Ranches`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: `Ixorigue ranches error: ${res.status}` },
      { status: 500 }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
