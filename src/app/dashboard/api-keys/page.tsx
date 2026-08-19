"use client";

import { useState, useEffect } from "react";

interface ApiKeyItem {
  _id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadKeys().then(() => setInitialLoading(false));
  }, []);

  async function loadKeys() {
    const res = await fetch("/api/v1/keys");
    if (res.ok) {
      const data = await res.json();
      setKeys(data.keys || []);
    }
  }

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreatedKey(data.rawKey);
      setNewKeyName("");
      loadKeys();
    } else {
      setError(data.error || "Failed to create key");
    }
    setLoading(false);
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this key? The user will no longer be able to send emails with it.")) return;
    const res = await fetch(`/api/v1/keys/${id}`, { method: "DELETE" });
    if (res.ok) loadKeys();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage API keys for sending emails
        </p>
      </div>

      {createdKey && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Key created. Copy it now — it won&apos;t be shown again.
          </p>
          <code className="mt-2 block break-all rounded bg-white p-3 font-mono text-sm text-gray-800">
            {createdKey}
          </code>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(createdKey)}
              className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              Copy to clipboard
            </button>
            <button
              onClick={() => setCreatedKey(null)}
              className="text-xs text-gray-500 hover:text-black"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form onSubmit={createKey} className="flex gap-2">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Key name (e.g. Production, Dev)"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
          maxLength={64}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Key"}
        </button>
      </form>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {initialLoading ? (
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Key</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No API keys yet. Create one above to get started.
                  </td>
                </tr>
              )}
              {keys.map((key) => (
                <tr key={key._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium">{key.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{key.key_prefix}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        key.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {key.is_active && (
                      <button
                        onClick={() => revokeKey(key._id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
