"use client";

import { useState, useEffect } from "react";

interface EmailEntry {
  _id: string;
  to: string;
  from_name: string;
  subject: string;
  status: "sent" | "failed";
  created_at: string;
  body: string;
  html: string;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [selected, setSelected] = useState<EmailEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/emails")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success) setEmails(data.emails || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Emails</h1>
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Emails</h1>

      <div className="rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">To</th>
              <th className="px-4 py-3 font-medium text-gray-500">Subject</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No emails sent yet.
                </td>
              </tr>
            )}
            {emails.map((email) => (
              <tr
                key={email._id}
                className="cursor-pointer border-b border-gray-50 hover:bg-gray-50"
                onClick={() =>
                  setSelected(selected?._id === email._id ? null : email)
                }
              >
                <td className="px-4 py-3 text-gray-500">
                  {new Date(email.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{email.to}</td>
                <td className="px-4 py-3">{email.subject}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      email.status === "sent"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {email.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">{selected.subject}</h2>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">To:</span> {selected.to}
            </p>
            <p>
              <span className="font-medium">From:</span> {selected.from_name}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            {selected.html ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selected.html }}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{selected.body}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
