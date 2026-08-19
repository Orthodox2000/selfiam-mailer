"use client";

import { useState, useEffect } from "react";

interface AdminKey {
  _id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  user_email: string;
  user_id: string;
  daily_limit: number | null;
  usage_today: number;
}

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [limitValue, setLimitValue] = useState("");
  const [savingLimit, setSavingLimit] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    const res = await fetch("/api/v1/admin/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys || []);
    }
    setLoading(false);
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this key? The user will no longer be able to send emails with it.")) return;
    await fetch(`/api/v1/admin/keys/${id}/revoke`, { method: "POST" });
    setKeys((prev) => prev.map((k) => (k._id === id ? { ...k, is_active: false } : k)));
  }

  async function resetUsage(id: string) {
    setResetting(id);
    await fetch(`/api/v1/admin/keys/${id}/reset`, { method: "POST" });
    setKeys((prev) => prev.map((k) => (k._id === id ? { ...k, usage_today: 0 } : k)));
    setResetting(null);
  }

  async function saveKeyLimit(id: string) {
    setSavingLimit(true);
    const val = limitValue.trim() === "" || limitValue.trim() === "null"
      ? null
      : parseInt(limitValue);
    if (val !== null && (isNaN(val) || val < 1)) {
      alert("Must be a positive integer or empty for default.");
      setSavingLimit(false);
      return;
    }
    const res = await fetch(`/api/v1/admin/keys/${id}/limit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ daily_limit: val }),
    });
    if (res.ok) {
      setKeys((prev) => prev.map((k) => (k._id === id ? { ...k, daily_limit: val } : k)));
      setEditingLimit(null);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update limit");
    }
    setSavingLimit(false);
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
                    <th className="px-4 py-3 font-medium text-gray-500">Rate Limit</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Used Today</th>
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
                        {editingLimit === key._id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={limitValue}
                              onChange={(e) => setLimitValue(e.target.value)}
                              min={1}
                              placeholder="user default"
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-black"
                              autoFocus
                            />
                            <button
                              onClick={() => saveKeyLimit(key._id)}
                              disabled={savingLimit}
                              className="rounded bg-black px-2 py-1 text-[10px] font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                              {savingLimit ? "..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingLimit(null)}
                              className="rounded border border-gray-300 px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingLimit(key._id);
                              setLimitValue(key.daily_limit?.toString() || "");
                            }}
                            className="group flex items-center gap-1 rounded border border-transparent px-1.5 py-0.5 text-xs hover:border-gray-200 hover:bg-gray-50"
                          >
                            <span className="font-medium">
                              {key.daily_limit ?? "default"}
                            </span>
                            <svg className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{key.usage_today}</td>
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
