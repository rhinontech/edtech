"use client";

import { TextAnimation } from "@/components/Animations";
import React, { useState, useEffect, useRef } from "react";

export function StudentShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
  ];

  // Auto-switch image every 10 seconds (10,000 ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Continuous Scroll Scale animation listener (starts from 0.5 -> 1.0 as soon as component enters view)
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Start measuring as soon as section top enters viewport from bottom
        const start = windowHeight;
        const totalDistance = rect.height;
        const currentDistance = start - rect.top;

        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // Scale smoothly from 0.5 to 1.0
        const computedScale = 0.5 + progress * 0.5;
        setScale(computedScale);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[250vh] text-gray-900 font-sans ">

      {/* Header Badge & Title (Enters in view as normal) */}
      <div className="flex flex-col items-center text-center pt-24 pb-12 px-4 sm:px-6">
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md mb-6 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-lg">🧊</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          <TextAnimation>What our students</TextAnimation> <br /> <TextAnimation>built</TextAnimation >
        </h2 >
      </div >

      {/* Sticky Image Container (Locks into screen center when reached & scales to max-w-7xl) */}
      < div className="sticky top-[10vh] sm:top-[12vh] w-full flex justify-center px-4 sm:px-6 z-20 pb-20" >
        <div
          className="w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl bg-gray-900 transition-transform duration-75 ease-out relative"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* Main Image with Original 600px Height & Smooth 10s Crossfade */}
          <div className="relative w-full h-[340px] sm:h-[480px] md:h-[600px] overflow-hidden">
            {images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt="Student Showcase Project"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === activeImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
              />
            ))}
          </div>
        </div>
      </div >

    </section >
  );
}

export default StudentShowcaseSection;
