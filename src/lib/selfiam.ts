const SELFIAM_API_URL = process.env.NEXT_PUBLIC_SELFIAM_API_URL || "https://selfiam.site";
const SELFIAM_API_KEY = process.env.SELFIAM_API_KEY || "";

interface SelfIAMResponse {
  status: string;
  error?: string;
  code?: string;
  otpRef?: string;
  expiresIn?: number;
  remainingEmailOtps?: number;
  token?: string;
  user?: { id: string; username: string; email: string };
  emailVerified?: boolean;
  pendingOtp?: boolean;
}

async function selfiamFetch(
  path: string,
  options: RequestInit = {}
): Promise<SelfIAMResponse> {
  const url = `${SELFIAM_API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${SELFIAM_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  return data;
}

export async function sendEmailOTP(email: string): Promise<{
  success: boolean;
  otpRef?: string;
  expiresIn?: number;
  error?: string;
  code?: string;
}> {
  try {
    const data = await selfiamFetch("/api/v1/auth/email/send", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (data.status === "success" && data.otpRef) {
      return { success: true, otpRef: data.otpRef, expiresIn: data.expiresIn };
    }

    return {
      success: false,
      error: data.error || "Failed to send OTP",
      code: data.code,
    };
  } catch (error) {
    console.error("[SelfIAM sendEmailOTP]", error);
    return { success: false, error: "Failed to connect to SelfIAM" };
  }
}

export async function verifyEmailOTP(
  email: string,
  otpRef: string,
  otp: string
): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; username: string; email: string };
  emailVerified?: boolean;
  error?: string;
  code?: string;
}> {
  try {
    const data = await selfiamFetch("/api/v1/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ email, otpRef, otp }),
    });

    if (data.status === "success" && data.token) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        emailVerified: data.emailVerified,
      };
    }

    return {
      success: false,
      error: data.error || "Invalid or expired OTP",
      code: data.code,
    };
  } catch (error) {
    console.error("[SelfIAM verifyEmailOTP]", error);
    return { success: false, error: "Failed to connect to SelfIAM" };
  }
}
