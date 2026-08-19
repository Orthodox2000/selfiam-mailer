type BadgeVariant = "sent" | "failed" | "active" | "revoked";

const styles: Record<BadgeVariant, string> = {
  sent: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  active: "bg-green-50 text-green-700",
  revoked: "bg-gray-100 text-gray-600",
};

export function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
