"use client";

import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CalendarEvent } from "./types";

interface DayEventsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
}

export function DayEventsSheet({
  open,
  onOpenChange,
  selectedDate,
  events,
  onSelectEvent,
}: DayEventsSheetProps) {
  if (!selectedDate) return null;

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  const formattedDate = format(selectedDate, "d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Lista de eventos</SheetTitle>
          <SheetDescription>{capitalizedDate}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4 p-2">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <Calendar className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-sm">Nenhum evento para este dia</p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onSelectEvent?.(event)}
                className="group relative flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div
                  className="absolute top-0 right-0 h-full w-1 rounded-r-lg"
                  style={{ backgroundColor: event.color ?? "#6b7280" }}
                />
                <div className="shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  )}
                  {event.meta && (
                    <div className="mt-2">
                      {Object.entries(event.meta).map(([key, value]) => (
                        <p key={key} className="text-xs text-gray-500">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    {format(new Date(event.start), "HH:mm", { locale: ptBR })}
                    {event.end &&
                      ` - ${format(new Date(event.end), "HH:mm", {
                        locale: ptBR,
                      })}`}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
