// Server-only by construction: next/headers throws if imported into a
// client component, so this module can never leak into the browser bundle.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";

const COOKIE = "twg_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // one week

export type Session = { userId: string; email: string; name: string };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it in .env — generate one with: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(value);
}

/**
 * Verifies an email/password pair.
 * Always runs a bcrypt comparison, even when the account does not exist, so
 * response timing does not reveal which emails are registered.
 */
export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  const hash =
    user?.passwordHash ??
    "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu";
  const matches = await bcrypt.compare(password, hash);

  if (!user || !matches) return null;
  return { userId: user.id, email: user.email, name: user.name } satisfies Session;
}

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** The signed-in admin, or null. Never throws on a bad or expired cookie. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string"
    ) {
      return { userId: payload.userId, email: payload.email, name: payload.name };
    }
    return null;
  } catch {
    return null;
  }
}

/** Use at the top of every protected page and action. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
