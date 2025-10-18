"use client";

import { useCallback, useMemo, useState } from "react";

import type { CalendarEvent } from "@/app/modules/agenda/types";

export const usePage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const events: CalendarEvent[] = useMemo(
    () => [
      {
        id: "1",
        title: "Reunião",
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 1),
        color: "#8b5cf6",
      },
      {
        id: "2",
        title: "Entrega",
        start: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 2
        ),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 2,
          1
        ),
        color: "#f59e0b",
      },
    ],
    [currentDate]
  );

  const onDateChange = useCallback((d: Date) => setCurrentDate(d), []);
  const onSelectEvent = useCallback((e: CalendarEvent) => {
    // placeholder: poderá abrir drawer/modal
    console.log("Evento selecionado:", e);
  }, []);

  return { currentDate, events, onDateChange, onSelectEvent };
};
