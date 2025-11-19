"use client";

import { IconButton } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";

import type { CalendarDayCell, CalendarEvent, CalendarLocale, CalendarProps } from "./types";
import { CalendarLegend } from "./legend";

const PT_BR_LOCALE: CalendarLocale = {
  weekStart: 0,
  weekdaysShort: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  months: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, Math.min(date.getDate(), 28));
}

function buildMonthGrid(
  date: Date,
  events: CalendarEvent[],
  locale: CalendarLocale
): CalendarDayCell[] {
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);
  const daysInMonth = lastDay.getDate();

  const startWeekIndex = (firstDay.getDay() - locale.weekStart + 7) % 7;

  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < startWeekIndex; i++) {
    const d = new Date(firstDay);
    d.setDate(firstDay.getDate() - (startWeekIndex - i));
    cells.push({
      date: d,
      isCurrentMonth: false,
      isToday: isSameDay(d, new Date()),
      events: [],
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const dayEvents = events.filter((e) => isSameDay(e.start, d));
    cells.push({
      date: d,
      isCurrentMonth: true,
      isToday: isSameDay(d, new Date()),
      events: dayEvents,
    });
  }

  while (cells.length % 7 !== 0) {
    const d = new Date(lastDay);
    d.setDate(d.getDate() + (cells.length % 7 === 0 ? 0 : 1));
    const next = new Date(cells[cells.length - 1].date);
    next.setDate(next.getDate() + 1);
    cells.push({
      date: next,
      isCurrentMonth: false,
      isToday: isSameDay(next, new Date()),
      events: [],
    });
  }

  while (cells.length < 42) {
    const next = new Date(cells[cells.length - 1].date);
    next.setDate(next.getDate() + 1);
    cells.push({
      date: next,
      isCurrentMonth: false,
      isToday: isSameDay(next, new Date()),
      events: [],
    });
  }

  return cells;
}

export function Calendar({
  date,
  events = [],
  locale = PT_BR_LOCALE,
  onDateChange,
  onSelectEvent,
  onSelectDay,
}: CalendarProps) {
  const currentDate = useMemo(() => date ?? new Date(), [date]);
  const cells = useMemo(
    () => buildMonthGrid(currentDate, events, locale),
    [currentDate, events, locale]
  );
  const headerMonth = `${locale.months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const gotoPrev = () => onDateChange?.(addMonths(currentDate, -1));
  const gotoNext = () => onDateChange?.(addMonths(currentDate, 1));

  return (
    <div className="h-full overflow-auto rounded-b-md bg-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border hover:bg-slate-100"
            onClick={gotoPrev}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-sm font-medium capitalize">{headerMonth}</div>
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border hover:bg-slate-100"
            onClick={gotoNext}
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <CalendarLegend />
        </div>
      </div>

      <div className="w-full min-w-[calc(100vdw-2rem)] overflow-auto rounded-md border border-gray-300">
        <ul className="grid w-full min-w-[840px] grid-cols-7">
          {locale.weekdaysShort.map((d, i) => (
            <li
              key={i}
              className="col-span-1 min-w-[140px] border-b border-b-gray-300 p-2 text-center text-sm font-bold"
            >
              {d}
            </li>
          ))}
          {cells.map((cell, i) => (
            <li
              key={i}
              className={
                "col-span-1 m-2 rounded-md border border-gray-200 p-5 text-center text-nowrap transition-colors hover:bg-gray-100 sm:p-10" +
                (cell.isCurrentMonth
                  ? " bg-white"
                  : " border-transparent bg-transparent text-gray-400") +
                (cell.isToday && "border-b-20 border-b-blue-500") +
                (onSelectDay ? " cursor-pointer" : "")
              }
              onClick={() => onSelectDay?.(cell.date)}
            >
              <div className="py-2 text-sm font-semibold">
                {cell.date.getDate().toString().padStart(2, "0")}
              </div>
              {cell.events && cell.events.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {cell.events.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: ev.color ?? "#6b7280" }}
                      title={ev.title}
                    />
                  ))}
                  {cell.events.length > 3 && (
                    <span className="text-[10px] text-gray-500">+{cell.events.length - 3}</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Calendar;
