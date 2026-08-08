import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, Role } from "./session";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export interface SidebarItemSummary {
  key: string;
  label: string;
  path: string;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: { slug: Role; name: string };
  sidebarItems: SidebarItemSummary[];
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

/** Reads the session cookie on this request and calls the backend with it as a Bearer token. */
async function backendFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    throw new BackendError("Not authenticated", 401);
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  return parseJsonOrThrow(res);
}

export async function getCurrentUser(): Promise<BackendUser> {
  const data = await backendFetch("/api/auth/me");
  return data.user;
}

export interface AdminOverview {
  totalUsers: number;
  byRole: Record<string, number>;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return backendFetch("/api/admin/overview");
}

export interface RoleSummary {
  id: string;
  name: string;
  slug: string;
  isSystem: boolean;
  userCount: number;
  sidebarItemKeys: string[];
}

export interface SidebarCatalogItem extends SidebarItemSummary {
  isEnabled: boolean;
}

export async function listRoles(): Promise<RoleSummary[]> {
  const data = await backendFetch("/api/roles");
  return data.roles;
}

export async function getSidebarCatalog(): Promise<SidebarCatalogItem[]> {
  const data = await backendFetch("/api/sidebar-items");
  return data.sidebarItems;
}

export async function createRole(input: { name: string; sidebarItemKeys: string[] }) {
  const data = await backendFetch("/api/roles", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.role as RoleSummary;
}

export async function updateRole(
  id: string,
  input: { name?: string; sidebarItemKeys?: string[] }
) {
  const data = await backendFetch(`/api/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data.role as RoleSummary;
}

export async function deleteRole(id: string) {
  await backendFetch(`/api/roles/${id}`, { method: "DELETE" });
}
