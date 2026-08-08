"use client";

import React, { useRef, useState } from "react";
import { TextAnimation, AnimateWrapper } from "@/components/Animations";

interface EventItem {
  month: string;
  day: string;
  type: string;
  typeBg: string;
  typeText: string;
  title: string;
  desc: string;
  location: string;
  time: string;
}

interface Highlight {
  top: number;
  left: number;
  width: number;
  height: number;
  visible: boolean;
}

export function UpcomingEventsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<Highlight>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const events: EventItem[] = [
    {
      month: "Aug",
      day: "22",
      type: "Workshop",
      typeBg: "bg-indigo-50 border-indigo-100",
      typeText: "text-indigo-600",
      title: "Auto-layout Deep Dive",
      desc: "Two hours of hands-on Figma auto-layout drills — leave with a responsive component library.",
      location: "Online · Zoom",
      time: "6:00 PM IST",
    },
    {
      month: "Sep",
      day: "05",
      type: "Portfolio Night",
      typeBg: "bg-amber-50 border-amber-100",
      typeText: "text-amber-600",
      title: "Show Your Work Vol. 8",
      desc: "Present one case study, get live critique from mentors and hiring managers in the room.",
      location: "Bengaluru · HSR Layout",
      time: "5:30 PM IST",
    },
    {
      month: "Sep",
      day: "18",
      type: "Design Jam",
      typeBg: "bg-fuchsia-50 border-fuchsia-100",
      typeText: "text-fuchsia-600",
      title: "48-hour Redesign Jam",
      desc: "Teams of three redesign a real nonprofit's product. Winners get a 1:1 with our instructors.",
      location: "Online · Discord",
      time: "Starts 9:00 AM IST",
    },
    {
      month: "Oct",
      day: "03",
      type: "AMA",
      typeBg: "bg-cyan-50 border-cyan-100",
      typeText: "text-cyan-600",
      title: "Breaking into Product Design",
      desc: "An open Q&A with designers from Google, Stripe and Figma on landing your first role.",
      location: "Online · YouTube Live",
      time: "7:00 PM IST",
    },
    {
      month: "Oct",
      day: "24",
      type: "Workshop",
      typeBg: "bg-indigo-50 border-indigo-100",
      typeText: "text-indigo-600",
      title: "Design Systems from Zero",
      desc: "Tokens, primitives and docs — build a mini design system you can reuse on every project.",
      location: "Mumbai · Andheri East",
      time: "11:00 AM IST",
    },
    {
      month: "Nov",
      day: "14",
      type: "Meetup",
      typeBg: "bg-emerald-50 border-emerald-100",
      typeText: "text-emerald-600",
      title: "UpperCurve Community Meetup",
      desc: "No agenda, just designers. Coffee, demos, and a lightning-talk open mic for anyone who signs up.",
      location: "Delhi · Connaught Place",
      time: "4:00 PM IST",
    },
  ];

  // Aceternity "Card Hover Effect", adapted: a single highlight span slides to
  // the hovered card via CSS transitions instead of framer-motion layoutId.
  const moveHighlight = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    setHighlight({
      top: card.offsetTop,
      left: card.offsetLeft,
      width: card.offsetWidth,
      height: card.offsetHeight,
      visible: true,
    });
  };

  return (
    <section className="py-16 bg-white text-gray-900 font-sans">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10 px-6">
        <span className="bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-semibold px-3 py-1 rounded-full mb-4 shadow-2xs">
          Upcoming events
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          <TextAnimation>Pull up a chair.</TextAnimation>
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mt-4 leading-relaxed">
          Every event is free for enrolled students. Seats for in-person sessions are
          limited, so grab yours early.
        </p>
      </div>

      {/* Hover-effect Grid */}
      <AnimateWrapper>
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          onMouseLeave={() => setHighlight((h) => ({ ...h, visible: false }))}
        >
          {/* Sliding hover highlight */}
          <span
            aria-hidden
            className="absolute rounded-3xl bg-gray-100 pointer-events-none transition-all duration-300 ease-out"
            style={{
              top: highlight.top,
              left: highlight.left,
              width: highlight.width,
              height: highlight.height,
              opacity: highlight.visible ? 1 : 0,
            }}
          />

          {events.map((event) => (
            <div
              key={`${event.month}-${event.day}-${event.title}`}
              className="relative group p-2.5 h-full w-full"
              onMouseEnter={moveHighlight}
            >
              <div className="relative z-10 h-full w-full flex flex-col bg-white rounded-2xl border border-gray-200/80 group-hover:border-gray-300 shadow-sm group-hover:shadow-md p-6 transition-all duration-300">
                {/* Date + Type row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 rounded-xl bg-gray-50 border border-gray-200/60 py-1.5 flex flex-col items-center shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {event.month}
                    </span>
                    <span className="text-xl font-black text-gray-900 leading-none mt-0.5">
                      {event.day}
                    </span>
                  </div>
                  <span
                    className={`${event.typeBg} ${event.typeText} border text-[11px] font-semibold px-3 py-1 rounded-full`}
                  >
                    {event.type}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{event.desc}</p>

                {/* Meta */}
                <div className="mt-auto space-y-1.5 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕒</span>
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-black transition-colors"
                  >
                    Save your seat
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimateWrapper>
    </section>
  );
}

export default UpcomingEventsSection;
