import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "./mongoose";
import { User } from "./models";
import type { SessionUser } from "@/types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
const SESSION_COOKIE = "sm_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function createToken(user: { id: string; email: string; role: string }): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { id: payload.id as string, email: payload.email as string, role: payload.role as "USER" | "ADMIN" };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(request: Request): Promise<SessionUser | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  return verifyToken(match[1]);
}

export function sessionCookieOptions(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function signup(email: string, password: string) {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return { error: "Email already registered", code: "AUTH_003" };

  const password_hash = await bcrypt.hash(password, 10);
  const role = isSuperAdmin(email.toLowerCase()) ? "ADMIN" : "USER";
  const user = await User.create({ email: email.toLowerCase(), password_hash, role });
  return { user: { id: user._id.toString(), email: user.email, role: user.role } };
}

export async function login(email: string, password: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return { error: "Invalid email or password", code: "AUTH_002" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: "Invalid email or password", code: "AUTH_002" };

  if (isSuperAdmin(email.toLowerCase()) && user.role !== "ADMIN") {
    user.role = "ADMIN";
    await user.save();
  }

  return { user: { id: user._id.toString(), email: user.email, role: user.role } };
}

export function isSuperAdmin(email: string | null): boolean {
  if (!email) return false;
  const admins = (process.env.SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(email);
}

export async function findOrCreateUser(email: string, role: string = "USER") {
  await connectDB();
  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    user = await User.create({ email: normalizedEmail, password_hash: "", role });
  }
  if (isSuperAdmin(normalizedEmail) && user.role !== "ADMIN") {
    user.role = "ADMIN";
    await user.save();
  }
  return { id: user._id.toString(), email: user.email, role: user.role };
}
