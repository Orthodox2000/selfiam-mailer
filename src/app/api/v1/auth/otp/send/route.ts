import { NextResponse } from "next/server";
import { sendEmailOTP } from "@/lib/selfiam";
import { z } from "zod";

const SendOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SendOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Valid email required", code: "VAL_003" },
        { status: 400 }
      );
    }

    const result = await sendEmailOTP(parsed.data.email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      otpRef: result.otpRef,
      expiresIn: result.expiresIn,
      email: parsed.data.email,
    });
  } catch (error) {
    console.error("[API /auth/otp/send]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SRV_001" },
      { status: 500 }
    );
  }
}
