"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="#000" />
      <path d="M8 12l8 5 8-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="10" width="20" height="14" rx="2" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

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

  const isAdmin = user?.role === "ADMIN";

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
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-semibold">SelfIAM Mailer</span>
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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold">SelfIAM Mailer</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Multi-tenant email API gateway. Send transactional emails with built-in rate limiting and API key management.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/docs" className="text-sm text-gray-500 hover:text-black">API Documentation</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-500 hover:text-black">Dashboard</Link></li>
              <li><Link href="/auth/signup" className="text-sm text-gray-500 hover:text-black">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/legal/terms" className="text-sm text-gray-500 hover:text-black">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-gray-500 hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/legal/eula" className="text-sm text-gray-500 hover:text-black">EULA</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="mailto:support@selfiam.site" className="text-sm text-gray-500 hover:text-black">
                  support@selfiam.site
                </a>
              </li>
              <li>
                <a href="https://github.com/your-username/selfiam-mailer" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SelfIAM. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            mailer.selfiam.site
          </p>
        </div>
      </div>
    </footer>
  );
}
