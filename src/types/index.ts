export interface IUser {
  _id: string;
  email: string;
  password_hash: string;
  role: "USER" | "ADMIN";
  max_keys: number;
  daily_limit: number;
  created_at: Date;
  updated_at: Date;
}

export interface IApiKey {
  _id: string;
  key_hash: string;
  key_prefix: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}

export interface IUsageLog {
  _id: string;
  api_key_id: string;
  date: string;
  count: number;
}

export interface IEmailLog {
  _id: string;
  api_key_id: string;
  user_id: string;
  to: string;
  from_name: string;
  reply_to: string;
  subject: string;
  body: string;
  html: string;
  status: "sent" | "failed";
  error_message: string;
  resend_id: string;
  created_at: Date;
}

export interface IAuditLog {
  _id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  target_type: "user" | "api_key";
  target_id: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  code?: string;
  details?: unknown;
  data?: T;
}
