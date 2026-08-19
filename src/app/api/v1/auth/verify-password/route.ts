import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Email and password required", code: "VAL_001" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user || !user.password_hash) {
      return NextResponse.json({ success: false, error: "Invalid email or password", code: "AUTH_002" }, { status: 401 });
    }

    const valid = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email or password", code: "AUTH_002" }, { status: 401 });
    }

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error("[API /auth/verify-password]", error);
    return NextResponse.json({ success: false, error: "Internal server error", code: "SRV_001" }, { status: 500 });
  }
}
