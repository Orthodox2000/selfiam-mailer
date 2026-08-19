const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = "selfiam@test.com";

async function seed() {
  if (!MONGODB_URI) { console.error("MONGODB_URI not found"); process.exit(1); }

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("users");
    const keys = db.collection("apikeys");

    const user = await users.findOne({ email: EMAIL });
    if (!user) { console.error(`User ${EMAIL} not found`); process.exit(1); }

    const raw = "sk_live_" + crypto.randomBytes(24).toString("hex");
    const key_hash = bcrypt.hashSync(raw, 10);
    const key_prefix = raw.substring(0, 16) + "...";

    await keys.insertOne({
      key_hash,
      key_prefix,
      user_id: user._id.toString(),
      name: "Seed Key",
      is_active: true,
      daily_limit: null,
      created_at: new Date(),
    });

    console.log(`API key created for ${EMAIL}:`);
    console.log(`  key: ${raw}`);
    console.log(`  prefix: ${key_prefix}`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
