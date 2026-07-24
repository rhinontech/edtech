import React from "react";

export function Navbar() {
  return (
    <header className="relative w-full bg-white border-b border-gray-100/80 transition-all">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 3.32L17.84 9 12 12.18 6.16 9 12 6.32zM6 12.5v4.25l6 3.25 6-3.25V12.5l-6 3.25-6-3.25z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">Educore</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#overview" className="hover:text-black transition-colors">Overview</a>
          <a href="#curriculum" className="hover:text-black transition-colors">Curriculum</a>
          <a href="#instructor" className="hover:text-black transition-colors">Instructor</a>
          <a href="#testimonials" className="hover:text-black transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="#faqs" className="hover:text-black transition-colors">FAQs</a>
        </nav>

        <a href="#pricing" className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm inline-block">
          Enroll now
        </a>

      </div>
    </header>
  );
}

export default Navbar;
