"use client";

import Calendar from "@/app/modules/agenda/components";
import { DayEventsSheet } from "@/app/modules/agenda/day-events-sheet";
import { ViewContratoModal } from "@/app/modules/contrato/view-modal";
import { ViewItemsModal } from "@/app/modules/orcamento/view-modal";

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
    focusedEntity,
    onCloseFocusedEntity,
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
      <ViewContratoModal
        open={focusedEntity?.type === "contrato"}
        contratoId={focusedEntity?.type === "contrato" ? focusedEntity.id : null}
        onOpenChange={(open) => {
          if (!open) {
            onCloseFocusedEntity();
          }
        }}
      />
      <ViewItemsModal
        open={focusedEntity?.type === "orcamento"}
        orcamentoId={focusedEntity?.type === "orcamento" ? focusedEntity.id : null}
        onOpenChange={(open) => {
          if (!open) {
            onCloseFocusedEntity();
          }
        }}
      />
    </>
  );
}
