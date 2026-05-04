"use client";

import { useState } from "react";

const helpTopics = [
  { q: "How do I book a desk?", a: "Go to Book Space, select a date and floor, click an available (green) desk on the floor plan, then confirm your booking." },
  { q: "How do I cancel a booking?", a: "Your active bookings appear in the 'My Bookings' panel. Click 'Cancel' next to any booking and confirm." },
  { q: "How do I update my working status?", a: "Navigate to Update Status and choose Office, Remote, or Out of Office for each day of the week." },
  { q: "What does Plan Team Day do?", a: "Managers can use Plan Team Day to find the best day for the whole team to be in the office together, then schedule everyone at once." },
  { q: "How do I book a meeting room?", a: "Go to Book Space → Meeting Rooms tab. Choose a room and available time slot, then confirm." },
  { q: "What do the floor plan colours mean?", a: "Green tiles are available desks, red/occupied tiles are already booked. Click a green tile to select it." },
];

export default function HelpPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Help"
        title="Help & FAQ"
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="help-title"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              aria-label="Close help"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 id="help-title" className="text-lg font-semibold text-slate-900">Help & FAQ</h2>
            <p className="mt-1 text-sm text-slate-500">Common questions about using the Hybrid Planner.</p>

            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {helpTopics.map((topic) => (
                <details key={topic.q} className="group rounded-lg border border-slate-200 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium text-slate-800 group-open:text-teal-700">
                    {topic.q}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{topic.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-400">Need more help? Contact your workspace administrator.</p>
          </div>
        </div>
      )}
    </>
  );
}
