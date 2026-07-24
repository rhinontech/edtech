"use client";

import { AnimateWrapper, TextAnimation } from "@/components/Animations";
import { PrimaryButton } from "@/components/Common";
import React, { useState } from "react";

export function StarterKitSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you! Free UI/UX Starter Kit sent to ${email}`);
      setEmail("");
    }
  };

  return (
    <section className="py-24 max-sm:py-14 text-white font-sans">
      <div className=" bg-[#0a0a0c] rounded-3xl p-6 sm:p-16  shadow-2xl flex flex-col items-center text-center">

        {/* Cyan Badge */}
        <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          Free Ebook + Training
        </span>

        {/* Section Headline */}
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-14">
          <TextAnimation>The UI/UX </TextAnimation><br /><TextAnimation> Starter Kit</TextAnimation>
        </h2>

        {/* Two Columns Container */}
        <AnimateWrapper className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">

          {/* Left Dark Card: Ebook & Video Info */}
          <div className="lg:col-span-6 bg-[#17171a]  rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden min-h-[660px]">
            <div>
              <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-6">
                Free 52 pages
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6">
                <TextAnimation> A 52-page ebook plus a 10-minute video training. Everything we wish someone had handed us on day one — yours free.</TextAnimation>
              </h3>

              <button className="bg-gray-800/90 hover:bg-gray-700 text-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all w-max shadow-sm mb-8">
                <span>▶</span> Play video training • 10 mins
              </button>
            </div>

            {/* 3D Purple Book / Box Mockup */}
            <div className="flex items-end justify-between pt-4">
              <div className="w-36 h-48 bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-950 rounded-xl border border-indigo-700/50 shadow-2xl p-4 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="text-[10px] font-mono text-indigo-300">The UI/UX Starter Kit</div>
                <div className="space-y-1">
                  <div className="text-xs font-black text-white">UI/UX Starter Kit</div>
                  <div className="w-full h-1.5 bg-indigo-500/50 rounded-full" />
                </div>
              </div>

              <div className="text-right text-[10px] text-gray-500 font-mono">
                <div>Vol. 01</div>
                <div>2026 Edition</div>
              </div>
            </div>
          </div>

          {/* Right Light Card: Checklist & Email Form */}
          <div className="lg:col-span-6 bg-[#e5e7eb] text-gray-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border border-gray-300/80 min-h-[460px]">

            {/* 3D Lime Green Graphic image in top right */}
            <div className="absolute max-sm:hidden -top-10 -right-14 w-44 h-44 pointer-events-none">
              <img
                src="/starterKit/image1.avif"
                alt="Starter kit graphic"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            {/* Checklist */}
            <div className="space-y-4 pt-2">
              {[
                "52-page UI/UX fundamentals ebook (PDF)",
                "10-min video training: How designers actually get hired",
                "Figma starter file with 30+ components",
                "Portfolio case-study template",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-800">
                  <span className="w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Email Subscription Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-300/70 border border-gray-400/60 rounded-2xl px-5 py-4 text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-black transition-all"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">

                <PrimaryButton className="flex-1">Enroll now</PrimaryButton>
                <p className="text-[14px]  font-normal max-w-[250px]">
                  <TextAnimation> Join <span className="font-bold">4,000+</span> designers. No spam, unsubscribe anytime.</TextAnimation>
                </p>
              </div>
            </form>

          </div>

        </AnimateWrapper>

      </div >
    </section >
  );
}

export default StarterKitSection;
