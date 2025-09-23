"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  onSelect: (value: Date) => void;
  value: Date | undefined;
  fromDate?: Date;
  toDate?: Date;
  disabled?: boolean;
}

export function DatePicker({
  onSelect,
  value,
  fromDate,
  toDate,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"libOutlined"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="text-primary-main mr-2 h-4 w-4" />
          <div className="w-full text-center">
            {value ? (
              format(value, "PPP", { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onDayClick={onSelect}
          initialFocus
          locale={ptBR}
          toDate={toDate}
          fromDate={fromDate}
        />
      </PopoverContent>
    </Popover>
  );
}
