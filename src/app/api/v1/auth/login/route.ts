import { NextResponse } from "next/server";
import { login, createToken, sessionCookieOptions } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", code: "VAL_001", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await login(parsed.data.email, parsed.data.password);
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: 401 }
      );
    }

    const token = await createToken(result.user!);
    const cookieOpts = sessionCookieOptions(token);

    return NextResponse.json(
      { success: true, user: result.user },
      {
        status: 200,
        headers: { "Set-Cookie": `${cookieOpts.name}=${cookieOpts.value}; Path=${cookieOpts.path}; HttpOnly=${cookieOpts.httpOnly}; Secure=${cookieOpts.secure}; SameSite=${cookieOpts.sameSite}; Max-Age=${cookieOpts.maxAge}` },
      }
    );
  } catch (error) {
    console.error("[API /auth/login]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SRV_001" },
      { status: 500 }
    );
  }
}
