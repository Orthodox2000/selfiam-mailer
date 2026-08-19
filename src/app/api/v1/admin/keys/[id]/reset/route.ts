import { NextResponse } from "next/server";
import { getSessionFromRequest, isSuperAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { AuditLog } from "@/lib/models";
import { resetKeyUsage } from "@/lib/rate-limit";
import { apiError } from "@/lib/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || !isSuperAdmin(session.email)) return apiError("AUTH_005");

  const { id } = await params;
  await connectDB();
  await resetKeyUsage(id);

  await AuditLog.create({
    actor_id: session.id, actor_email: session.email,
    action: "key_reset", target_type: "api_key", target_id: id, metadata: {},
  });

  return NextResponse.json({ success: true });
}
