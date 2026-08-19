import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, User } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  await connectDB();
  const allKeys = await ApiKey.find().sort({ created_at: -1 });
  const userIds = [...new Set(allKeys.map((k) => k.user_id))];
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = new Map(users.map((u) => [u._id.toString(), u.email]));

  return NextResponse.json({
    success: true,
    keys: allKeys.map((k) => ({
      _id: k._id, key_prefix: k.key_prefix, name: k.name,
      is_active: k.is_active, user_id: k.user_id,
      user_email: userMap.get(k.user_id) || "Unknown",
    })),
  });
}
