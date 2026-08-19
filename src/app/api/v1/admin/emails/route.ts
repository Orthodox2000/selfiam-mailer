import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { EmailLog, ApiKey, User } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  await connectDB();
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);
  const skip = parseInt(url.searchParams.get("skip") || "0");
  const userId = url.searchParams.get("userId");

  const filter: Record<string, unknown> = {};
  if (userId) {
    const userKeys = await ApiKey.find({ user_id: userId }).select("_id");
    filter.api_key_id = { $in: userKeys.map((k) => k._id.toString()) };
  }

  const emails = await EmailLog.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit);
  const total = await EmailLog.countDocuments(filter);

  const enriched = await Promise.all(
    emails.map(async (e) => {
      const key = await ApiKey.findById(e.api_key_id).select("user_id name");
      const emailUser = key ? await User.findById(key.user_id).select("email") : null;
      return {
        _id: e._id, to: e.to, from_name: e.from_name, subject: e.subject,
        status: e.status, error_message: e.error_message, created_at: e.created_at,
        body: e.body, html: e.html, user_email: emailUser?.email || "Unknown",
        key_name: key?.name || "Unknown",
      };
    })
  );

  return NextResponse.json({ success: true, emails: enriched, total });
}
