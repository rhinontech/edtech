"use client";
import { AnimateWrapper, CounterNumber, TextAnimation } from "@/components/Animations";

import React from "react";

export function InstructorSection() {
  const brandLogos = [
    { logo: "⚡", name: "GenZ" },
    { logo: "🔲", name: "Glossy" },
    { logo: "H", name: "Hitech" },
    { logo: "🌱", name: "Greenish" },
    { logo: "⚡", name: "Flash" },
    { logo: "❖", name: "Linear" },
    { logo: "🛍️", name: "Shopify" },
  ];

  return (
    <section className="py-24 max-sm:py-14  text-gray-900 font-sans antialiased ">
      <div className=" flex flex-col items-center text-center">

        {/* Pill Badge */}
        <span className="bg-gray-200/80 border border-gray-300/60 text-gray-700 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          Your instructor
        </span>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-14">
          <TextAnimation>Jordan Rivera</TextAnimation>
        </h2>

        {/* Grid Layout of Instructor Cards */}
        <AnimateWrapper className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-16">

          {/* Left Large Photo Card */}
          <div className="md:col-span-6 bg-gray-900 rounded-3xl overflow-hidden relative shadow-xl min-h-[620px] max-sm:min-h-[500px] flex flex-col justify-end">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
              alt="Jordan Rivera"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Bottom White Overlay Card */}
            <div className="relative z-10 m-4 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between text-left">
              <div>
                <div className="text-3xl font-black text-gray-900"><CounterNumber>12</CounterNumber>+</div>
                <div className="text-xs font-semibold text-gray-500">Years designing</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-base">
                ✍️
              </div>
            </div>
          </div>

          {/* Right Column Cards */}
          <div className="md:col-span-6 flex flex-col gap-6">

            {/* Top Right Card: Bio + Donut Image */}
            <div className="bg-[#f4f5f7] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm border border-gray-200/60 min-h-[460px] text-left">
              <div className="max-w-md z-10 flex flex-col justify-between h-full">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-8">
                  <TextAnimation>Former design lead at Linear and Shopify. Has shipped products used by 40M+ people and mentored designers at every level of their career.</TextAnimation>
                </h3>

                <div>
                  <div className="text-5xl font-bold text-gray-900"><CounterNumber>2,000</CounterNumber>+</div>
                  <div className="text-xs font-semibold text-gray-500">Students taught</div>
                </div>
              </div>

              {/* Pink Donut Graphic image snippet on right */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 pointer-events-none">
                <img
                  src="/instructor/image1.avif"
                  alt="Instructor graphic"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>

            {/* Bottom Right Card: Lime Background */}
            <div className="bg-[#b4f461] text-gray-900 rounded-3xl p-8 flex flex-col justify-between text-left shadow-sm border border-lime-400/80 min-h-[160px]">
              <p className="text-md sm:text-md font-semibold leading-relaxed text-gray-950 mb-4">
                Jordan teaches the way they wish someone had taught them: opinionated, hands-on, and allergic to fluff.
              </p>

              <div>
                <div className="text-5xl font-bold text-gray-950"><CounterNumber>40</CounterNumber>+</div>
                <div className="text-xs font-bold text-gray-800">Products Shipped</div>
              </div>
            </div>

          </div>

        </AnimateWrapper>

        {/* Brands Educated Infinite Right-Moving Marquee with Edge Masking */}
        <div className="w-full max-w-4xl text-center">
          <AnimateWrapper as="h4" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Brands educated
          </AnimateWrapper>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex w-max gap-8 animate-marquee py-2">
              {[...Array(4)].flatMap(() => brandLogos).map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-400 font-bold text-sm tracking-tight shrink-0 whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs">{b.logo}</span>
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div >
    </section >
  );
}

export default InstructorSection;
