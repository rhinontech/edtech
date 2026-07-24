"use client";

import React, { useRef, useState, useEffect } from "react";
import { TextAnimation } from "@/components/Animations";

interface StackCard {
  tag: string;
  title: string;
  bg: string;
  textColor: string;
  tagColor: string;
  image: string;
}

export function StackedCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cards: StackCard[] = [
    {
      tag: "Make an Impact",
      title: "Shape products millions of people use every single day.",
      bg: "bg-gray-100",
      textColor: "text-gray-900",
      tagColor: "text-gray-500",
      image: "/stackedCard/iamge1.avif",
    },
    {
      tag: "In Demand",
      title: "Companies competing for design talent across every industry.",
      bg: "bg-[#111111]",
      textColor: "text-white",
      tagColor: "text-gray-400",
      image: "/stackedCard/image2.avif",
    },
    {
      tag: "Growth Opportunities",
      title: "Design org headcount up 30% YoY across SaaS and fintech.",
      bg: "bg-gray-100",
      textColor: "text-gray-900",
      tagColor: "text-gray-500",
      image: "/stackedCard/image3.avif",
    },
    {
      tag: "Creative Freedom",
      title: "Solve complex problems with beautiful, human-centered UI.",
      bg: "bg-[#111111]",
      textColor: "text-white",
      tagColor: "text-gray-400",
      image: "/stackedCard/image4.avif",
    },
    {
      tag: "High Earning Potential",
      title: "Product designers rank among the top paid roles in modern tech.",
      bg: "bg-[#09090b]",
      textColor: "text-white",
      tagColor: "text-gray-400",
      image: "/stackedCard/image5.avif",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScroll = rect.height - windowHeight;
        if (totalScroll > 0) {
          const current = Math.max(0, Math.min(totalScroll, -rect.top));
          setScrollProgress(current / totalScroll);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-white text-gray-900 font-sans">
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">

        {/* Section Pill Badge & Title */}
        <div className="flex flex-col items-center text-center mb-8 z-10">
          <span className="bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full mb-4 shadow-2xs">
            Why this career
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            <TextAnimation>A Job worth</TextAnimation> <br /> <TextAnimation>wanting.</TextAnimation>
          </h2>
        </div>

        {/* Stacked Cards Area */}
        <div className="relative w-full max-w-sm md:max-w-sm h-[450px] flex items-center justify-center">
          {cards.map((card, idx) => {
            const isLast = idx === cards.length - 1;

            // Calculate lift-up translation for each card except the last
            const totalSteps = cards.length - 1;
            const stepWidth = 1 / totalSteps;
            const cardStart = idx * stepWidth;
            const cardEnd = cardStart + stepWidth;

            const rawProgress = (scrollProgress - cardStart) / (cardEnd - cardStart);
            const cardProgress = Math.max(0, Math.min(1, rawProgress));

            // Translation up (away) for earlier cards; last card stays stationary (0)
            const translateY = isLast ? 0 : -cardProgress * 750;
            const rotate = isLast ? 0 : (idx % 2 === 0 ? 1 : -1) * (2 - cardProgress * 4);
            const scale = 1;
            const opacity = isLast ? 1 : (cardProgress > 0.85 ? 1 - (cardProgress - 0.85) * 6 : 1);

            return (
              <div
                key={idx}
                className={`absolute inset-0 rounded-3xl p-8 flex flex-col justify-between overflow-hidden   transition-transform duration-75 ease-out ${card.bg} ${card.textColor}`}
                style={{
                  zIndex: (cards.length - idx) * 10,
                  transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                  opacity: opacity,
                }}
              >

                <div className="relative z-10">
                  <span className={`text-xs font-bold uppercase tracking-wider block mb-4 ${card.tagColor}`}>
                    {card.tag}
                  </span>
                  <h3 className="text-2xl md:text-2xl font-extrabold leading-snug tracking-tight">
                    {card.title}
                  </h3>
                </div>

                {/* 3D Image positioned at -bottom-20 -right-10 */}
                <div className="absolute -bottom-20 -right-10 w-64 md:w-72 pointer-events-none z-0">
                  <img
                    src={card.image}
                    alt={card.tag}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default StackedCardsSection;
