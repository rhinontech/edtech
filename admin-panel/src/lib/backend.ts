import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface LoginResult {
  token: string;
  user: BackendUser;
}

export class BackendError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackendError(body.message || "Backend request failed", res.status);
  }
  return body;
}

/** Server-only: exchanges credentials for a token. Called from the login route handler. */
export async function loginRequest(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  return parseJsonOrThrow(res);
}

/** Reads the session cookie set on this request and calls the backend with it as a Bearer token. */
async function authorizedFetch(path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    throw new BackendError("Not authenticated", 401);
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return parseJsonOrThrow(res);
}

export async function getCurrentUser(): Promise<BackendUser> {
  const data = await authorizedFetch("/api/auth/me");
  return data.user;
}

export interface AdminOverview {
  totalUsers: number;
  byRole: Record<string, number>;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return authorizedFetch("/api/admin/overview");
}
