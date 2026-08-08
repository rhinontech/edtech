import Wordmark from "@/components/Wordmark";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/uppercurve_logo_nav.png"
            alt="UpperCurve"
            className="mb-4 h-10 w-auto"
          />
          <Wordmark className="text-2xl" />
          <p className="mt-2 text-sm text-slate-500">Internal access only</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
