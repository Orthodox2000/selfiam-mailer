import { connectDB } from "./mongoose";
import { UsageLog } from "./models";
import type { RateLimitResult } from "@/types";

function getEndOfDay(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export async function checkRateLimit(
  apiKeyId: string,
  dailyLimit: number
): Promise<RateLimitResult> {
  await connectDB();
  const today = getToday();

  const usage = await UsageLog.findOneAndUpdate(
    { api_key_id: apiKeyId, date: today },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );

  if (usage.count > dailyLimit) {
    await UsageLog.findOneAndUpdate(
      { api_key_id: apiKeyId, date: today },
      { $inc: { count: -1 } }
    );
    return { allowed: false, remaining: 0, reset: getEndOfDay() };
  }

  return {
    allowed: true,
    remaining: dailyLimit - usage.count,
    reset: getEndOfDay(),
  };
}

export async function resetKeyUsage(apiKeyId: string) {
  await connectDB();
  const today = getToday();
  await UsageLog.findOneAndDelete({ api_key_id: apiKeyId, date: today });
}

export async function getUsageCount(apiKeyId: string): Promise<number> {
  await connectDB();
  const today = getToday();
  const usage = await UsageLog.findOne({ api_key_id: apiKeyId, date: today });
  return usage?.count || 0;
}
