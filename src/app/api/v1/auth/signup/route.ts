import { NextResponse } from "next/server";
import { signup, createToken, sessionCookieOptions } from "@/lib/auth";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", code: "VAL_001", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await signup(parsed.data.email, parsed.data.password);
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: result.code === "AUTH_003" ? 409 : 400 }
      );
    }

    const token = await createToken(result.user!);
    const cookieOpts = sessionCookieOptions(token);

    return NextResponse.json(
      { success: true, user: result.user },
      {
        status: 201,
        headers: { "Set-Cookie": `${cookieOpts.name}=${cookieOpts.value}; Path=${cookieOpts.path}; HttpOnly=${cookieOpts.httpOnly}; Secure=${cookieOpts.secure}; SameSite=${cookieOpts.sameSite}; Max-Age=${cookieOpts.maxAge}` },
      }
    );
  } catch (error) {
    console.error("[API /auth/signup]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SRV_001" },
      { status: 500 }
    );
  }
}
