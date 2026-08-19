import mongoose, { Schema, Model } from "mongoose";
import type { IUsageLog } from "@/types";

const UsageLogSchema = new Schema<IUsageLog>({
  api_key_id: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

UsageLogSchema.index({ api_key_id: 1, date: 1 }, { unique: true });

export const UsageLog: Model<IUsageLog> =
  mongoose.models.UsageLog || mongoose.model<IUsageLog>("UsageLog", UsageLogSchema);
