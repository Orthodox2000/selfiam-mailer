import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, AuditLog } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  const { id } = await params;
  const body = await request.json();
  const { daily_limit } = body;

  if (daily_limit !== null && (typeof daily_limit !== "number" || daily_limit < 1)) {
    return apiError("VAL_001", { fieldErrors: { daily_limit: ["Must be a positive integer or null"] } });
  }

  await connectDB();
  const key = await ApiKey.findByIdAndUpdate(id, { daily_limit }, { new: true });
  if (!key) return apiError("KEY_003");

  await AuditLog.create({
    actor_id: session.id, actor_email: session.email,
    action: "key_limit_updated", target_type: "api_key", target_id: id,
    metadata: { key_name: key.name, key_prefix: key.key_prefix, daily_limit },
  });

  return NextResponse.json({ success: true, daily_limit: key.daily_limit });
}
