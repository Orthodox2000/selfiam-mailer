import { redirect } from "next/navigation";
import { getSessionUser, isSuperAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }
  if (!isSuperAdmin(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
  );
}
