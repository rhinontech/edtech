"use client";

import React, { useState } from "react";
import { TextAnimation, CounterNumber, AnimateWrapper } from "@/components/Animations";
import { PrimaryButton } from "@/components/Common";

interface AccordionModule {
  id: number;
  title: string;
  weeks: string;
  lessons: string;
  duration: string;
  topics?: { title: string; duration: string }[];
}

export function CurriculumSection() {
  const [openModuleId, setOpenModuleId] = useState<number | null>(6); // Default open 6th module as in screenshot

  const modules: AccordionModule[] = [
    {
      id: 1,
      title: "Foundations of design",
      weeks: "Week 1",
      lessons: "8 lessons",
      duration: "10h",
      topics: [
        { title: "Design Principles & Hierarchy", duration: "2hrs" },
        { title: "Color Theory & Contrast", duration: "2hrs" },
        { title: "Typography Basics", duration: "3hrs" },
        { title: "Grid Systems", duration: "3hrs" },
      ],
    },
    {
      id: 2,
      title: "Research & discovery",
      weeks: "Week 2",
      lessons: "7 lessons",
      duration: "5h",
      topics: [
        { title: "User Interviews", duration: "1.5hrs" },
        { title: "Competitor Analysis", duration: "1.5hrs" },
        { title: "User Personas", duration: "2hrs" },
      ],
    },
    {
      id: 3,
      title: "Wireframing & IA",
      weeks: "Week 3–4",
      lessons: "10 lessons",
      duration: "6h",
      topics: [
        { title: "Information Architecture", duration: "2hrs" },
        { title: "Low-fi Wireframing", duration: "2hrs" },
        { title: "User Flow Mapping", duration: "2hrs" },
      ],
    },
    {
      id: 4,
      title: "UI Systems in Figma",
      weeks: "Week 5–7",
      lessons: "14 lessons",
      duration: "9h",
      topics: [
        { title: "Figma Auto Layout 5.0", duration: "3hrs" },
        { title: "Design Tokens & Variables", duration: "3hrs" },
        { title: "Component Libraries", duration: "3hrs" },
      ],
    },
    {
      id: 5,
      title: "Prototyping & interaction",
      weeks: "Week 8–9",
      lessons: "9 lessons",
      duration: "5h",
      topics: [
        { title: "Smart Animate & Micro-interactions", duration: "2hrs" },
        { title: "Advanced Component States", duration: "3hrs" },
      ],
    },
    {
      id: 6,
      title: "Portfolio & career",
      weeks: "Week 10–12",
      lessons: "11 lessons",
      duration: "7h",
      topics: [
        { title: "Case Study Writing", duration: "2hrs" },
        { title: "Portfolio Design", duration: "2hrs" },
        { title: "Resume & LinkedIn", duration: "2hrs" },
        { title: "Interview Prep", duration: "2hrs" },
      ],
    },
  ];

  return (
    <section className=" py-20  text-white font-sans antialiased">
      <div className=" mx-auto bg-[#0a0a0c] rounded-3xl p-6 sm:p-18 border border-gray-800/80 shadow-2xl relative">

        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="bg-gray-800/90 text-gray-300 border border-gray-700/80 text-[11px] font-semibold px-3 py-1 rounded-full mb-4">
            The Curriculum
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            <TextAnimation>12 weeks.</TextAnimation> <br /> <TextAnimation>6 modules.</TextAnimation>
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

          {/* Left Column: Accordions list */}
          <AnimateWrapper className="lg:col-span-7 space-y-4">
            {modules.map((mod) => {
              const isOpen = openModuleId === mod.id;
              return (
                <div
                  key={mod.id}
                  className="bg-[#1a1a1e] border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
                >
                  <button
                    onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {mod.weeks} • {mod.lessons} • {mod.duration}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-gray-800/80 text-gray-300 flex items-center justify-center font-bold text-sm">
                      {isOpen ? "−" : "+"}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && mod.topics && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-800/60 space-y-3">
                      {mod.topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-gray-800/40 last:border-0 text-sm text-gray-300"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                            <span className="font-semibold text-gray-200">{topic.title}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-mono">🕒 {topic.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </AnimateWrapper>

          {/* Right Column: Sticky "About the course" card */}
          <AnimateWrapper className="lg:col-span-5 sticky top-10 self-start">
            <div className="bg-[#e5e7eb] text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-300/80 space-y-6">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                About the course
              </span>

              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-gray-900">
                <TextAnimation>Go from zero to a hired designer in 12 focused weeks.</TextAnimation>
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                A project-based program built around real briefs, live critique, and a portfolio you’ll actually be proud to ship.
              </p>

              {/* Course Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 col-span-2">
                  <div className="text-2xl font-extrabold text-gray-900">36h</div>
                  <div className="text-xs text-gray-500 font-medium">of content</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80">
                  <div className="text-2xl font-extrabold text-gray-900">59</div>
                  <div className="text-xs text-gray-500 font-medium">lessons</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80">
                  <div className="text-2xl font-extrabold text-gray-900">6</div>
                  <div className="text-xs text-gray-500 font-medium">projects</div>
                </div>
              </div>

              {/* Enroll button */}
              <PrimaryButton className="w-full">Enroll now</PrimaryButton>

              {/* Rating & Testimonials avatars */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <img className="w-7 h-7 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="std1" />
                  <img className="w-7 h-7 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="std2" />
                  <img className="w-7 h-7 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="std3" />
                  <img className="w-7 h-7 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="std4" />
                </div>
                <div className="text-left text-[11px] leading-tight">
                  <div className="font-bold text-gray-900"><TextAnimation>4.9</TextAnimation>/5 <span className="text-amber-500">★★★★★</span></div>
                  <div className="text-gray-500">
                    <TextAnimation>Trusted by</TextAnimation>{" "}
                    <span className="font-bold text-gray-800">
                      <TextAnimation>4,000+</TextAnimation>
                    </span>{" "}
                    <TextAnimation>students</TextAnimation>
                  </div>
                </div>
              </div>

            </div>
          </AnimateWrapper>

        </div>

      </div >
    </section >
  );
}

export default CurriculumSection;
