"use client";

import React, { useEffect, useState, useRef } from "react";
import FeaturedOn from "../FeaturedOn/FeaturedOn";
import { PrimaryButton } from "@/components/Common";


export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Progress of hero section scroll
        const scrollDistance = Math.max(0, -rect.top);
        setScrollY(scrollDistance);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax calculations
  const donutTranslateY = Math.min(scrollY * 0.45, 1200);
  const donutRotate = scrollY * 0.2;

  const earningTranslateY = Math.min(scrollY * 0.54, 1200);
  const earningRotate = Math.sin(scrollY * 0.01) * 3;

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden text-[#0f172a] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DOT GRID PATTERN */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_55%_45%_at_50%_35%,#000_25%,transparent_95%)] opacity-35"
      />

      {/* Main Hero Header Section */}
      <section className="relative pt-5 pb-14 px-6 mx-auto flex flex-col items-center text-center">


        {/* PARALLAX FLOATING DONUT IMAGE */}
        <div
          className="absolute left-2 md:left-8 top-46 w-48 h-48 md:w-68 md:h-68 z-20 pointer-events-none transition-transform ease-out duration-75 filter blur-[0.4px]"
          style={{
            transform: `translateY(${donutTranslateY}px) rotate(${donutRotate}deg)`,
          }}
        >
          <div className="relative w-full h-full">
            <img
              src="/hero/image1.avif"
              alt="Floating shape"
              className="w-full h-full object-contain  transform -rotate-12"
            />
          </div>
        </div>


        {/* PARALLAX FLOATING EARNING BLACK WIDGET CARD */}
        <div
          className="absolute right-6 md:right-44 top-[320px] md:top-[480px] z-40 w-54 bg-[#121214] text-white rounded-3xl p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-gray-800 transition-transform ease-out duration-75"
          style={{
            transform: `translateY(${earningTranslateY}px) rotate(${earningRotate}deg)`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            {/* <span className="text-gray-400 hover:text-white cursor-pointer transition-colors text-xs font-semibold">●●●</span> */}
          </div>

          <div className="flex items- justify-between">
            <div>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <span>Earning</span>
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" d="M12 16v-4m0-4h.01" />
                </svg>
              </div>
              <div className="text-3xl font-extrabold tracking-tight mt-1">128k</div>
            </div>

            {/* Sparkline curve */}
            <div className="w-18 h-12">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                <path
                  d="M 0 30 Q 25 35 40 20 T 70 10 T 100 25"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>37.8%</span>
            <span className="text-gray-400 font-normal">this week</span>
          </div>
        </div>

        {/* New Registration Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-1 py-1 pr-2 mb-8 shadow-sm">
          <span className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>
          <span className="text-sm font-[450] text-indigo-950">Registration open</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-gray-900 tracking-tight leading-[1.05] max-w-4xl mb-6">
          Master UI design <br className="hidden sm:inline" /> from scratch
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-md md:text-md font-normal max-w-xl mb-10 leading-relaxed">
          The only design course you need to be among top 1% designers The only design course you need to be among
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">

          <PrimaryButton>Enroll For March 15</PrimaryButton>
          <button className="bg-gray-200/60 hover:scale-105 text-gray-900 text-base font-semibold px-6 py-4 rounded-full transition-all duration-200 active:scale-95">
            See curriculum
          </button>
        </div>

        {/* Course Features Pills (Infinite Marquee with Gradient Mask) */}
        <div className="relative w-full max-w-md overflow-hidden py-4 my-2 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <div className="flex w-max gap-8 animate-marquee">
            {[...Array(4)].flatMap(() => [
              { label: "Certificate", icon: "📜", bg: "bg-amber-100", text: "text-amber-600" },
              { label: "Online", icon: "📺", bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
              { label: "Hands-on", icon: "👌", bg: "bg-cyan-100", text: "text-cyan-600" },
            ]).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-200/50 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm shrink-0 whitespace-nowrap"
              >
                <span className={`w-7 h-7 rounded-xl ${item.bg} ${item.text} flex items-center justify-center text-xs shadow-inner`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>


      </section>

      {/* DASHBOARD PREVIEW CONTAINER */}
      {/* <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24"> */}
      {/* Gray Background Container frame */}
      {/* <div className="bg-[#f1f3f5] rounded-3xl p-4 md:p-8 shadow-inner border border-gray-200/60">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative"> */}

      {/* Left/Middle main dashboard section */}
      {/* <div className="lg:col-span-8 space-y-6"> */}

      {/* Top search & header bar inside dashboard */}
      {/* <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 border border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl text-gray-400 text-sm flex-1 max-w-md border border-gray-200/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path strokeWidth="2" d="M21 21l-4.35-4.35" />
                  </svg>
                  <span>Search or type a command</span>
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">⌘F</span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm">
                    <span>+</span> Create
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer">
                    🔔
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="user" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div> */}

      {/* Main Dashboard Title & Overview Cards */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                </div> */}

      {/* Metrics Cards Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
      {/* Customers card */}
      {/* <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <span className="w-7 h-7 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center">👤</span>
                        <span>Customers</span>
                      </div>
                      <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        ↓ 37.8%
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">1024</div>
                  </div> */}

      {/* Income card */}
      {/* <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <span className="w-7 h-7 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center">📈</span>
                        <span>Income</span>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        ↑ 37.8%
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">256k</div>
                  </div>
                </div> */}

      {/* Welcome Message bar */}
      {/* <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200/60 gap-3">
                  <p className="text-sm text-gray-600">
                    Welcome <span className="font-bold text-gray-900">857 customers</span> with a personal message 😎
                  </p>
                  <button className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                    Send message
                  </button>
                </div> */}

      {/* Customer Avatars */}
      {/* <div className="flex items-center gap-4 pt-2">
                  <div className="flex -space-x-2">
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                  </div>
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors">
                    →
                  </button>
                  <span className="text-xs font-semibold text-gray-500">View all</span>
                </div> */}

      {/* Product Views Chart */}
      {/* <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Product views</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-lg">Last 7 days v</span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 px-2">
                    {[
                      { height: "45%", color: "bg-emerald-200" },
                      { height: "65%", color: "bg-orange-200" },
                      { height: "85%", color: "bg-blue-600", active: true },
                      { height: "55%", color: "bg-emerald-200" },
                      { height: "75%", color: "bg-orange-200" },
                      { height: "60%", color: "bg-emerald-200" },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {bar.active && (
                          <div className="absolute -top-10 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md">
                            24 September <br /> 20k
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${bar.color} group-hover:opacity-80`}
                          style={{ height: bar.height }}
                        />
                      </div>
                    ))}
                  </div>
                </div> */}

      {/* </div>

            </div> */}

      {/* Right sidebar column inside dashboard */}
      {/* <div className="lg:col-span-4 space-y-6"> */}

      {/* Daily Challenge Card */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <h3 className="font-extrabold text-gray-900 text-lg">Daily Challenge</h3>
                    <p className="text-xs text-gray-400">If you dream it, you can do it!</p>
                  </div>
                  <img className="w-9 h-9 rounded-full object-cover border border-amber-300" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80" alt="challenger" />
                </div> */}

      {/* 3D Flag Vector */}
      {/* <div className="my-6 flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-tr from-amber-100 to-yellow-200 rounded-full flex items-center justify-center shadow-inner relative">
                    <span className="text-5xl transform -rotate-12">🚩</span>
                  </div>
                </div> */}

      {/* <div className="text-2xl font-black text-gray-900">22,240</div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Points</div>

                <div className="flex items-center justify-center gap-2 bg-indigo-50 p-2 rounded-xl text-xs font-semibold text-indigo-700">
                  <span>⚡ Power up your streak</span>
                </div>
              </div> */}

      {/* Leaderboard list */}
      {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                {[
                  { name: "Victor Pacheco", time: "2 Days Ago", score: "192,120", rank: "🥇" },
                  { name: "Oea Romana", time: "2 Days Ago", score: "12,120", rank: "🥈" },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <img className="w-full h-full object-cover" src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80`} alt={user.name} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{user.name}</div>
                        <div className="text-[10px] text-gray-400">{user.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-700">{user.score}</span>
                      <span className="ml-1 text-xs">{user.rank}</span>
                    </div>
                  </div>
                ))}
              </div> */}
      {/* 
            </div>

          </div> */}

      {/* Floating Reschedule product modal card at bottom left */}
      {/* <div className="mt-6 md:-mt-16 md:ml-6 relative z-10 w-full max-w-xs bg-white rounded-2xl p-5 shadow-2xl border border-gray-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <span className="w-2 h-4 bg-orange-400 rounded-sm"></span>
                <span>Reschedule product</span>
              </div>
              <span className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer">✕</span>
            </div>

            <p className="text-[11px] text-gray-500 mb-4">
              Choose a day and time in the future you want your product to be published.
            </p>

            <div className="space-y-2 mb-4">
              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-2.5 text-xs text-gray-700 font-semibold flex items-center justify-between">
                <span>📅 November 7, 2044</span>
              </div>
              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-2.5 text-xs text-gray-700 font-semibold flex items-center justify-between">
                <span>⏰ 12:00 AM</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md">
              Reschedule
            </button>
          </div>
        </div>
      </section>
      */}

      {/* DASHBOARD PREVIEW IMAGE */}
      <section className="relative mx-auto pb-24">
        <div className="rounded-3xl overflow-hidden  ">
          <img
            src="/hero/image2.avif"
            alt="Dashboard Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Featured On Brands Footer */}
      <FeaturedOn />
    </div>
  );
}


export default Hero;
