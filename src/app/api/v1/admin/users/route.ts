import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User, ApiKey } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  await connectDB();
  const users = await User.find().sort({ created_at: -1 });
  const userIds = users.map((u) => u._id.toString());
  const keys = await ApiKey.find({ user_id: { $in: userIds }, is_active: true });
  const keysPerUser: Record<string, number> = {};
  for (const k of keys) {
    keysPerUser[k.user_id] = (keysPerUser[k.user_id] || 0) + 1;
  }

  return NextResponse.json({
    success: true,
    users: users.map((u) => ({
      _id: u._id,
      email: u.email,
      role: u.role,
      max_keys: u.max_keys,
      daily_limit: u.daily_limit,
      created_at: u.created_at,
      active_keys: keysPerUser[u._id.toString()] || 0,
    })),
  });
}
