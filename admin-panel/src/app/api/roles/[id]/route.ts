import { NextResponse } from "next/server";
import { updateRole, deleteRole, BackendError } from "@/lib/backend";

export async function PATCH(request: Request, ctx: RouteContext<"/api/roles/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));

  try {
    const role = await updateRole(id, {
      name: body.name,
      sidebarItemKeys: body.sidebarItemKeys,
    });
    return NextResponse.json({ role });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/roles/[id]">) {
  const { id } = await ctx.params;

  try {
    await deleteRole(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
