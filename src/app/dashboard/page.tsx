import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { ApiKey, UsageLog, User } from "@/lib/models";
import { Card } from "@/components/ui/card";

async function getDashboardData(email: string) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return { keyCount: 0, totalUsed: 0, dailyLimit: 25 };

  const keys = await ApiKey.find({ user_id: user._id.toString(), is_active: true });
  const today = new Date().toISOString().split("T")[0];

  let totalUsed = 0;
  for (const key of keys) {
    const usage = await UsageLog.findOne({ api_key_id: key._id.toString(), date: today });
    totalUsed += usage?.count || 0;
  }

  return { keyCount: keys.length, totalUsed, dailyLimit: user.daily_limit };
}

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?redirect=/dashboard");

  const { keyCount, totalUsed, dailyLimit } = await getDashboardData(session.email);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">API Keys</p>
          <p className="mt-1 text-2xl font-semibold">{keyCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Emails Sent Today</p>
          <p className="mt-1 text-2xl font-semibold">{totalUsed}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Remaining Today</p>
          <p className="mt-1 text-2xl font-semibold">{Math.max(0, dailyLimit - totalUsed)}</p>
        </Card>
      </div>
      <Card>
        <p className="text-sm text-gray-500">
          Use the{" "}
          <a href="/dashboard/api-keys" className="underline hover:text-black">API Keys</a>{" "}
          page to create and manage your keys. View sent emails in the{" "}
          <a href="/dashboard/emails" className="underline hover:text-black">Emails</a>{" "}
          page. Read the{" "}
          <a href="/docs" className="underline hover:text-black">API Docs</a>{" "}
          to integrate.
        </p>
      </Card>
    </div>
  );
}
