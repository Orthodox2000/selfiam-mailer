import mongoose, { Schema, Model } from "mongoose";
import type { IAuditLog } from "@/types";

const AuditLogSchema = new Schema<IAuditLog>({
  actor_id: { type: String, required: true },
  actor_email: { type: String, required: true },
  action: { type: String, required: true },
  target_type: { type: String, required: true },
  target_id: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
});

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
