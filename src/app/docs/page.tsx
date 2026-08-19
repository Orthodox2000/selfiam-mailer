import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete API reference for SelfIAM Mailer. Send emails, manage API keys, and track delivery.",
};

const CODE_BLOCK =
  "font-[family-name:var(--font-geist-mono)] rounded-lg bg-gray-900 px-5 py-4 text-sm leading-relaxed text-gray-100 overflow-x-auto";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-gray-900">
        API Documentation
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: August 19, 2026
      </p>

      <div className="mt-12 space-y-16 font-[family-name:var(--font-geist-sans)] text-gray-700 leading-relaxed">
        {/* ───────── Getting Started ───────── */}
        <Section id="getting-started" title="Getting Started">
          <p>
            The SelfIAM Mailer API is a RESTful service for sending emails and
            managing API keys. All requests and responses use JSON.
          </p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Base URL
            </h3>
            <pre className={CODE_BLOCK + " mt-2"}>
              https://mailer.selfiam.site/api/v1
            </pre>
          </div>
        </Section>

        {/* ───────── npm SDK ───────── */}
        <Section id="sdk" title="npm SDK (selfiam-mailer)">
          <p>
            The official Node.js / TypeScript SDK wraps every API endpoint into a
            typed client. Install it with:
          </p>
          <pre className={CODE_BLOCK + " mt-2"}>npm install selfiam-mailer</pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quick Start
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`import { SelfIAMMailer } from "selfiam-mailer";

const mailer = new SelfIAMMailer({
  apiKey: "sk_live_YOUR_API_KEY",
});

const result = await mailer.send({
  to: "user@example.com",
  subject: "Hello!",
  body: "Sent via the npm SDK.",
});

console.log(result.emailId);
console.log(result.rateLimit?.remaining);`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Methods
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Method</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">send(params)</td>
                <td className="py-2">Send an email</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">listKeys()</td>
                <td className="py-2">List API keys</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">createKey(name)</td>
                <td className="py-2">Create a new API key</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">revokeKey(id)</td>
                <td className="py-2">Revoke an API key</td>
              </tr>
              <tr>
                <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">listEmails()</td>
                <td className="py-2">List sent emails</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Configuration
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`const mailer = new SelfIAMMailer({
  apiKey: "sk_live_...",          // Required
  baseUrl: "https://mailer.selfiam.site", // Optional
  timeout: 30000,                 // Optional (ms)
});`}
          </pre>

          <p className="mt-4">
            Full source &amp; docs:{" "}
            <a
              href="https://www.npmjs.com/package/selfiam-mailer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 hover:text-black"
            >
              npmjs.com/package/selfiam-mailer
            </a>
          </p>
        </Section>

        {/* ───────── Authentication ───────── */}
        <Section id="authentication" title="Authentication">
          <p>
            All API requests require a valid API key sent as a Bearer token in
            the{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm">
              Authorization
            </code>{" "}
            header. You can create and manage API keys from the{" "}
            <a
              href="/dashboard/api-keys"
              className="text-gray-900 underline underline-offset-2 hover:text-black"
            >
              dashboard
            </a>
            .
          </p>
          <pre className={CODE_BLOCK + " mt-4"}>
            {`Authorization: Bearer sk_xxxxxxxxxxxxxxxxxxxx`}
          </pre>
          <p className="mt-3">
            Requests without a valid token will receive a{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm">
              401 Unauthorized
            </code>{" "}
            response with the error code{" "}
            <span className="font-[family-name:var(--font-geist-mono)] text-sm font-medium text-gray-900">
              AUTH_001
            </span>
            .
          </p>
        </Section>

        {/* ───────── POST /api/v1/send ───────── */}
        <Section id="send" title="POST /api/v1/send">
          <p>
            Sends an email. This is the primary endpoint of the Service.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Request Body
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Field</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Required</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <Row
                field="to"
                type="string"
                required
                desc="Recipient email address"
              />
              <Row
                field="subject"
                type="string"
                required
                desc="Email subject line"
              />
              <Row
                field="body"
                type="string"
                required
                desc="Plain text email body"
              />
              <Row
                field="html"
                type="string"
                required={false}
                desc="HTML email body (optional, overrides plain text rendering)"
              />
              <Row
                field="from_name"
                type="string"
                required={false}
                desc='Sender display name (default: "SelfIAM Mailer")'
              />
              <Row
                field="reply_to"
                type="string"
                required={false}
                desc="Reply-To email address"
              />
            </tbody>
          </table>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`curl -X POST https://mailer.selfiam.site/api/v1/send \\
  -H "Authorization: Bearer sk_xxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello from SelfIAM Mailer",
    "body": "This is a test email sent via the API.",
    "from_name": "My App"
  }'`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Success Response
            <span className="ml-2 text-green-600">200 OK</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": true,
  "emailId": "re_xxxxxxxxxxxx",
  "remaining": 24,
  "reset": "2026-08-20T00:00:00.000Z"
}`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Error Response
            <span className="ml-2 text-red-600">400 / 401 / 429 / 500</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": false,
  "error": "Validation failed",
  "code": "VAL_001",
  "details": {
    "fieldErrors": {
      "to": ["Invalid email"]
    }
  }
}`}
          </pre>
        </Section>

        {/* ───────── GET /api/v1/keys ───────── */}
        <Section id="list-keys" title="GET /api/v1/keys">
          <p>
            Lists all API keys associated with the authenticated user.
            Returns key metadata only — raw keys are never returned.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Requires session-based authentication.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`curl https://mailer.selfiam.site/api/v1/keys \\
  -H "Authorization: Bearer session_token"`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Response
            <span className="ml-2 text-green-600">200 OK</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": true,
  "keys": [
    {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "key_prefix": "sk_a1b2",
      "name": "Production",
      "is_active": true,
      "created_at": "2026-08-15T10:30:00.000Z"
    }
  ]
}`}
          </pre>
        </Section>

        {/* ───────── POST /api/v1/keys ───────── */}
        <Section id="create-key" title="POST /api/v1/keys">
          <p>
            Creates a new API key. The raw key is returned exactly once in the
            response. Store it securely — it cannot be retrieved later.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Requires session-based authentication. Subject to max active keys
            limit per user.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Request Body
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Field</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Required</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <Row
                field="name"
                type="string"
                required
                desc="A human-readable label for the key"
              />
            </tbody>
          </table>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`curl -X POST https://mailer.selfiam.site/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Production" }'`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Response
            <span className="ml-2 text-green-600">201 Created</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": true,
  "rawKey": "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "name": "Production"
}`}
          </pre>
        </Section>

        {/* ───────── DELETE /api/v1/keys/[id] ───────── */}
        <Section id="revoke-key" title="DELETE /api/v1/keys/[id]">
          <p>
            Revokes (deactivates) an API key. The key will immediately stop
            working for all future requests.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Requires session-based authentication. You can only revoke your own
            keys.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Path Parameters
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Parameter</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <Row
                field="id"
                type="string"
                required
                desc="The MongoDB ObjectId of the API key"
              />
            </tbody>
          </table>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`curl -X DELETE https://mailer.selfiam.site/api/v1/keys/64a1b2c3d4e5f6a7b8c9d0e1`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Response
            <span className="ml-2 text-green-600">200 OK</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": true
}`}
          </pre>
        </Section>

        {/* ───────── GET /api/v1/emails ───────── */}
        <Section id="list-emails" title="GET /api/v1/emails">
          <p>
            Lists the most recent emails sent through the authenticated
            user&apos;s API keys. Returns up to 100 entries sorted by creation
            date (newest first).
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Requires session-based authentication.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example Request
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`curl https://mailer.selfiam.site/api/v1/emails`}
          </pre>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Response
            <span className="ml-2 text-green-600">200 OK</span>
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`{
  "success": true,
  "emails": [
    {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
      "to": "recipient@example.com",
      "from_name": "My App",
      "subject": "Hello from SelfIAM Mailer",
      "status": "sent",
      "created_at": "2026-08-19T14:22:00.000Z",
      "body": "This is a test email sent via the API.",
      "html": "<p>This is a test email sent via the API.</p>"
    }
  ]
}`}
          </pre>
        </Section>

        {/* ───────── Error Codes ───────── */}
        <Section id="errors" title="Error Codes">
          <p>
            All error responses include a{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm">
              code
            </code>{" "}
            field for programmatic handling.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">HTTP Status</th>
                  <th className="pb-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <ErrorCode
                  code="AUTH_001"
                  status="401"
                  desc="Authentication required"
                />
                <ErrorCode
                  code="AUTH_002"
                  status="401"
                  desc="Invalid email or password"
                />
                <ErrorCode
                  code="AUTH_003"
                  status="409"
                  desc="Email already registered"
                />
                <ErrorCode
                  code="AUTH_004"
                  status="401"
                  desc="Invalid or expired session"
                />
                <ErrorCode
                  code="AUTH_005"
                  status="403"
                  desc="Forbidden: insufficient permissions"
                />
                <ErrorCode
                  code="VAL_001"
                  status="400"
                  desc="Validation failed"
                />
                <ErrorCode
                  code="VAL_002"
                  status="400"
                  desc="Missing required field"
                />
                <ErrorCode
                  code="VAL_003"
                  status="400"
                  desc="Invalid email format"
                />
                <ErrorCode
                  code="KEY_001"
                  status="401"
                  desc="Invalid API key"
                />
                <ErrorCode
                  code="KEY_002"
                  status="400"
                  desc="Maximum active keys reached"
                />
                <ErrorCode
                  code="KEY_003"
                  status="404"
                  desc="API key not found"
                />
                <ErrorCode
                  code="RATE_001"
                  status="429"
                  desc="Rate limit exceeded"
                />
                <ErrorCode
                  code="USR_001"
                  status="404"
                  desc="User not found"
                />
                <ErrorCode
                  code="USR_002"
                  status="400"
                  desc="Cannot delete super admin"
                />
                <ErrorCode
                  code="SRV_001"
                  status="500"
                  desc="Internal server error"
                />
                <ErrorCode
                  code="SRV_002"
                  status="500"
                  desc="Email delivery failed"
                />
                <ErrorCode
                  code="SRV_003"
                  status="503"
                  desc="Database connection failed"
                />
              </tbody>
            </table>
          </div>
        </Section>

        {/* ───────── Rate Limiting ───────── */}
        <Section id="rate-limiting" title="Rate Limiting">
          <p>
            The{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm">
              POST /api/v1/send
            </code>{" "}
            endpoint is subject to a daily rate limit. The default limit is{" "}
            <strong>25 requests per day</strong> per user. The limit resets at
            midnight UTC.
          </p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Response Headers
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 font-medium">Header</th>
                  <th className="pb-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">
                    X-RateLimit-Limit
                  </td>
                  <td className="py-2">Maximum requests allowed per day</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">
                    X-RateLimit-Remaining
                  </td>
                  <td className="py-2">
                    Number of requests remaining in the current window
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">
                    X-RateLimit-Reset
                  </td>
                  <td className="py-2">
                    ISO 8601 timestamp when the rate limit resets
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Example
          </h3>
          <pre className={CODE_BLOCK + " mt-2"}>
            {`HTTP/1.1 200 OK
X-RateLimit-Limit: 25
X-RateLimit-Remaining: 24
X-RateLimit-Reset: 2026-08-20T00:00:00.000Z`}
          </pre>
          <p className="mt-3">
            When you exceed the rate limit, the API returns{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-sm">
              429 Too Many Requests
            </code>{" "}
            with error code{" "}
            <span className="font-[family-name:var(--font-geist-mono)] text-sm font-medium text-gray-900">
              RATE_001
            </span>
            . Wait until the reset time before retrying.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* ─── Helper Components ─── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({
  field,
  type,
  required,
  desc,
}: {
  field: string;
  type: string;
  required: boolean;
  desc: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs">
        {field}
      </td>
      <td className="py-2 text-gray-500">{type}</td>
      <td className="py-2">
        {required ? (
          <span className="text-xs font-medium text-gray-900">Yes</span>
        ) : (
          <span className="text-xs text-gray-400">No</span>
        )}
      </td>
      <td className="py-2">{desc}</td>
    </tr>
  );
}

function ErrorCode({
  code,
  status,
  desc,
}: {
  code: string;
  status: string;
  desc: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 font-[family-name:var(--font-geist-mono)] text-xs font-medium text-gray-900">
        {code}
      </td>
      <td className="py-2 text-gray-500">{status}</td>
      <td className="py-2">{desc}</td>
    </tr>
  );
}
