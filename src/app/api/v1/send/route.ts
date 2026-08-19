import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey } from "@/lib/models";
import { verifyApiKey } from "@/lib/api-keys";
import { checkRateLimit } from "@/lib/rate-limit";
import { SendEmailSchema } from "@/lib/schemas/validation";
import { resend } from "@/lib/resend";
import { User, EmailLog } from "@/lib/models";
import {
  FROM_EMAIL,
  DEFAULT_FROM_NAME,
  DISCLAIMER_TEXT,
  DISCLAIMER_HTML,
  DAILY_RATE_LIMIT,
} from "@/lib/constants";
import { apiError } from "@/lib/errors";

function rateLimitHeaders(limit: number, remaining: number, reset: Date): Record<string, string> {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toISOString(),
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return apiError("AUTH_001");
    }

    const rawKey = authHeader.slice(7);
    await connectDB();

    const allKeys = await ApiKey.find({ is_active: true });
    let matchedKey = null;
    for (const key of allKeys) {
      if (verifyApiKey(rawKey, key.key_hash)) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return apiError("KEY_001");
    }

    const user = await User.findById(matchedKey.user_id);
    if (!user) {
      return apiError("USR_001");
    }

    const dailyLimit = matchedKey.daily_limit ?? user.daily_limit ?? DAILY_RATE_LIMIT;
    const rateResult = await checkRateLimit(matchedKey._id.toString(), dailyLimit);

    if (!rateResult.allowed) {
      return apiError("RATE_001");
    }

    const body = await request.json();
    const parsed = SendEmailSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VAL_001", parsed.error.flatten());
    }

    const { to, subject, body: textBody, html, from_name, reply_to } = parsed.data;
    const senderName = from_name || DEFAULT_FROM_NAME;
    const from = `${senderName} <${FROM_EMAIL}>`;

    let emailHtml = html || "";
    let emailText = textBody || "";

    if (html) emailHtml += DISCLAIMER_HTML;
    if (textBody) emailText += DISCLAIMER_TEXT;
    if (!html && textBody) {
      emailHtml = `<pre style="font-family:monospace;white-space:pre-wrap;">${textBody}</pre>${DISCLAIMER_HTML}`;
    }

    const emailLog = await EmailLog.create({
      api_key_id: matchedKey._id.toString(),
      user_id: user._id.toString(),
      to,
      from_name: senderName,
      reply_to: reply_to || "",
      subject,
      body: emailText,
      html: emailHtml,
      status: "sent",
      error_message: "",
      resend_id: "",
    });

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html: emailHtml || undefined,
      text: emailText || undefined,
      replyTo: reply_to || undefined,
    } as Parameters<typeof resend.emails.send>[0]);

    if (error) {
      await EmailLog.findByIdAndUpdate(emailLog._id, { status: "failed", error_message: error.message });
      return apiError("SRV_002", error.message);
    }

    await EmailLog.findByIdAndUpdate(emailLog._id, { resend_id: data?.id || "" });

    return NextResponse.json(
      { success: true, emailId: data?.id, remaining: rateResult.remaining, reset: rateResult.reset },
      { status: 200, headers: rateLimitHeaders(dailyLimit, rateResult.remaining, rateResult.reset) }
    );
  } catch (error) {
    console.error("[API /v1/send]", error);
    return apiError("SRV_001");
  }
}
