import React from "react";
import EventsHero from "./EventsHero/EventsHero";
import UpcomingEventsSection from "./UpcomingEventsSection/UpcomingEventsSection";
import PastEventsTimeline from "./PastEventsTimeline/PastEventsTimeline";

export function EventsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <EventsHero />
      </div>
      <div id="upcoming" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <UpcomingEventsSection />
      </div>
      <div id="past-events" className="w-full max-w-7xl mx-auto max-sm:px-5">
        <PastEventsTimeline />
      </div>
    </main>
  );
}

export default EventsPage;
