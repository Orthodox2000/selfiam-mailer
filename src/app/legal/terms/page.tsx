import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions governing the use of SelfIAM Mailer.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-gray-900">
        Terms and Conditions
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: August 19, 2026
      </p>

      <div className="mt-10 space-y-10 font-[family-name:var(--font-geist-sans)] text-gray-700 leading-relaxed">
        <Section id="acceptance" title="1. Acceptance of Terms">
          By accessing or using SelfIAM Mailer (&quot;the Service&quot;), you agree
          to be bound by these Terms and Conditions. If you do not agree to these
          terms, you must not use the Service.
        </Section>

        <Section id="description" title="2. Description of Service">
          SelfIAM Mailer is a multi-tenant email API gateway that allows
          authenticated users to send emails via the Resend email service. The
          Service provides API key management, rate limiting, and email delivery
          tracking.
        </Section>

        <Section id="accounts" title="3. User Accounts">
          You must create an account to access the Service. You are responsible
          for maintaining the confidentiality of your credentials and for all
          activity that occurs under your account. You agree to provide accurate
          and complete information during registration and to keep it up to date.
          You must notify us immediately of any unauthorized use of your account.
        </Section>

        <Section id="api" title="4. API Usage">
          The Service is accessed via REST API endpoints. All API requests must
          include a valid Bearer token in the Authorization header. You are
          responsible for the security of your API keys and must not share them
          publicly or commit them to version control. Each API key is tied to a
          single user account.
        </Section>

        <Section id="rate-limits" title="5. Rate Limits">
          The Service enforces per-user daily rate limits on email-sending
          requests. The default limit is 25 emails per day, subject to change
          based on your account tier. Rate limit information is returned in
          response headers. Exceeding the rate limit results in HTTP 429
          responses. We reserve the right to adjust limits without prior notice.
        </Section>

        <Section id="prohibited" title="6. Prohibited Uses">
          You agree not to:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Send unsolicited bulk emails or spam</li>
            <li>Use the Service for phishing, fraud, or other malicious purposes</li>
            <li>Attempt to circumvent rate limits or authentication controls</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
            <li>Resell or redistribute the Service without written authorization</li>
            <li>Violate any applicable law or regulation</li>
          </ul>
        </Section>

        <Section id="ip" title="7. Intellectual Property">
          All content, code, trademarks, and other intellectual property
          associated with SelfIAM Mailer remain the exclusive property of its
          owners. These terms grant you a limited, non-exclusive,
          non-transferable right to use the Service in accordance with these
          terms. No intellectual property rights are transferred to you.
        </Section>

        <Section id="liability" title="8. Limitation of Liability">
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We
          make no warranties regarding the Service&apos;s availability, reliability,
          or accuracy. In no event shall we be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from
          your use of the Service, including but not limited to loss of data,
          revenue, or business opportunities.
        </Section>

        <Section id="termination" title="9. Termination">
          We reserve the right to suspend or terminate your access to the
          Service at our sole discretion, with or without notice, for any
          conduct that we believe violates these terms or is harmful to other
          users or the Service. Upon termination, your API keys will be
          deactivated and your data may be deleted.
        </Section>

        <Section id="law" title="10. Governing Law">
          These Terms and Conditions shall be governed by and construed in
          accordance with the laws of your jurisdiction, without regard to its
          conflict of law provisions. Any disputes arising from these terms
          shall be resolved in the competent courts of the applicable
          jurisdiction.
        </Section>

        <Section id="contact" title="11. Contact">
          For questions about these Terms and Conditions, please contact us at{" "}
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
