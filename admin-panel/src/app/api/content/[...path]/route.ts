import { proxyToBackend } from "@/lib/backend";

// Browser-side calls for the Blogs & Events screens (saves, deletes, image
// uploads) come through here so the session token never leaves the server.
// Only /api/content/* on the backend is reachable; authorization is enforced
// there per content type.
async function forward(request: Request, ctx: RouteContext<"/api/content/[...path]">) {
  const { path } = await ctx.params;
  return proxyToBackend(request, `/api/content/${path.map(encodeURIComponent).join("/")}`);
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
