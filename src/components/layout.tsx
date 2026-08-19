"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success) setUser(d.user);
      })
      .catch(() => {});
  }, [pathname]);

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const isAdmin = user?.role === "ADMIN" || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  function navLink(href: string, label: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`text-sm transition-colors ${active ? "font-medium text-black" : "text-gray-500 hover:text-black"}`}
        onClick={() => setMobileOpen(false)}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold">
          SelfIAM Mailer
        </Link>

        <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden items-center gap-5 sm:flex">
          {user ? (
            <>
              {navLink("/dashboard", "Dashboard")}
              {isAdmin && navLink("/admin", "Admin")}
              {navLink("/docs", "API Docs")}
              <span className="text-xs text-gray-400">{user.email}</span>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-black">
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/docs", "API Docs")}
              <Link href="/auth/login" className="text-sm text-gray-500 hover:text-black">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                {navLink("/dashboard", "Dashboard")}
                {isAdmin && navLink("/admin", "Admin")}
                {navLink("/docs", "API Docs")}
                <span className="text-xs text-gray-400">{user.email}</span>
                <button onClick={logout} className="text-left text-sm text-gray-500 hover:text-black">
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink("/docs", "API Docs")}
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-black" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/signup" className="text-sm font-medium text-black" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} SelfIAM Mailer</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/legal/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/legal/eula" className="hover:text-gray-600">EULA</Link>
            <Link href="/docs" className="hover:text-gray-600">API Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
