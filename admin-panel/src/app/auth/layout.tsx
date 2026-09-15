import Wordmark from "@/components/Wordmark";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-white px-4 py-16">
      {/* The dot grid used behind the public site's hero and footer. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] bg-size-[18px_18px] mask-[radial-gradient(ellipse_50%_45%_at_50%_45%,#000_20%,transparent_90%)] opacity-50" />

      <div className="relative w-full max-w-90">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uppercurve_logo_nav.png" alt="" className="h-9 w-auto" />
            <Wordmark className="text-xl" />
          </div>
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-gray-900">Sign in to Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Manage content for the UpperCurve website.</p>
        </div>

        <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.08)] backdrop-blur">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">Internal access only</p>
      </div>
    </main>
  );
}
