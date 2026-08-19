import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateApiKey() {
  const raw = "sk_live_" + crypto.randomBytes(24).toString("hex");
  const hash = bcrypt.hashSync(raw, 10);
  const prefix = raw.substring(0, 16) + "...";
  return { rawKey: raw, hash, prefix };
}

export function verifyApiKey(rawKey: string, storedHash: string): boolean {
  return bcrypt.compareSync(rawKey, storedHash);
}
