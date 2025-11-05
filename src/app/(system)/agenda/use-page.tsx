"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import type { CalendarEvent } from "@/app/modules/agenda/types";

const fetchEvents = async (month: number, year: number): Promise<CalendarEvent[]> => {
  const response = await fetch(`/api/agenda?month=${month}&year=${year}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Erro ao buscar eventos!");
  }

  const data = await response.json();
  return data.events.map((event: any) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

export const usePage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const {
    data: eventsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["agenda", month, year],
    queryFn: () => fetchEvents(month, year),
    select: (data) => data || [],
  });

  const events: CalendarEvent[] = useMemo(() => eventsData || [], [eventsData]);

  const onDateChange = useCallback(
    (d: Date) => {
      setCurrentDate(d);
      // Refetch quando mudar de mês
      refetch();
    },
    [refetch]
  );

  const onSelectEvent = useCallback((e: CalendarEvent) => {
    // placeholder: poderá abrir drawer/modal
    console.log("Evento selecionado:", e);
  }, []);

  const onSelectDay = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  }, []);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedDate(null);
    }
  }, []);

  return {
    currentDate,
    events,
    isLoading,
    onDateChange,
    onSelectEvent,
    onSelectDay,
    selectedDate,
    isSheetOpen,
    onSheetOpenChange: handleSheetOpenChange,
  };
};
