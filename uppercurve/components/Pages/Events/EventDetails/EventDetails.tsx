import React from "react";
import Link from "next/link";
import { UpcomingEvent, upcomingEvents } from "../eventsData";
import EventPoster from "../EventPoster";
import SaveSeatForm from "./SaveSeatForm";

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
    </div>
  );
}

export function EventDetails({ event }: { event: UpcomingEvent }) {
  const moreEvents = upcomingEvents.filter((e) => e.slug !== event.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-5 md:px-6 pt-8 pb-24">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          ← All events
        </Link>

        {/* Poster hero */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200/60 h-[320px] sm:h-[400px] md:h-[460px] mb-10">
          <EventPoster event={event} featured />
        </div>

        {/* Title row */}
        <div className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`${event.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
              {event.type}
            </span>
            <span className="bg-emerald-50 border-emerald-100 text-emerald-600 border text-[11px] font-semibold px-3 py-1 rounded-full">
              Free entry
            </span>
            <span className="bg-gray-100 border-gray-200/70 text-gray-700 border text-[11px] font-semibold px-3 py-1 rounded-full">
              {event.mode}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05] mb-5">
            {event.title}
          </h1>
          <p className="text-gray-500 text-md leading-relaxed">{event.tagline}</p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: about, agenda, takeaways */}
          <div className="lg:col-span-7 space-y-12">
            {/* About */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-5">
                About this event
              </h2>
              <div className="space-y-4">
                {event.about.map((paragraph, idx) => (
                  <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6">
                The agenda
              </h2>
              <div className="space-y-3">
                {event.agenda.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 bg-gray-50 border border-gray-200/60 rounded-2xl px-5 py-4"
                  >
                    <span className="shrink-0 bg-white border border-gray-200/80 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs whitespace-nowrap">
                      {slot.time}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 leading-relaxed">
                      {slot.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Takeaways */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6">
                You&apos;ll leave with
              </h2>
              <div className="space-y-3.5">
                {event.takeaways.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sticky save-seat card */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-7 sm:p-8 space-y-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Reserve your spot
                </div>
                <div className="text-xl font-black text-gray-900 tracking-tight leading-snug">
                  Save a seat for {event.title}
                </div>
              </div>

              <div>
                <FactRow label="Date" value={event.dateLabel} />
                <FactRow label="Time" value={event.time} />
                <FactRow label="Where" value={event.location} />
                <FactRow label="Entry" value="Free" />
              </div>

              <SaveSeatForm eventTitle={event.title} />
            </div>
          </div>
        </div>

        {/* More events */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              More events
            </h2>
            <Link href="/events" className="text-sm font-bold text-gray-900 hover:text-black inline-flex items-center gap-1.5">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {moreEvents.map((other) => (
              <Link
                key={other.slug}
                href={`/events/${other.slug}`}
                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition-all p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`${other.chip} border text-[10px] font-semibold px-2.5 py-0.5 rounded-full`}>
                    {other.type}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">{other.dateLabel}</span>
                </div>
                <div className="text-lg font-black text-gray-900 tracking-tight leading-snug group-hover:underline decoration-1 underline-offset-4">
                  {other.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default EventDetails;
