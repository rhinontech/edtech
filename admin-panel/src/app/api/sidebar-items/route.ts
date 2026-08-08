import { NextResponse } from "next/server";
import { getSidebarCatalog, BackendError } from "@/lib/backend";

export async function GET() {
  try {
    const sidebarItems = await getSidebarCatalog();
    return NextResponse.json({ sidebarItems });
  } catch (err) {
    if (err instanceof BackendError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Unable to reach the server" }, { status: 502 });
  }
}
