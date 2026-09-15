import { cn } from "@/lib/utils";
import { text } from "@/lib/ui";

/** Standard page frame: centred column, title row, optional actions. */
export function Page({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 py-8 md:px-10 md:py-10", className)}>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className={text.pageTitle}>{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-6 py-20 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 ring-1 ring-gray-200/70 [&_svg]:size-5">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
