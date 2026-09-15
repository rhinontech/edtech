/* eslint-disable @next/next/no-img-element */
import {
  formatEventDateLabel,
  isEmptyHtml,
  resolveAsset,
  themeOf,
  type EventInput,
} from "@/lib/content";

// Replicas of uppercurve/components/Pages/Events/FeaturedMasterclass (card)
// and EventDetails (page), driven by event data instead of the site's
// hardcoded EVENT_VISUALS / instructor copy. Class names match the site.

const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const BellPath = "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z";
const MarkerPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z";

type BannerData = Pick<EventInput, "title" | "tagline" | "type" | "mode" | "theme" | "coverImage" | "poster" | "instructor">;

/** Left half of the FeaturedMasterclass card. A thumbnail, if set, replaces the generated artwork. */
export function EventBanner({ event, siteUrl, className = "" }: { event: BannerData; siteUrl: string; className?: string }) {
  const theme = themeOf(event.theme);
  const cover = resolveAsset(event.coverImage, siteUrl);
  const avatar = resolveAsset(event.instructor.avatar, siteUrl);
  const posterTitle = event.poster.title || event.title || "Event title";
  const posterSubtitle = event.poster.subtitle || event.tagline;
  const badgeText = event.poster.badgeText || event.mode.toUpperCase();
  const badgeType = event.poster.badgeType || event.type;

  if (cover) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${theme.banner} text-white p-6 sm:p-7 flex flex-col justify-between ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 opacity-85">
        <span className="text-[11px] font-extrabold tracking-tight [font-family:var(--font-montserrat)] text-white/90">
          UPPER<span className="text-cyan-400">CURVE</span>
        </span>
      </div>

      <div className="relative z-10 max-w-[280px]">
        <div
          style={{ backgroundColor: theme.accent }}
          className="inline-block text-[#0f172a] text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm mb-3"
        >
          {event.poster.ribbon || "LIMITED SEATS"}
        </div>

        <h3 style={{ color: theme.accent }} className="text-2xl sm:text-3xl font-black leading-tight tracking-tight drop-shadow-sm">
          {posterTitle}
        </h3>
        <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1 leading-snug line-clamp-2">{posterSubtitle}</p>
      </div>

      {avatar ? (
        <div className="absolute bottom-0 right-3 sm:right-5 w-36 sm:w-44 h-48 sm:h-52 z-10 pointer-events-none overflow-hidden flex items-end justify-center">
          <img src={avatar} alt={event.instructor.name} className="w-full h-full object-cover object-top filter contrast-[1.05]" />
        </div>
      ) : (
        <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
      )}

      <div className="relative z-20 flex items-center gap-3 pt-5">
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-2.5 sm:px-3 py-1.5 flex items-center gap-2 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-white text-blue-900 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d={event.mode === "Online" ? BellPath : MarkerPath} />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-white leading-none">{badgeText}</span>
            <span className="text-[10px] font-bold text-blue-100 leading-tight">{badgeType}</span>
          </div>
        </div>

        {event.instructor.name && (
          <>
            <div className="h-6 w-[1px] bg-white/25" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-blue-200/85 font-medium leading-none">{event.instructor.role || "Host"}</span>
              <span className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate max-w-[140px]">{event.instructor.name}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type CardData = BannerData & Pick<EventInput, "location" | "startDate" | "endDate" | "timeLabel">;

/** The FeaturedMasterclass row. `status` and `actions` replace the site's CTA strip in the admin list. */
export function EventCard({
  event,
  siteUrl,
  titleSlot,
  status,
  actions,
}: {
  event: CardData;
  siteUrl: string;
  titleSlot?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const theme = themeOf(event.theme);
  const dateLabel = formatEventDateLabel(event.startDate, event.endDate);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row items-stretch transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group font-sans">
      <EventBanner event={event} siteUrl={siteUrl} className="w-full md:w-[400px] lg:w-[440px] xl:w-[480px] shrink-0 min-h-[220px] sm:min-h-[250px]" />

      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 min-w-0 bg-white">
        <div>
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.chip}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {event.type}
              </span>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">• {event.mode}</span>
            </div>
            {status ?? (
              <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                Limited Seats Available
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#0066FF] transition-colors">
            {titleSlot ?? (event.title || "Untitled event")}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
            {event.tagline || <span className="italic text-gray-400">No tagline yet</span>}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{dateLabel || "Date TBC"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{event.timeLabel || "Time TBC"}</span>
            </div>
            <div className="flex items-center gap-2">
              <PinIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{event.location || "Location TBC"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-6 mt-4 border-t border-gray-100">
          {actions ?? (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Registrations closing soon</span>
              </div>
              <span className="bg-[#0070F3] text-white font-bold text-xs sm:text-sm px-7 py-2.5 sm:py-3 rounded-lg shadow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>Register Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5 text-gray-500 text-xs font-semibold">
        <span className="text-blue-600 shrink-0">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-xs sm:text-sm font-bold text-gray-900 text-right">{value}</span>
    </div>
  );
}

const fakeInput =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 font-medium";

/** EventDetails, minus the site-wide "Explore more" strip and FAQ section. */
export function EventDetailsPage({ event, siteUrl }: { event: EventInput; siteUrl: string }) {
  const theme = themeOf(event.theme);
  const avatar = resolveAsset(event.instructor.avatar, siteUrl);
  const dateLabel = formatEventDateLabel(event.startDate, event.endDate) || "Date TBC";
  const takeaways = event.takeaways.filter(Boolean);
  const agenda = event.agenda.filter((slot) => slot.item);
  const audience = event.audience.filter(Boolean);

  return (
    <main className="uc-site min-h-full bg-[#F8FAFC] flex flex-col items-center font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 bg-white px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-2xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to All Events</span>
        </span>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className={`w-full rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-200/80 bg-gradient-to-r ${theme.banner} text-white relative min-h-[320px] sm:min-h-[360px] p-6 sm:p-10 flex flex-col justify-between`}>
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 opacity-85">
            <span className="text-xs font-extrabold tracking-tight [font-family:var(--font-montserrat)] text-white/90">
              UPPER<span className="text-cyan-400">CURVE</span>
            </span>
          </div>

          <div className="relative z-10 max-w-2xl">
            {event.poster.ribbon && (
              <div
                style={{ backgroundColor: theme.accent }}
                className="inline-block text-[#0f172a] text-[10px] sm:text-[11px] font-black px-3.5 py-1 rounded-sm uppercase tracking-wider shadow-sm mb-4"
              >
                {event.poster.ribbon}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
              {event.title || "Untitled event"}
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 font-medium leading-relaxed max-w-xl">{event.tagline}</p>
          </div>

          {avatar && (
            <div className="hidden md:flex absolute bottom-0 right-10 lg:right-16 w-52 lg:w-64 h-64 lg:h-76 z-10 pointer-events-none overflow-hidden items-end justify-center">
              <img src={avatar} alt={event.instructor.name} className="w-full h-full object-cover object-top filter contrast-[1.05]" />
            </div>
          )}

          <div className="relative z-20 flex flex-wrap items-center gap-4 pt-8 mt-4 border-t border-white/15">
            <div className="bg-[#0055FF] border border-blue-400/40 rounded-xl px-3.5 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-white text-[#0055FF] flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d={event.mode === "Online" ? BellPath : MarkerPath} />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-white leading-none">
                  {event.poster.badgeText || event.mode.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold text-blue-100 leading-tight">{event.poster.badgeType || event.type}</span>
              </div>
            </div>

            {event.instructor.name && (
              <>
                <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-blue-200/85 font-medium leading-none">Taught By</span>
                  <span className="text-sm font-bold text-white mt-0.5">
                    {event.instructor.name}{" "}
                    {event.instructor.role && <span className="text-xs text-blue-200 font-normal">· {event.instructor.role}</span>}
                  </span>
                </div>
              </>
            )}

            <div className="h-6 w-[1px] bg-white/20 hidden lg:block" />

            <div className="flex items-center gap-4 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-cyan-300" />
                {dateLabel}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-cyan-300" />
                {event.timeLabel || "Time TBC"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            {takeaways.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">What You&apos;ll Build & Take Home</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Hands-on practical outcomes from this interactive session</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3.5">
                  {takeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                      <span className="text-sm font-semibold text-gray-800 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {agenda.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Session Agenda & Schedule</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Step-by-step interactive breakdown</p>
                  </div>
                </div>
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-100">
                  {agenda.map((slot, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#0066FF] flex items-center justify-center shadow-2xs">
                        <div className="w-2 h-2 rounded-full bg-[#0066FF]" />
                      </div>
                      <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 sm:p-5">
                        {slot.time && (
                          <div className="inline-block bg-blue-50 text-[#0066FF] text-xs font-bold px-2.5 py-1 rounded-md mb-2">{slot.time}</div>
                        )}
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">{slot.item}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isEmptyHtml(event.aboutHtml) && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-4">About this Session</h3>
                <div className="uc-article uc-article-sm" dangerouslySetInnerHTML={{ __html: event.aboutHtml }} />
              </div>
            )}

            {event.instructor.name && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Instructor Spotlight</span>
                  <span className="text-xs font-bold text-gray-400">Live Mentorship</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md shrink-0 bg-blue-50 flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt={event.instructor.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <span className="text-2xl font-black text-blue-300">{event.instructor.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h4 className="text-xl font-black text-gray-900">{event.instructor.name}</h4>
                    {event.instructor.role && <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-2">{event.instructor.role}</p>}
                    {event.instructor.bio && <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">{event.instructor.bio}</p>}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {event.instructor.highlights.map((h) => (
                        <span key={h} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-md">{h}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {audience.length > 0 && (
              <div className="bg-blue-50/60 rounded-3xl border border-blue-100 p-6 sm:p-8">
                <h4 className="text-base sm:text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  Who is this session for?
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium">
                  {audience.map((line, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">•</span> {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Limited Seats Available
                </span>
                {event.priceLabel && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {event.priceLabel}
                  </span>
                )}
              </div>

              <div className="mb-5">
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug">Reserve Your Spot Now</h3>
                <p className="text-xs text-gray-500 mt-1">Instant Zoom link & calendar reminder sent to your email.</p>
              </div>

              <div className="bg-gray-50/80 rounded-2xl p-4 mb-5 border border-gray-100">
                <FactRow icon={<CalendarIcon />} label="Date" value={dateLabel} />
                <FactRow icon={<ClockIcon />} label="Time" value={event.timeLabel || "Time TBC"} />
                <FactRow icon={<PinIcon />} label="Mode" value={event.location || event.mode} />
                {event.certificateLabel && (
                  <FactRow
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                      </svg>
                    }
                    label="Certificate"
                    value={event.certificateLabel}
                  />
                )}
              </div>

              {/* Static copy of SaveSeatForm — not interactive in the preview. */}
              <div className="space-y-3.5" aria-hidden>
                {["Full Name", "Work or Personal Email", "Phone Number"].map((label, i) => (
                  <div key={label}>
                    <div className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      {label} {i < 2 && <span className="text-red-500">*</span>}
                    </div>
                    <div className={fakeInput}>{["e.g. Rahul Sharma", "rahul@company.com", "+91 98765 43210"][i]}</div>
                  </div>
                ))}
                <div className="w-full mt-2 bg-[#0070F3] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2">
                  <span>Reserve Free Seat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
