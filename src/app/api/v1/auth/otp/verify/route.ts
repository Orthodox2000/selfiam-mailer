import { NextResponse } from "next/server";
import { verifyEmailOTP } from "@/lib/selfiam";
import { createToken, sessionCookieOptions, findOrCreateUser } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/auth";
import { z } from "zod";

const VerifyOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
  otpRef: z.string().min(1, "OTP reference required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VerifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", code: "VAL_001", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, otpRef, otp } = parsed.data;
    const result = await verifyEmailOTP(email, otpRef, otp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: 401 }
      );
    }

    const role = isSuperAdmin(email) ? "ADMIN" : "USER";
    const localUser = await findOrCreateUser(email, role);

    const token = await createToken({
      id: localUser.id,
      email: localUser.email,
      role: localUser.role,
    });
    const cookieOpts = sessionCookieOptions(token);

    return NextResponse.json(
      {
        success: true,
        user: { id: localUser.id, email: localUser.email, role: localUser.role },
        selfiam_user: result.user,
        emailVerified: result.emailVerified,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `${cookieOpts.name}=${cookieOpts.value}; Path=${cookieOpts.path}; HttpOnly=${cookieOpts.httpOnly}; Secure=${cookieOpts.secure}; SameSite=${cookieOpts.sameSite}; Max-Age=${cookieOpts.maxAge}`,
        },
      }
    );
  } catch (error) {
    console.error("[API /auth/otp/verify]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SRV_001" },
      { status: 500 }
    );
  }
}
