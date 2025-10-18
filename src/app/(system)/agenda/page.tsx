"use client";

import Calendar from "@/app/modules/agenda/components";

import { usePage } from "./use-page";

export default function Page() {
  const { currentDate, events, onDateChange, onSelectEvent } = usePage();

  return (
    <div className="mb-2 overflow-auto rounded-b-md bg-white p-6 sm:mx-1">
      <Calendar
        date={currentDate}
        events={events}
        onDateChange={onDateChange}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
