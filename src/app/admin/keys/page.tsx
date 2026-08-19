"use client";

import { useState, useEffect } from "react";

interface AdminKey {
  _id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  user_email: string;
  user_id: string;
}

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/keys")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success) setKeys(data.keys || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function revokeKey(id: string) {
    if (!confirm("Revoke this key? The user will no longer be able to send emails with it.")) return;
    await fetch(`/api/v1/admin/keys/${id}/revoke`, { method: "POST" });
    setKeys((prev) => prev.map((k) => (k._id === id ? { ...k, is_active: false } : k)));
  }

  async function resetUsage(id: string) {
    setResetting(id);
    await fetch(`/api/v1/admin/keys/${id}/reset`, { method: "POST" });
    setResetting(null);
  }

  const filtered = keys.filter(
    (k) =>
      k.user_email.toLowerCase().includes(search.toLowerCase()) ||
      k.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeKeys = filtered.filter((k) => k.is_active);
  const revokedKeys = filtered.filter((k) => !k.is_active);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Key Management</h1>
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Key Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeKeys.length} active &middot; {revokedKeys.length} revoked
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or key name..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black sm:w-72"
        />
      </div>

      {activeKeys.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-gray-500">Active Keys</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Key</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeKeys.map((key) => (
                    <tr key={key._id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-medium">{key.user_email}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{key.key_prefix}</td>
                      <td className="px-4 py-3">{key.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => resetUsage(key._id)}
                            disabled={resetting === key._id}
                            className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                          >
                            {resetting === key._id ? "Resetting..." : "Reset Usage"}
                          </button>
                          <button
                            onClick={() => revokeKey(key._id)}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {revokedKeys.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-gray-500">Revoked Keys</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Key</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {revokedKeys.map((key) => (
                    <tr key={key._id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 text-gray-500">{key.user_email}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{key.key_prefix}</td>
                      <td className="px-4 py-3 text-gray-500">{key.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          Revoked
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
          No keys found.
        </div>
      )}
    </div>
  );
}
