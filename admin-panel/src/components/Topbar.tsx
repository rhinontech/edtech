import Link from "next/link";
import type { BackendUser } from "@/lib/backend";
import Wordmark from "./Wordmark";
import { Breadcrumbs, MobileNav, UserMenu } from "./TopbarControls";

// Mirrors the public site's navbar: white, blurred, hairline bottom border,
// logo + Montserrat wordmark on the left.
export function Topbar({ user, siteUrl }: { user: BackendUser; siteUrl: string }) {
  const role = user.role.slug;

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="flex h-full shrink-0 items-center gap-2 pl-3 pr-4 md:w-60 md:pl-6">
        <MobileNav role={role} items={user.sidebarItems} siteUrl={siteUrl} />
        <Link href={`/${role}/dashboard`} className="group flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uppercurve_logo_nav.png"
            alt="UpperCurve"
            className="h-8 w-auto transition-transform group-hover:scale-105"
          />
          <Wordmark className="text-lg" />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 pr-3 md:px-6">
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <Breadcrumbs role={role} items={user.sidebarItems} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <UserMenu user={user} siteUrl={siteUrl} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
