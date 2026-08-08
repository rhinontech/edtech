"use client";

import React, { useState } from "react";
import { PrimaryButton } from "@/components/Common";

export function SaveSeatForm({ eventTitle }: { eventTitle: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4">
          ✓
        </div>
        <h4 className="text-lg font-black text-gray-900 tracking-tight mb-2">
          Seat saved!
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          You&apos;re on the list for <b className="text-gray-900">{eventTitle}</b>.
          We&apos;ll email your confirmation and the joining details to{" "}
          <b className="text-gray-900">{email}</b>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black transition-all"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black transition-all"
      />
      <PrimaryButton type="submit" className="w-full">
        Save your seat
      </PrimaryButton>
      <p className="text-[11px] text-gray-400 text-center leading-relaxed pt-1">
        Free to attend. We&apos;ll only email you about this event.
      </p>
    </form>
  );
}

export default SaveSeatForm;
