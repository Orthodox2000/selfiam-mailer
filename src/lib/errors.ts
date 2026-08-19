export const ERROR_CODES = {
  AUTH_001: { message: "Authentication required", status: 401 },
  AUTH_002: { message: "Invalid email or password", status: 401 },
  AUTH_003: { message: "Email already registered", status: 409 },
  AUTH_004: { message: "Invalid or expired session", status: 401 },
  AUTH_005: { message: "Forbidden: insufficient permissions", status: 403 },

  VAL_001: { message: "Validation failed", status: 400 },
  VAL_002: { message: "Missing required field", status: 400 },
  VAL_003: { message: "Invalid email format", status: 400 },

  KEY_001: { message: "Invalid API key", status: 401 },
  KEY_002: { message: "Maximum active keys reached", status: 400 },
  KEY_003: { message: "API key not found", status: 404 },

  RATE_001: { message: "Rate limit exceeded", status: 429 },

  USR_001: { message: "User not found", status: 404 },
  USR_002: { message: "Cannot delete super admin", status: 400 },

  SRV_001: { message: "Internal server error", status: 500 },
  SRV_002: { message: "Email delivery failed", status: 500 },
  SRV_003: { message: "Database connection failed", status: 503 },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function apiError(code: ErrorCode, details?: unknown) {
  const { message, status } = ERROR_CODES[code];
  return Response.json({ success: false, error: message, code, details }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, ...data }, { status });
}
