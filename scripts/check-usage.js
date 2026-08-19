const { MongoClient } = require("mongodb");
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

async function check() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const today = new Date().toISOString().split("T")[0];
  const usage = await db.collection("usagelogs").findOne({ date: today });
  console.log("Usage today:", JSON.stringify(usage, null, 2));
  const emailCount = await db.collection("emaillogs").countDocuments();
  console.log("Total email logs:", emailCount);
  const recentEmails = await db.collection("emaillogs").find().sort({ created_at: -1 }).limit(3).toArray();
  recentEmails.forEach((e) => console.log(`  ${e.to} | ${e.subject} | ${e.status} | ${new Date(e.created_at).toISOString()}`));
  await client.close();
}

check().catch(console.error);
