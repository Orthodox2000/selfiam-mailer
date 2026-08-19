import mongoose, { Schema, Model } from "mongoose";
import type { IEmailLog } from "@/types";

const EmailLogSchema = new Schema<IEmailLog>({
  api_key_id: { type: String, required: true, index: true },
  user_id: { type: String, required: true, index: true },
  to: { type: String, required: true },
  from_name: { type: String, default: "" },
  reply_to: { type: String, default: "" },
  subject: { type: String, required: true },
  body: { type: String, default: "" },
  html: { type: String, default: "" },
  status: { type: String, enum: ["sent", "failed"], required: true },
  error_message: { type: String, default: "" },
  resend_id: { type: String, default: "" },
  created_at: { type: Date, default: Date.now, index: true },
});

export const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);
