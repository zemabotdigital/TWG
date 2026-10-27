import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { signOut } from "./actions";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: "Mission Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page renders inside this layout too, so when there is no
  // session we pass the children straight through without the chrome.
  if (!session) return <>{children}</>;

  return (
    <AdminShell name={session.name} signOutAction={signOut}>
      {children}
    </AdminShell>
  );
}
