import mongoose, { Schema, Model } from "mongoose";
import type { IApiKey } from "@/types";

const ApiKeySchema = new Schema<IApiKey>({
  key_hash: { type: String, required: true, unique: true, index: true },
  key_prefix: { type: String, required: true },
  user_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export const ApiKey: Model<IApiKey> =
  mongoose.models.ApiKey || mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
