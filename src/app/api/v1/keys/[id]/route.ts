import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, User } from "@/lib/models";
import { apiError } from "@/lib/errors";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) return apiError("AUTH_004");

  const { id } = await params;
  await connectDB();
  const user = await User.findOne({ email: session.email });
  if (!user) return apiError("USR_001");

  const key = await ApiKey.findOneAndUpdate(
    { _id: id, user_id: user._id.toString() },
    { is_active: false },
    { new: true }
  );

  if (!key) return apiError("KEY_003");
  return NextResponse.json({ success: true });
}
