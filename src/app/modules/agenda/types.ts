export type CalendarView = "month" | "week" | "day";

export type AgendaEventType = "contrato" | "orcamento";

export interface CalendarEventMeta extends Record<string, unknown> {
  contratoId?: number;
  orcamentoId?: number;
  clienteNome?: string;
  localDescricao?: string; 
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
  type: AgendaEventType;
  meta?: CalendarEventMeta;
}

export interface CalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events?: CalendarEvent[];
}

export interface CalendarLocale {
  weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Domingo
  weekdaysShort: [string, string, string, string, string, string, string];
  months: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
}

export interface CalendarProps {
  date?: Date;
  view?: CalendarView;
  events?: CalendarEvent[];
  locale?: CalendarLocale;
  onDateChange?: (date: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectDay?: (date: Date) => void;
}
