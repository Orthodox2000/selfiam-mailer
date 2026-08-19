import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User License Agreement",
  description: "License terms for the use of SelfIAM Mailer software.",
};

export default function EulaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-gray-900">
        End User License Agreement
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: August 19, 2026
      </p>

      <div className="mt-10 space-y-10 font-[family-name:var(--font-geist-sans)] text-gray-700 leading-relaxed">
        <Section id="grant" title="1. License Grant">
          Subject to compliance with this Agreement, SelfIAM Mailer grants you
          a limited, non-exclusive, non-transferable, revocable license to
          access and use the Service for your internal business or personal
          purposes. This license does not include the right to sublicense,
          distribute, or create derivative works based on the Service.
        </Section>

        <Section id="restrictions" title="2. Restrictions">
          You shall not:
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Copy, modify, or distribute any part of the Service or its
              underlying code
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service or
              its infrastructure
            </li>
            <li>
              Use the Service to provide services to third parties without
              written authorization
            </li>
            <li>
              Remove, alter, or obscure any proprietary notices or labels
            </li>
            <li>
              Use the Service in any manner that could damage, disable, or
              impair the Service
            </li>
            <li>
              Reverse engineer, decompile, or disassemble the Service
            </li>
          </ul>
        </Section>

        <Section id="ownership" title="3. Ownership">
          The Service, including all code, documentation, designs, and
          associated intellectual property, is and remains the exclusive
          property of SelfIAM Mailer and its licensors. No title to or
          ownership of the Service is transferred to you under this Agreement.
          All rights not expressly granted are reserved.
        </Section>

        <Section id="warranties" title="4. Disclaimer of Warranties">
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
          INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
          SECURE.
        </Section>

        <Section id="liability" title="5. Limitation of Liability">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SELFIAM
          MAILER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS
          OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION
          WITH YOUR USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY SHALL NOT
          EXCEED THE AMOUNT YOU PAID US DURING THE TWELVE (12) MONTHS
          IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
        </Section>

        <Section id="termination" title="6. Termination">
          This Agreement is effective until terminated. We may terminate your
          license at any time if you fail to comply with any provision of this
          Agreement. Upon termination, you must cease all use of the Service
          and destroy any copies in your possession. Sections 3, 4, 5, and 7
          survive termination.
        </Section>

        <Section id="law" title="7. Governing Law">
          This Agreement shall be governed by and construed in accordance with
          the laws of your jurisdiction, without regard to its conflict of law
          provisions. Any disputes arising under this Agreement shall be
          resolved in the competent courts of the applicable jurisdiction.
        </Section>

        <Section id="contact" title="8. Contact">
          For questions about this End User License Agreement, please contact
          us at{" "}
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
