import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User, AuditLog } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  const { id } = await params;
  const body = await request.json();
  await connectDB();

  const update: Record<string, unknown> = {};
  if (body.daily_limit !== undefined) update.daily_limit = body.daily_limit;
  if (body.max_keys !== undefined) update.max_keys = body.max_keys;
  if (body.role !== undefined) update.role = body.role;

  const updated = await User.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return apiError("USR_001");

  await AuditLog.create({
    actor_id: session.id,
    actor_email: session.email,
    action: "user_updated",
    target_type: "user",
    target_id: id,
    metadata: { changes: update, target_email: updated.email },
  });

  return NextResponse.json({
    success: true,
    user: { _id: updated._id, email: updated.email, role: updated.role, max_keys: updated.max_keys, daily_limit: updated.daily_limit },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  const { id } = await params;
  await connectDB();

  const target = await User.findById(id);
  if (!target) return apiError("USR_001");
  if (isSuperAdmin(target.email)) return apiError("USR_002");

  await User.findByIdAndDelete(id);
  await AuditLog.create({
    actor_id: session.id,
    actor_email: session.email,
    action: "user_deleted",
    target_type: "user",
    target_id: id,
    metadata: { target_email: target.email },
  });

  return NextResponse.json({ success: true });
}
