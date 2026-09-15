import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, Role } from "./session";
import type { BlogPost, EventItem } from "./content";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

/** Public UpperCurve site, for "View live" links and site-relative images. */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3001").replace(/\/$/, "");

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

// Deduped per request: the [role] layout and the pages under it both need it.
export const getCurrentUser = cache(async (): Promise<BackendUser> => {
  const data = await backendFetch("/api/auth/me");
  return data.user;
});

/** Mirrors Backend's requireSidebarItem: superadmin, or a role holding the item. */
export function canAccess(user: BackendUser, sidebarItemKey: string) {
  return user.role.slug === "superadmin" || user.sidebarItems.some((item) => item.key === sidebarItemKey);
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

// ── Content (blogs & events) ─────────────────────────────────────────

export async function listBlogs(): Promise<BlogPost[]> {
  const data = await backendFetch("/api/content/blogs");
  return data.blogs;
}

export async function getBlog(id: string): Promise<BlogPost> {
  const data = await backendFetch(`/api/content/blogs/${encodeURIComponent(id)}`);
  return data.blog;
}

export async function listEvents(): Promise<EventItem[]> {
  const data = await backendFetch("/api/content/events");
  return data.events;
}

export async function getEvent(id: string): Promise<EventItem> {
  const data = await backendFetch(`/api/content/events/${encodeURIComponent(id)}`);
  return data.event;
}

/**
 * Forwards a browser request to the backend with the session token attached.
 * The body is passed through untouched (Content-Type included), so JSON and
 * multipart image uploads both work without re-encoding.
 */
export async function proxyToBackend(request: Request, backendPath: string): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { search } = new URL(request.url);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const contentType = request.headers.get("content-type");

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${backendPath}${search}`, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(hasBody && contentType ? { "Content-Type": contentType } : {}),
      },
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });
  } catch {
    return Response.json({ message: "Unable to reach the server" }, { status: 502 });
  }

  if (res.status === 204) return new Response(null, { status: 204 });

  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
