import { NextResponse } from "next/server";
import { listRoles, createRole, BackendError } from "@/lib/backend";

export async function GET() {
  try {
    const roles = await listRoles();
    return NextResponse.json({ roles });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name) {
    return NextResponse.json({ message: "Role name is required" }, { status: 400 });
  }

  try {
    const role = await createRole({ name: body.name, sidebarItemKeys: body.sidebarItemKeys || [] });
    return NextResponse.json({ role }, { status: 201 });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
