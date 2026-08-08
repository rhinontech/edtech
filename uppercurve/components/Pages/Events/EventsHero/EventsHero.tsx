"use client";

import React from "react";
import { TextAnimation } from "@/components/Animations";
import { PrimaryButton, SecondaryButton } from "@/components/Common";

export function EventsHero() {
  const pills = [
    { label: "Monthly meetups", icon: "🎪", bg: "bg-amber-100", text: "text-amber-600" },
    { label: "Free for students", icon: "🎟️", bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
    { label: "Online + IRL", icon: "🌍", bg: "bg-cyan-100", text: "text-cyan-600" },
  ];

  return (
    <div className="relative w-full overflow-hidden text-[#0f172a] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DOT GRID PATTERN */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_55%_45%_at_50%_35%,#000_25%,transparent_95%)] opacity-35" />

      <section className="relative pt-14 max-sm:pt-10 pb-16 px-6 mx-auto flex flex-col items-center text-center">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-1 py-1 pr-2 mb-8 shadow-sm">
          <span className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Live
          </span>
          <span className="text-sm font-[450] text-indigo-950">Community events, open to everyone</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] max-w-4xl mb-6">
          <TextAnimation>Where ambitious people</TextAnimation> <br className="hidden sm:inline" />
          <TextAnimation>level up together</TextAnimation>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-md font-normal max-w-xl mb-10 leading-relaxed">
          Live workshops, build nights, career AMAs and meetups with the UpperCurve
          community. Show up, ship something, make friends.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap max-sm:flex-col items-center justify-center gap-4 mb-10">
          <a href="#upcoming">
            <PrimaryButton>Browse upcoming events</PrimaryButton>
          </a>
          <a href="#past-events">
            <SecondaryButton>See past events</SecondaryButton>
          </a>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-2">
          {pills.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-200/50 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm shrink-0 whitespace-nowrap"
            >
              <span
                className={`w-7 h-7 rounded-xl ${item.bg} ${item.text} flex items-center justify-center text-xs shadow-inner`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EventsHero;
