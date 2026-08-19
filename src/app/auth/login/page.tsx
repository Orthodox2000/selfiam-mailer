"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [step, setStep] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success) router.push(redirect);
      })
      .catch(() => {});
  }, [redirect, router]);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/v1/auth/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      const otpRes = await fetch("/api/v1/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const otpData = await otpRes.json();
      if (otpData.success) {
        setOtpRef(otpData.otpRef);
        setStep("otp");
        setCountdown(60);
      } else {
        setError(otpData.error || "Failed to send OTP");
      }
    } else {
      setError(data.error || "Invalid credentials");
    }
    setLoading(false);
  }

  async function handleOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/v1/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otpRef, otp }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(redirect);
      router.refresh();
    } else {
      setError(data.error || "Invalid OTP");
    }
    setLoading(false);
  }

  async function handleResendOTP() {
    if (countdown > 0) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/v1/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setOtpRef(data.otpRef);
      setCountdown(60);
      setOtp("");
    } else {
      setError(data.error || "Failed to resend OTP");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-center text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        {step === "password"
          ? "Sign in to your SelfIAM Mailer account"
          : `Enter the code sent to ${email}`}
      </p>

      {step === "password" ? (
        <form onSubmit={handlePassword} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              required
              autoComplete="email"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOTP} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:border-black focus:ring-1 focus:ring-black"
              required
              autoFocus
              autoComplete="one-time-code"
            />
            <p className="mt-1 text-xs text-gray-400">6-digit code from your email</p>
          </div>
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => { setStep("password"); setError(""); setOtp(""); }}
              className="text-gray-500 hover:text-black"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0}
              className="text-gray-500 hover:text-black disabled:text-gray-300"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-black hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-gray-100" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
