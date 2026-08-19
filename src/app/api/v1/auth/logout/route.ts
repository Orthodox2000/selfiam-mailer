import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": "sm_session=; Path=/; HttpOnly; Max-Age=0",
      },
    }
  );
}
