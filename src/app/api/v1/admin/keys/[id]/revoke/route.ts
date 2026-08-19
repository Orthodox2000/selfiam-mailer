import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, AuditLog } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  const { id } = await params;
  await connectDB();

  const key = await ApiKey.findByIdAndUpdate(id, { is_active: false }, { new: true });
  if (!key) return apiError("KEY_003");

  await AuditLog.create({
    actor_id: session.id, actor_email: session.email,
    action: "key_revoked", target_type: "api_key", target_id: id,
    metadata: { key_name: key.name, key_prefix: key.key_prefix },
  });

  return NextResponse.json({ success: true });
}
