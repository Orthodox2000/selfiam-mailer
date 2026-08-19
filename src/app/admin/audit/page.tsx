"use client";

import { useState, useEffect } from "react";

interface AuditEntry {
  _id: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    loadLogs();
  }, [page]);

  async function loadLogs() {
    setLoading(true);
    const res = await fetch(`/api/v1/admin/audit?limit=${limit}&skip=${page * limit}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    }
    setLoading(false);
  }

  const totalPages = Math.ceil(total / limit);

  function actionLabel(action: string): string {
    const map: Record<string, string> = {
      user_created: "User Created",
      key_created: "Key Created",
      key_revoked: "Key Revoked",
      key_reset: "Key Usage Reset",
      user_updated: "User Updated",
      user_deleted: "User Deleted",
    };
    return map[action] || action;
  }

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-gray-500">{total} entries</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actor</th>
              <th className="px-4 py-3 font-medium text-gray-500">Action</th>
              <th className="px-4 py-3 font-medium text-gray-500">Target</th>
              <th className="px-4 py-3 font-medium text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-gray-50">
                <td className="px-4 py-3 text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{log.actor_email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {actionLabel(log.action)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {log.target_type}: {log.target_id.slice(-8)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {Object.keys(log.metadata).length > 0
                    ? JSON.stringify(log.metadata)
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
