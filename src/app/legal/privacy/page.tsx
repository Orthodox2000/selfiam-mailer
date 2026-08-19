import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SelfIAM Mailer collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-gray-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: August 19, 2026
      </p>

      <div className="mt-10 space-y-10 font-[family-name:var(--font-geist-sans)] text-gray-700 leading-relaxed">
        <Section id="collect" title="1. Information We Collect">
          We collect the following types of information when you use the
          Service:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <strong>Account information:</strong> email address, display name,
              and password hash.
            </li>
            <li>
              <strong>API usage data:</strong> API keys (stored as hashes),
              email send logs (recipients, subjects, timestamps, delivery
              status).
            </li>
            <li>
              <strong>Device and browser information:</strong> user agent
              strings and IP addresses for authentication and abuse prevention.
            </li>
          </ul>
        </Section>

        <Section id="use" title="2. How We Use Information">
          We use collected information to:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Provide and maintain the Service</li>
            <li>Authenticate users and manage API keys</li>
            <li>Enforce rate limits and prevent abuse</li>
            <li>Track email delivery status and maintain logs</li>
            <li>Communicate with you about your account</li>
            <li>Improve and optimize the Service</li>
          </ul>
        </Section>

        <Section id="api-keys" title="3. API Key Security">
          API keys are never stored in plaintext. We use one-way cryptographic
          hashes so that your raw key cannot be recovered from our database.
          Only the key prefix (first 8 characters) is stored alongside the
          hash for identification. You are responsible for storing your raw API
          key securely. We cannot recover a lost key.
        </Section>

        <Section id="cookies" title="4. Cookies">
          The Service uses essential session cookies to maintain your
          authentication state. These cookies are strictly necessary for the
          Service to function and are not used for tracking or advertising
          purposes. No third-party cookies are set.
        </Section>

        <Section id="retention" title="5. Data Retention">
          Account data is retained for as long as your account is active.
          Email send logs are retained for up to 90 days. API key metadata is
          retained for the lifetime of the key. When you delete your account,
          we delete your personal data within 30 days, except where retention
          is required by law.
        </Section>

        <Section id="third-party" title="6. Third-Party Services">
          We use the following third-party services that process data on our
          behalf:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <strong>Resend:</strong> email delivery. Email content, recipient
              addresses, and sender information are transmitted to Resend for
              delivery.
            </li>
            <li>
              <strong>MongoDB Atlas:</strong> database hosting. User accounts,
              API key metadata, email logs, and audit logs are stored on
              MongoDB Atlas infrastructure.
            </li>
          </ul>
          Both services operate under their own privacy policies and are used
          solely to provide the core functionality of the Service.
        </Section>

        <Section id="security" title="7. Data Security">
          We implement industry-standard security measures including
          encrypted transit (TLS), hashed API keys, session-based
          authentication, and audit logging. However, no method of electronic
          transmission or storage is 100% secure. We cannot guarantee absolute
          security.
        </Section>

        <Section id="rights" title="8. Your Rights">
          You have the right to:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data in a portable format</li>
            <li>Object to processing of your data</li>
          </ul>
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:support@selfiam.site"
            className="text-gray-900 underline underline-offset-2 hover:text-black"
          >
            support@selfiam.site
          </a>
          .
        </Section>

        <Section id="changes" title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated revision date. Continued use of
          the Service after changes are posted constitutes acceptance of the
          revised policy.
        </Section>

        <Section id="contact" title="10. Contact">
          For questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:support@selfiam.site"
            className="text-gray-900 underline underline-offset-2 hover:text-black"
          >
            support@selfiam.site
          </a>
          .
        </Section>
      </div>
    </div>
  );
}

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
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
