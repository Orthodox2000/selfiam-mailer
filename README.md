# SelfIAM Mailer

[![npm](https://img.shields.io/npm/v/selfiam-mailer?color=blue&label=npm&logo=npm)](https://www.npmjs.com/package/selfiam-mailer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Multi-tenant email API gateway built with Next.js 16, MongoDB, and Resend. Send transactional emails via a REST API with built-in rate limiting, API key management, and a complete admin dashboard.

## Features

- **REST API** — Send emails with a single `POST /api/v1/send` request, authenticated via Bearer token
- **Rate Limiting** — Per-key daily limits with transparent `X-RateLimit-*` response headers
- **API Key Management** — Create, revoke, and reset usage on API keys from the dashboard
- **Email Tracking** — View all sent emails with full content and delivery status
- **Admin Dashboard** — User management, key oversight, email logs, and audit trails
- **Super Admin** — Role-based access; manage users (limits, keys, roles, deletion), view all emails and keys
- **Self-Contained Auth** — JWT + bcrypt authentication (no external auth dependencies)
- **CORS Support** — Configurable origin restrictions via environment variable
- **Error Code System** — Descriptive error codes for all API responses
- **Legal Pages** — Terms of Service, Privacy Policy, EULA
- **Responsive UI** — Mobile-first design with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Email | Resend |
| Auth | jose (JWT) + bcryptjs |
| Validation | Zod |
| Styling | Tailwind CSS 4 |
| Deployment | Vercel |

## Getting Started

### Install the SDK

```bash
npm install selfiam-mailer
```

```ts
import { SelfIAMMailer } from "selfiam-mailer";

const mailer = new SelfIAMMailer({ apiKey: "sk_live_YOUR_KEY" });
const res = await mailer.send({ to: "user@example.com", subject: "Hi", body: "Hello!" });
console.log(res.emailId, res.rateLimit?.remaining);
```

[Full SDK docs →](https://www.npmjs.com/package/selfiam-mailer)

### Prerequisites (self-hosted)

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Resend API key ([resend.com](https://resend.com))

### Installation

```bash
git clone https://github.com/your-username/selfiam-mailer.git
cd selfiam-mailer
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key (`re_...`) |
| `RESEND_FROM_EMAIL` | Verified sender email address |
| `DAILY_RATE_LIMIT` | Default emails per day per key (default: 25) |
| `SUPER_ADMIN_EMAILS` | Comma-separated emails for super admin access |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g., `http://localhost:3000` or `https://mailer.selfiam.site`) |
| `JWT_SECRET` | Random secret for JWT signing (generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

Or deploy directly to Vercel — all routes are compatible with Vercel's serverless functions.

## API Reference

### Send Email

```bash
curl -X POST https://mailer.selfiam.site/api/v1/send \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient@example.com"],
    "subject": "Hello from SelfIAM Mailer",
    "html": "<h1>Hello!</h1><p>This is a test email.</p>"
  }'
```

### Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max emails per day |
| `X-RateLimit-Remaining` | Remaining emails today |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/send` | Send an email |
| `GET` | `/api/v1/emails` | List your sent emails |
| `POST` | `/api/v1/keys` | Create an API key |
| `GET` | `/api/v1/keys` | List your API keys |
| `DELETE` | `/api/v1/keys/:id` | Revoke an API key |
| `POST` | `/api/v1/keys/:id/reset` | Reset daily usage |

### Error Codes

| Code | Meaning |
|------|---------|
| `AUTH_001` | Missing or invalid authentication |
| `AUTH_002` | Invalid email or password |
| `AUTH_003` | Email already registered |
| `AUTH_004` | Account suspended |
| `AUTH_005` | Invalid or expired token |
| `VAL_001` | Invalid request body |
| `VAL_002` | Missing required field |
| `VAL_003` | Invalid email format |
| `KEY_001` | Invalid or revoked API key |
| `KEY_002` | Too many active keys |
| `KEY_003` | Key limit reached |
| `RATE_001` | Daily rate limit exceeded |
| `USR_001` | User not found |
| `USR_002` | Insufficient permissions |
| `SRV_001` | Internal server error |
| `SRV_002` | Database connection failed |
| `SRV_003` | Email delivery failed |

## Project Structure

```
src/
├── app/
│   ├── api/v1/          # REST API routes
│   ├── auth/            # Login & signup pages
│   ├── dashboard/       # User dashboard (keys, emails)
│   ├── admin/           # Admin panel (users, keys, emails, audit)
│   ├── docs/            # API documentation page
│   ├── legal/           # Terms, Privacy, EULA
│   └── page.tsx         # Landing page
├── components/          # Shared UI components
├── lib/
│   ├── auth.ts          # JWT auth, signup, login
│   ├── errors.ts        # Error code system
│   ├── models/          # Mongoose schemas
│   ├── resend.ts        # Resend client
│   ├── validation.ts    # Zod schemas
│   └── rate-limit.ts    # Rate limit logic
├── types/               # TypeScript interfaces
└── proxy.ts             # JWT proxy middleware
```

## License

See [LICENSE](LICENSE) for details.
