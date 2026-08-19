import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            SelfIAM Mailer
          </h1>
          <p className="mt-4 max-w-xl text-gray-500">
            Multi-tenant email API gateway. Send emails via Resend with built-in
            rate limiting, API key management, and a complete admin dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started Free
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              API Documentation
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Simple API</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Send emails with a single POST request. Authenticate with a Bearer
              token API key and get instant delivery via Resend. Full REST API
              with JSON responses and descriptive error codes.
            </p>
            <Link href="/docs" className="mt-4 inline-block text-sm font-medium text-black hover:underline">
              View API docs &rarr;
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Rate Limited</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Built-in daily rate limits per API key with transparent response
              headers. Track your usage in real time with X-RateLimit-Limit,
              X-RateLimit-Remaining, and X-RateLimit-Reset headers.
            </p>
            <Link href="/docs" className="mt-4 inline-block text-sm font-medium text-black hover:underline">
              See rate limit docs &rarr;
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Full Dashboard</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Create and revoke API keys, view all sent emails with full
              content, track daily usage, and manage your account. Admin panel
              with user management and audit logs.
            </p>
            <Link href="/auth/signup" className="mt-4 inline-block text-sm font-medium text-black hover:underline">
              Create free account &rarr;
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 py-16">
          <h2 className="text-center text-2xl font-semibold">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">1</div>
              <h3 className="mt-4 font-medium">Sign up &amp; create a key</h3>
              <p className="mt-1 text-sm text-gray-500">Create an account and generate your first API key in seconds.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">2</div>
              <h3 className="mt-4 font-medium">Send an email</h3>
              <p className="mt-1 text-sm text-gray-500">POST to /api/v1/send with your API key and email payload.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">3</div>
              <h3 className="mt-4 font-medium">Track everything</h3>
              <p className="mt-1 text-sm text-gray-500">View delivery status, usage stats, and email content in your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
