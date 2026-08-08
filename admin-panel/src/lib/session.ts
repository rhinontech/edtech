import "server-only";
import { jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "admin_session";

const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET);

// Roles are created dynamically (see the Roles admin screen), so this is
// just a slug string — "superadmin" and "admin" are the two built-in ones.
export type Role = string;

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

/** Verifies the JWT issued by the backend. Used in proxy.ts and server components. */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedSecret, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
