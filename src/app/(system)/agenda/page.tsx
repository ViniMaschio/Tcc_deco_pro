"use client";

import Calendar from "@/app/modules/agenda/components";
import { DayEventsSheet } from "@/app/modules/agenda/day-events-sheet";

import { usePage } from "./use-page";

export default function Page() {
  const {
    currentDate,
    events,
    onDateChange,
    onSelectEvent,
    onSelectDay,
    selectedDate,
    isSheetOpen,
    onSheetOpenChange,
  } = usePage();

  return (
    <>
      <div className="mb-2 overflow-auto rounded-b-md bg-white p-6 sm:mx-1">
        <Calendar
          date={currentDate}
          events={events}
          onDateChange={onDateChange}
          onSelectEvent={onSelectEvent}
          onSelectDay={onSelectDay}
        />
      </div>
      <DayEventsSheet
        open={isSheetOpen}
        onOpenChange={onSheetOpenChange}
        selectedDate={selectedDate}
        events={events}
        onSelectEvent={onSelectEvent}
      />
    </>
  );
}
