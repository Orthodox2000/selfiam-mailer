"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
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
        if (d?.success) router.push("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
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
      setStep("otp");
      setCountdown(60);
    } else {
      setError(data.error || "Failed to send OTP");
    }
    setLoading(false);
  }

  async function handleVerifyOTP(e: React.FormEvent) {
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
      router.push("/dashboard");
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
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold">Create an account</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          {step === "email"
            ? "Get started with the SelfIAM Mailer API"
            : `We sent a code to ${email}`}
        </p>

        {step === "email" ? (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-4">
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
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send OTP Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-4">
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
              <p className="mt-1 text-xs text-gray-400">Enter the 6-digit code from your email</p>
            </div>
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                className="text-gray-500 hover:text-black"
              >
                &larr; Change email
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
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
