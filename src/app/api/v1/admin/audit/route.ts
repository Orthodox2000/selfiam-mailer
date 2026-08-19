import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { AuditLog } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  await connectDB();
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);
  const skip = parseInt(url.searchParams.get("skip") || "0");

  const logs = await AuditLog.find().sort({ created_at: -1 }).skip(skip).limit(limit);
  const total = await AuditLog.countDocuments();

  return NextResponse.json({
    success: true,
    logs: logs.map((l) => ({
      _id: l._id, actor_email: l.actor_email, action: l.action,
      target_type: l.target_type, target_id: l.target_id,
      metadata: l.metadata, created_at: l.created_at,
    })),
    total,
  });
}
