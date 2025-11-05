"use client";

import { HelpCircle } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { twMerge } from "tailwind-merge";

const LEGEND_ITEMS = [
  {
    color: "bg-purple-800",
    label: "Contrato",
  },
  {
    color: "bg-yellow-500",
    label: "Orçamento",
  },
  //   {
  //     color: "#3b82f6",
  //     label: "Reunião/Visita",
  //   },
];

export function CalendarLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border bg-gray-50 hover:bg-gray-100"
          aria-label="Legenda de cores"
        >
          <HelpCircle className="h-4 w-4 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="center" side="left">
        <div className="space-y-3">
          <p className="text-sm font-medium text-nowrap text-gray-900">
            Identifique seus <span className="text-primary font-bold">compromissos</span> pela cor:
          </p>
          <div className="flex items-center justify-center gap-4">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                  <div className={twMerge("h-3 w-3 rounded-full", item.color)} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
