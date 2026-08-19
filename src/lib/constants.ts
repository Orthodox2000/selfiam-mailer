export const DISCLAIMER_TEXT =
  "\n\n---\nThis email was sent via the SelfIAM Mailer Sandbox API. If this is unsolicited, please report it.";

export const DISCLAIMER_HTML =
  '<hr><p style="color:#999;font-size:12px;">This email was sent via the SelfIAM Mailer Sandbox API. If this is unsolicited, please report it.</p>';

export const DEFAULT_FROM_NAME = "SelfIAM Mailer";

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "mailer@mailer.selfiam.site";

export const DAILY_RATE_LIMIT = parseInt(
  process.env.DAILY_RATE_LIMIT || "25",
  10
);

