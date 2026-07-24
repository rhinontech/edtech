"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Lenis: any;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any = null;
    let rafId: number;

    const initLenis = () => {
      if (!window.Lenis) return;

      lenis = new window.Lenis({
        duration: 1.2, // Scroll animation duration in seconds
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    };

    if (window.Lenis) {
      initLenis();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/lenis@1.1.18/dist/lenis.min.js";
      script.async = true;
      script.onload = initLenis;
      document.head.appendChild(script);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
