// Shared class recipes for the admin UI. Monochrome with a single indigo
// accent (the UpperCurve wordmark colour), hairline borders, pill buttons —
// the same restraint as the public site's navbar.

const buttonBase =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

export const button = {
  primary: `${buttonBase} h-9 rounded-full bg-gray-900 px-4 text-[13px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-gray-800 active:scale-[0.98]`,
  secondary: `${buttonBase} h-9 rounded-full border border-gray-200 bg-white px-4 text-[13px] text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-gray-300 hover:text-gray-900`,
  ghost: `${buttonBase} h-9 rounded-full px-3 text-[13px] text-gray-500 hover:bg-gray-100 hover:text-gray-900`,
  icon: `${buttonBase} size-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900`,
  danger: `${buttonBase} h-9 rounded-full px-3 text-[13px] text-gray-500 hover:bg-rose-50 hover:text-rose-600`,
};

export const text = {
  pageTitle: "text-[22px] font-semibold tracking-[-0.02em] text-gray-900",
  sectionTitle: "text-sm font-semibold text-gray-900",
  label: "text-xs font-medium text-gray-500",
  muted: "text-sm text-gray-500",
  meta: "text-xs text-gray-400",
};

/** Bordered container for lists/tables. */
export const surface = "rounded-xl border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]";
