"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ClipboardList, FileText } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "./types";

const EVENT_TYPE_CONFIG = {
  contrato: {
    label: "Contrato",
    buttonLabel: "Ver contrato",
    badgeClasses: "border border-purple-200 bg-purple-50 text-purple-700",
    buttonClasses: "border-0 bg-purple-600/10 text-purple-700 hover:bg-purple-600/20",
    Icon: FileText,
  },
  orcamento: {
    label: "Orçamento",
    buttonLabel: "Ver orçamento",
    badgeClasses: "border border-amber-200 bg-amber-50 text-amber-700",
    buttonClasses: "border-0 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20",
    Icon: ClipboardList,
  },
} satisfies Record<
  CalendarEvent["type"],
  {
    label: string;
    buttonLabel: string;
    badgeClasses: string;
    buttonClasses: string;
    Icon: typeof FileText;
  }
>;

const DEFAULT_TYPE_CONFIG = {
  label: "Evento",
  buttonLabel: "Visualizar",
  badgeClasses: "border border-gray-200 bg-gray-50 text-gray-600",
  buttonClasses: "border-0 bg-gray-100 text-gray-700 hover:bg-gray-200",
  Icon: FileText,
};

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
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle>Lista de eventos</SheetTitle>
          <SheetDescription>{capitalizedDate}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-2">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <CalendarIcon className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-sm">Nenhum evento para este dia</p>
            </div>
          ) : (
            dayEvents.map((event) => {
              const typeConfig = EVENT_TYPE_CONFIG[event.type] ?? DEFAULT_TYPE_CONFIG;
              const Icon = typeConfig.Icon;
              const metaEntries = event.meta
                ? Object.entries(event.meta).filter(
                    ([key]) => key !== "contratoId" && key !== "orcamentoId"
                  )
                : [];

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md"
                >
                  <div
                    className="absolute top-0 left-0 h-full w-1 rounded-l-lg"
                    style={{ backgroundColor: event.color ?? "#6b7280" }}
                  />
                  <div className="ml-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-semibold ${typeConfig.badgeClasses}`}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                    )}
                    {metaEntries.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {metaEntries.map(([key, value]) => (
                          <p key={key} className="text-xs text-gray-500">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 ml-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-center text-sm font-medium transition-all ${typeConfig.buttonClasses}`}
                      onClick={() => onSelectEvent?.(event)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{typeConfig.buttonLabel}</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
