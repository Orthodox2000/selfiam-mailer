import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, AuditLog, User } from "@/lib/models";
import { generateApiKey } from "@/lib/api-keys";
import { CreateApiKeySchema } from "@/lib/schemas/validation";
import { apiError } from "@/lib/errors";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) return apiError("AUTH_004");

  await connectDB();
  const user = await User.findOne({ email: session.email });
  if (!user) return apiError("USR_001");

  const keys = await ApiKey.find({ user_id: user._id.toString() }).sort({ created_at: -1 });
  return NextResponse.json({
    success: true,
    keys: keys.map((k) => ({
      _id: k._id,
      key_prefix: k.key_prefix,
      name: k.name,
      is_active: k.is_active,
      created_at: k.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) return apiError("AUTH_004");

  await connectDB();
  const user = await User.findOne({ email: session.email });
  if (!user) return apiError("USR_001");

  const existingKeys = await ApiKey.countDocuments({ user_id: user._id.toString(), is_active: true });
  if (existingKeys >= user.max_keys) {
    return apiError("KEY_002");
  }

  const body = await request.json();
  const parsed = CreateApiKeySchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VAL_001", parsed.error.flatten());
  }

  const { rawKey, hash, prefix } = generateApiKey();
  const key = await ApiKey.create({
    key_hash: hash,
    key_prefix: prefix,
    user_id: user._id.toString(),
    name: parsed.data.name,
    is_active: true,
  });

  await AuditLog.create({
    actor_id: user._id.toString(),
    actor_email: user.email,
    action: "key_created",
    target_type: "api_key",
    target_id: key._id.toString(),
    metadata: { key_name: parsed.data.name, key_prefix: prefix },
  });

  return NextResponse.json({ success: true, rawKey, name: parsed.data.name }, { status: 201 });
}
