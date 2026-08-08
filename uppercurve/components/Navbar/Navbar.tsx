"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PrimaryButton } from "../Common";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Overview", href: "/#overview" },
    { name: "Programs", href: "/#programs" },
    { name: "Mentorship", href: "/#mentorship" },
    { name: "Community", href: "/#community" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "FAQs", href: "/#faqs" },
  ];

  const secondaryLinks = [
    { name: "Privacy policy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "404", href: "#404" },
  ];

  return (
    <>
      {/* 1. Desktop Navbar (Original exact design, visible on md screens and up) */}
      <header className="hidden md:block sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <img
              src="/uppercurve_logo_nav.png"
              alt="UpperCurve logo"
              className="h-8 w-auto group-hover:scale-105 transition-transform"
            />
            <span className="text-xl tracking-tight font-extrabold [font-family:var(--font-montserrat)]">
              <span className="text-[#0B1B42]">UPPER</span>
              <span className="text-indigo-600">CURVE</span>
            </span>
          </Link>

          <nav className="flex items-center gap-8 text-sm font-semibold text-gray-600">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-black transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          <Link
            href="/#programs"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm inline-block"
          >
            Explore programs
          </Link>
        </div>
      </header>

      {/* 2. Mobile Floating Sticky Navbar Header (Single persistent navbar bar) */}
      <header className="md:hidden sticky top-4 z-50 w-full px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md mx-auto relative">
          {/* Persistent Floating Dark Bar */}
          <div className="bg-[#18181b] text-white rounded-full px-5 py-3 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/10 relative z-50">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/uppercurve_logo_nav.png"
                alt="UpperCurve logo"
                className="h-7 w-auto"
              />
              <span className="text-lg tracking-tight font-extrabold [font-family:var(--font-montserrat)]">
                <span className="text-white">UPPER</span>
                <span className="text-indigo-600">CURVE</span>
              </span>
            </Link>

            {/* Toggle Button (Hamburger when closed, Close 'X' when open) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="w-11 h-11 rounded-full bg-[#27272a] hover:bg-[#3f3f46] flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 12h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Menu Card appearing right under the persistent navbar bar */}
          {isOpen && (
            <div className="absolute top-0 left-0 right-0 pt-20 bg-[#f8f8f8] rounded-[32px] p-5 flex flex-col border border-gray-200/60 shadow-2xl z-40 animate-slide-down">
              {/* Main Links */}
              <div className="flex flex-col space-y-3.5 px-2 pt-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-[#111111] hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Separator Divider Line */}
              <div className="border-t border-gray-200/80 my-5" />

              {/* Secondary Links */}
              <div className="flex flex-col space-y-3 px-2">
                {secondaryLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-[#111111] hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3.5 my-5 px-2">
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>

              {/* Bottom Full-Width Button */}
              <div className="pt-2">

                <PrimaryButton className="w-full" onClick={() => setIsOpen(false)}>Explore programs</PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Full-Screen White Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-white transition-opacity duration-300"
        />
      )}
    </>
  );
}

export default Navbar;

