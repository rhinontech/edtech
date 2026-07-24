"use client";

import { AnimateWrapper, TextAnimation } from "@/components/Animations";
import { PrimaryButton } from "@/components/Common";
import React, { useState } from "react";

interface CommunityPhoto {
  id: number;
  url: string;
  location: string;
}

export function CommunitySection() {
  const [currentIndex, setCurrentIndex] = useState(2); // Center initial index

  const photos: CommunityPhoto[] = [
    { id: 1, location: "Mixer Austin", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" },
    { id: 2, location: "Design Hackathon London", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
    { id: 3, location: "Cohort Meetup NYC", url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80" },
    { id: 4, location: "Figma Workshop Berlin", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" },
    { id: 5, location: "1:1 Live Review Session", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
    { id: 6, location: "Design Retreat Tokyo", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80" },
    { id: 7, location: "Portfolio Review San Francisco", url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80" },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const activeLocation = photos[currentIndex].location;

  return (
    <section className="py-24 text-gray-900 font-sans antialiased">
      <div className=" flex flex-col items-center text-center">

        {/* Top Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md mb-6 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-lg">👥</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-16">
          <TextAnimation>A Real Community</TextAnimation>
        </h2>

        {/* Smooth Track Container for 5 Visible Tilted Cards */}
        <AnimateWrapper className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center mb-10">
          {photos.map((photo, index) => {
            // Distance from current center index
            let offset = index - currentIndex;

            // Handle wrapping for infinite loop indexing
            if (offset < -3) offset += photos.length;
            if (offset > 3) offset -= photos.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2; // 5 visible cards (-2, -1, 0, 1, 2)

            // Smooth 3D positions, rotations & spacing
            const positionX = offset * 260; // X offset in pixels
            const rotateDeg = offset * 3.5; // Smooth tilt angle per slot
            const scale = isCenter ? 1.05 : Math.max(0.75, 1 - Math.abs(offset) * 0.08);
            const opacity = isVisible ? (isCenter ? 1 : 0.85) : 0;

            return (
              <div
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`absolute w-[170px] sm:w-[260px] h-[280px] sm:h-[350px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-700 cubic-bezier(0.25,1,0.5,1) ${isCenter ? "z-30 ring-4 ring-white/80 shadow-2xl" : "z-10"
                  }`}
                style={{
                  transform: `translateX(${positionX}px) rotate(${rotateDeg}deg) scale(${scale})`,
                  opacity: opacity,
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.location}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            );
          })}
        </AnimateWrapper>

        {/* Navigation Bar (←  Location Tag  →) */}
        <div className="flex items-center gap-4 bg-gray-100/90 border border-gray-200 px-4 py-2 rounded-full shadow-md mb-8 transition-all">
          <button
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs active:scale-95"
          >
            ←
          </button>

          <span className="text-xs font-bold text-gray-900 px-2 min-w-[140px] transition-all">
            {activeLocation}
          </span>

          <button
            onClick={handleNext}
            aria-label="Next Photo"
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs active:scale-95"
          >
            →
          </button>
        </div>

        {/* Join Community CTA Button */}
        <AnimateWrapper >
          <PrimaryButton>Join the community</PrimaryButton>
        </AnimateWrapper>

      </div >
    </section >
  );
}

export default CommunitySection;
