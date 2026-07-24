"use client";

import React from "react";
import { TextAnimation } from "../Animations";
import { PrimaryButton } from "../Common";

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 font-sans pt-20 pb-12 px-6 relative overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_55%,#000_25%,transparent_95%)] opacity-35"
      />

      {/* Top CTA Banner Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-14 relative">

        {/* Left Floating Graphic 1 */}
        <div className="absolute -left-16 sm:-left-36 md:-left-44 -top-6 sm:top-32 w-16 h-16 sm:w-22 sm:h-22 md:w-32 md:h-32 pointer-events-none z-10">
          <img
            src="/footer/image1.avif"
            alt="Footer Left Graphic"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        {/* Right Floating Graphic 2 (Blurred for Depth) */}
        <div className="absolute -right-12 sm:-right-28 md:-right-36 -top-4 sm:top-32 w-16 h-16 sm:w-22 sm:h-22 md:w-32 md:h-32 pointer-events-none z-10">
          <img
            src="/footer/image3.avif"
            alt="Footer Right Graphic"
            className="w-full h-full object-contain drop-shadow-xl blur-[3px]"
          />
        </div>

        {/* Rocket Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md mb-6 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-lg">🚀</span>
        </div>

        {/* Banner Headline */}
        <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          <TextAnimation>Start Your Design</TextAnimation> <br /><TextAnimation> Journey Today</TextAnimation>
        </h2>

        <p className="text-xs sm:text-sm font-normal text-gray-500 max-w-sm mb-8 leading-relaxed">
          Next cohort kicks off March 15. Seats are capped at 40 to keep critique real.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">

          <PrimaryButton>Enroll now</PrimaryButton>
          <button className="bg-gray-200/80 hover:bg-gray-300/80 text-gray-900 font-bold text-sm px-8 py-3.5 rounded-full transition-all active:scale-95">
            See curriculum
          </button>
        </div>
      </div >

      {/* Main Footer Links & Info Grid */}
      < div className="max-w-6xl mx-auto" >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16">

          {/* Brand Info Column */}
          <div className="md:col-span-4 text-left space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                🎓
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">Educore</span>
            </div>

            <p className="text-xs font-normal text-gray-500 max-w-xs leading-relaxed">
              A serious design course with a sense of humor. Cohorts, mentorship, and real placements.
            </p>
          </div>

          {/* Site Map Column */}
          <div className="md:col-span-3 text-left space-y-3">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Site map
            </div>
            {["Overview", "Curriculum", "Instructor", "Testimonials", "Pricing", "FAQs"].map((link, idx) => (
              <div key={idx}>
                <a href={`#${link.toLowerCase()}`} className="text-sm font-bold text-gray-900 hover:text-black transition-colors">
                  {link}
                </a>
              </div>
            ))}
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2 text-left space-y-3">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Legal
            </div>
            {["Privacy Policy", "Terms", "404"].map((link, idx) => (
              <div key={idx}>
                <a href="#" className="text-sm font-bold text-gray-900 hover:text-black transition-colors">
                  {link}
                </a>
              </div>
            ))}
          </div>

          {/* Socials & Subscribe Column */}
          <div className="md:col-span-3 text-left md:text-right space-y-6">
            {/* Social Icons */}
            <div className="flex items-center md:justify-end gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold transition-all">
                in
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold transition-all">
                𝕏
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold transition-all">
                📷
              </a>
            </div>

            {/* Student Avatars pill */}
            <div className="flex items-center md:justify-end gap-2 text-xs font-bold text-gray-700">
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="std" />
                <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="std" />
                <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="std" />
              </div>
              <span className="text-[11px] text-gray-500 font-normal">Join <b className="text-gray-900">4,000+</b> students</span>
            </div>

            {/* Bottom Enroll CTA button */}
            <div>
              <button className="w-full bg-gray-200/80 hover:bg-gray-300/80 text-gray-900 font-bold text-sm py-3.5 rounded-full transition-all shadow-sm">
                Enroll now
              </button>
            </div>
          </div>

        </div>

        {/* Copyright & Credits Row */}
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-8 border-t border-gray-200/40 gap-4 bg-white relative z-20">
          <div>©2026 Educore. All Rights reserved</div>
          <div>made by <b className="text-gray-900 font-black">OMAKASE</b></div>
        </div>
      </div >

    </footer >
  );
}

export default Footer;
