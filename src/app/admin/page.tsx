import Link from "next/link";
import { connectDB } from "@/lib/mongoose";
import { User, ApiKey, EmailLog } from "@/lib/models";
import { Card } from "@/components/ui/card";

async function getAdminData() {
  await connectDB();
  const totalUsers = await User.countDocuments();
  const totalKeys = await ApiKey.countDocuments({ is_active: true });
  const today = new Date().toISOString().split("T")[0];
  const totalEmailsToday = await EmailLog.countDocuments({ created_at: { $gte: new Date(today) } });
  const totalEmailsAll = await EmailLog.countDocuments();
  return { totalUsers, totalKeys, totalEmailsToday, totalEmailsAll };
}

export default async function AdminPage() {
  const { totalUsers, totalKeys, totalEmailsToday, totalEmailsAll } = await getAdminData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-1 text-2xl font-semibold">{totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active API Keys</p>
          <p className="mt-1 text-2xl font-semibold">{totalKeys}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Emails Today</p>
          <p className="mt-1 text-2xl font-semibold">{totalEmailsToday}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total Emails</p>
          <p className="mt-1 text-2xl font-semibold">{totalEmailsAll}</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/users", title: "Manage Users", desc: "Edit limits, roles, delete users" },
          { href: "/admin/keys", title: "Manage Keys", desc: "Revoke keys, reset rate limits" },
          { href: "/admin/emails", title: "All Emails", desc: "Browse email logs across all users" },
          { href: "/admin/audit", title: "Audit Log", desc: "Track all admin actions" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-400"
          >
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
