"use client";

import { useState, useEffect } from "react";

interface AdminUser {
  _id: string;
  email: string;
  role: string;
  max_keys: number;
  daily_limit: number;
  created_at: string;
  active_keys: number;
}

interface UserKey {
  _id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  usage_today: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userKeys, setUserKeys] = useState<Record<string, UserKey[]>>({});
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editLimit, setEditLimit] = useState(25);
  const [editMaxKeys, setEditMaxKeys] = useState(2);
  const [editRole, setEditRole] = useState("USER");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/v1/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
    setLoading(false);
  }

  async function toggleDetails(userId: string) {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    if (!userKeys[userId]) {
      const res = await fetch(`/api/v1/admin/keys`);
      if (res.ok) {
        const data = await res.json();
        const keys = (data.keys || []).filter((k: UserKey & { user_id: string }) => k.user_id === userId);
        setUserKeys((prev) => ({ ...prev, [userId]: keys }));
      }
    }
  }

  async function saveUser() {
    if (!editingUser) return;
    setSaving(true);
    const res = await fetch(`/api/v1/admin/users/${editingUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ daily_limit: editLimit, max_keys: editMaxKeys, role: editRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id
            ? { ...u, daily_limit: editLimit, max_keys: editMaxKeys, role: editRole }
            : u
        )
      );
      setEditingUser(null);
    }
    setSaving(false);
  }

  async function resetKeyUsage(keyId: string, userId: string) {
    await fetch(`/api/v1/admin/keys/${keyId}/reset`, { method: "POST" });
    setUserKeys((prev) => ({
      ...prev,
      [userId]: (prev[userId] || []).map((k) =>
        k._id === keyId ? { ...k, usage_today: 0 } : k
      ),
    }));
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Delete user ${email}? This will revoke all their keys. This cannot be undone.`)) return;
    const res = await fetch(`/api/v1/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (expandedUser === id) setExpandedUser(null);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete user");
    }
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="h-64 animate-pulse rounded-lg border border-gray-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">{users.length} registered users</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black sm:w-72"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
            No users found.
          </div>
        )}

        {filtered.map((user) => (
          <div key={user._id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div
              className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50"
              onClick={() => toggleDetails(user._id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
                <div className="hidden text-right text-sm text-gray-500 sm:block">
                  <p>{user.active_keys} keys &middot; {user.daily_limit}/day</p>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedUser === user._id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            {expandedUser === user._id && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Role</p>
                    <p className="mt-0.5 text-sm font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Daily Limit</p>
                    <p className="mt-0.5 text-sm font-medium">{user.daily_limit} emails</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Max API Keys</p>
                    <p className="mt-0.5 text-sm font-medium">{user.max_keys}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Active Keys</p>
                    <p className="mt-0.5 text-sm font-medium">{user.active_keys}</p>
                  </div>
                </div>

                {userKeys[user._id] && userKeys[user._id].length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-gray-400">API Keys</p>
                    <div className="rounded-md border border-gray-100">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-3 py-2 font-medium text-gray-500">Name</th>
                            <th className="px-3 py-2 font-medium text-gray-500">Key</th>
                            <th className="px-3 py-2 font-medium text-gray-500">Status</th>
                            <th className="px-3 py-2 font-medium text-gray-500">Used Today</th>
                            <th className="px-3 py-2 font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userKeys[user._id].map((key) => (
                            <tr key={key._id} className="border-b border-gray-50 last:border-0">
                              <td className="px-3 py-2 font-medium">{key.name}</td>
                              <td className="px-3 py-2 font-mono text-gray-500">{key.key_prefix}</td>
                              <td className="px-3 py-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  key.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                                }`}>
                                  {key.is_active ? "Active" : "Revoked"}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-gray-500">{key.usage_today}</td>
                              <td className="px-3 py-2">
                                {key.is_active && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); resetKeyUsage(key._id, user._id); }}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Reset Usage
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setEditLimit(user.daily_limit);
                      setEditMaxKeys(user.max_keys);
                      setEditRole(user.role);
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                  >
                    Edit Limits
                  </button>
                  <button
                    onClick={() => deleteUser(user._id, user.email)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditingUser(null)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Edit User</h2>
            <p className="mt-1 text-sm text-gray-500">{editingUser.email}</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Email Limit</label>
                <input
                  type="number"
                  value={editLimit}
                  onChange={(e) => setEditLimit(parseInt(e.target.value) || 1)}
                  min={1}
                  max={10000}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max API Keys</label>
                <input
                  type="number"
                  value={editMaxKeys}
                  onChange={(e) => setEditMaxKeys(parseInt(e.target.value) || 1)}
                  min={1}
                  max={50}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUser}
                  disabled={saving}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
