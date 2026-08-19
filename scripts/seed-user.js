const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
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
const EMAIL = "admin@mailer.selfiam.site";
const PASSWORD = "Admin@12345";

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("users");

    const existing = await users.findOne({ email: EMAIL });
    if (existing) {
      console.log(`User ${EMAIL} already exists (id: ${existing._id}, role: ${existing.role})`);
      return;
    }

    const password_hash = await bcrypt.hash(PASSWORD, 10);
    const result = await users.insertOne({
      email: EMAIL,
      password_hash,
      role: "ADMIN",
      max_keys: 10,
      daily_limit: 25,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("Created super admin user:");
    console.log(`  id:    ${result.insertedId}`);
    console.log(`  email: ${EMAIL}`);
    console.log(`  role:  ADMIN`);
    console.log(`  pass:  ${PASSWORD}`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
