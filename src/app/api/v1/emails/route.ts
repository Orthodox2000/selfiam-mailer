import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { EmailLog, ApiKey, User } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) return apiError("AUTH_004");

  await connectDB();
  const user = await User.findOne({ email: session.email });
  if (!user) return apiError("USR_001");

  const userKeys = await ApiKey.find({ user_id: user._id.toString() }).select("_id");
  const keyIds = userKeys.map((k) => k._id.toString());

  const emails = await EmailLog.find({ api_key_id: { $in: keyIds } })
    .sort({ created_at: -1 })
    .limit(100);

  return NextResponse.json({
    success: true,
    emails: emails.map((e) => ({
      _id: e._id,
      to: e.to,
      from_name: e.from_name,
      subject: e.subject,
      status: e.status,
      created_at: e.created_at,
      body: e.body,
      html: e.html,
    })),
  });
}
