import React from "react";
import Hero from "./Hero/Hero";
import RealCraftSection from "./RealCraftSection/RealCraftSection";
import StackedCardsSection from "./StackedCardsSection/StackedCardsSection";
import CurriculumSection from "./CurriculumSection/CurriculumSection";
import ProjectsCarouselSection from "./ProjectsCarouselSection/ProjectsCarouselSection";
import FourStepsSection from "./FourStepsSection/FourStepsSection";
import StudentShowcaseSection from "./StudentShowcaseSection/StudentShowcaseSection";
import TestimonialsSection from "./TestimonialsSection/TestimonialsSection";
import PricingSection from "./PricingSection/PricingSection";
import StatsSection from "./StatsSection/StatsSection";
import InstructorSection from "./InstructorSection/InstructorSection";
import StarterKitSection from "./StarterKitSection/StarterKitSection";
import CommunitySection from "./CommunitySection/CommunitySection";
import FAQSection from "./FAQSection/FAQSection";

export function Homepage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center ">
      <div id="overview" className="w-full max-w-7xl">
        <Hero />
      </div>
      <div className="w-full max-w-7xl mx-auto max-sm:px-5">
        <RealCraftSection />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <StackedCardsSection />
      </div>
      <div id="curriculum" className="w-full max-w-7xl  mx-auto max-sm:px-5">
        <CurriculumSection />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <ProjectsCarouselSection />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <FourStepsSection />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <StudentShowcaseSection />
      </div>
      <div id="testimonials" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <TestimonialsSection />
      </div>
      <div id="pricing" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <PricingSection />
      </div>
      <div className="w-full max-w-7xl mx-auto max-sm:px-5">
        <StatsSection />
      </div>
      <div id="instructor" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <InstructorSection />
      </div>
      <div className="w-full max-w-7xl mx-auto max-sm:px-5">
        <StarterKitSection />
      </div>
      <div className="w-full overflow-hidden">
        <CommunitySection />
      </div>
      <div id="faqs" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <FAQSection />
      </div>
    </main>
  );
}


export default Homepage;













