"use client";

import { AnimateWrapper, TextAnimation } from "@/components/Animations";
import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default as in screenshot

  const faqs: FAQItem[] = [
    {
      question: "Do I need design experience?",
      answer: "Nope. We start from absolute zero and walk you through fundamentals before touching Figma.",
    },
    {
      question: "How much time per week?",
      answer: "Plan for about 5–8 hours per week including video lessons, hands-on exercises, and project work.",
    },
    {
      question: "Is there a payment plan?",
      answer: "Yes! You can choose to pay once or split your enrollment into 3 monthly installments.",
    },
    {
      question: "What if I fall behind?",
      answer: "All live calls are recorded, and you have lifetime access to the curriculum and community to learn at your own pace.",
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes, you will receive a verified Educore Certificate of Completion upon finishing all 6 core portfolio projects.",
    },
    {
      question: "Do you help with placement?",
      answer: "Absolutely. We offer resume reviews, portfolio audits, mock interviews, and direct introductions to hiring partners.",
    },
  ];

  return (
    <section className=" py-24 max-sm:py-14  text-gray-900 font-sans antialiased ">
      <div className=" flex flex-col items-center text-center">

        {/* Top Question Mark Badge */}
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-md mb-6 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-lg">❓</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-14">
          <TextAnimation> Questions? </TextAnimation> <br /><TextAnimation> Good </TextAnimation>
        </h2>

        {/* FAQ Accordion List */}
        <AnimateWrapper className="w-full max-w-3xl space-y-3 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#f4f5f7] border border-gray-200/60 rounded-2xl overflow-hidden text-left"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between font-bold text-base text-gray-900 hover:text-black transition-colors"
                >
                  <span>{faq.question}</span>
                  <div className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ml-4">
                    {isOpen ? "−" : "+"}
                  </div>
                </button>

                {/* Animated Height & Opacity Container */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-medium text-gray-500 leading-relaxed border-t border-gray-200/40">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </AnimateWrapper>

        {/* Bottom Contact Link */}
        <AnimateWrapper as="p" className="text-xs font-semibold text-gray-500">
          Do you have any questions?{" "}
          <a href="#contact" className="text-gray-900 underline font-bold hover:text-black">
            Get in touch with us
          </a>
        </AnimateWrapper>

      </div >
    </section >
  );
}

export default FAQSection;
