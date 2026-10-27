import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full border border-clay-400/40 bg-surface-raised">
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
              <path
                d="M12 2.5c2.6 3.3 4.4 5.9 4.4 8.6a4.4 4.4 0 1 1-8.8 0c0-1.3.5-2.5 1.3-3.8.5 1 1.1 1.7 1.8 2.2.1-2.5.5-4.7 1.3-7Z" className="fill-accent"
              />
              <path
                d="M6.5 19.5h11M8.5 22h7" className="stroke-clay-400" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
          </span>
          <h1 className="mt-5 font-display text-3xl text-content">Mission Dashboard</h1>
          <p className="mt-2 text-sm text-content-muted">
            Sign in to manage yatras, events and appointments.
          </p>
        </div>

        <div className="mt-8 border border-line bg-surface-raised p-7 shadow-soft">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-content-subtle">
          <Link href="/" className="hover:text-accent">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
