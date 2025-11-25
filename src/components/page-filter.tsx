import { BroomIcon } from "@phosphor-icons/react/dist/ssr";
import { Funnel } from "lucide-react";

import { IconButton } from "./icon-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DatePicker } from "./ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type FilterType = {
  [key: string]: any;
};

type PageFilterProps = {
  filters: FilterType;
  filterCols: FilterType;
  changeFilter: (name: string, value: string | Date | undefined) => void;
  clearFilters: () => void;
};

export const PageFilter = ({
  filters,
  filterCols,
  changeFilter,
  clearFilters,
}: PageFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={<Funnel size={18} />} />
      </PopoverTrigger>
      <PopoverContent
        className="relative flex max-h-[50dvh] w-full justify-center gap-2 overflow-auto align-bottom"
        side="left"
      >
        {Object.keys(filterCols).map((filter) => {
          const filterConfig = filterCols[filter];
          const filterValue =
            filters &&
            (filters[filterConfig.name as keyof typeof filters] as string | Date | undefined);

          // Função para converter string YYYY-MM-DD para Date no timezone local
          const parseDateString = (dateString: string): Date => {
            const [year, month, day] = dateString.split("-").map(Number);
            return new Date(year, month - 1, day);
          };

          return (
            <div key={filter}>
              <Label className="font-bold">{filterConfig.label}</Label>
              {filterConfig.type === "date" ? (
                <div className="mt-1">
                  <DatePicker
                    key={`${filterConfig.name}-${filterValue || "empty"}`}
                    value={
                      filterValue instanceof Date
                        ? filterValue
                        : filterValue &&
                            typeof filterValue === "string" &&
                            filterValue.trim() !== ""
                          ? parseDateString(filterValue)
                          : undefined
                    }
                    onSelect={(date) => {
                      // Formatar data como YYYY-MM-DD para enviar à API
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const day = String(date.getDate()).padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day}`;
                        changeFilter(filterConfig.name, formattedDate);
                      } else {
                        changeFilter(filterConfig.name, undefined);
                      }
                    }}
                  />
                </div>
              ) : filterConfig.type === "select" ? (
                <div className="mt-1">
                  <Select
                    value={
                      filterValue
                        ? (filterValue as string)
                        : (filterConfig.options || filterConfig.fields)?.some(
                              (f: { value: string }) => f.value === "TODOS"
                            )
                          ? "TODOS"
                          : undefined
                    }
                    onValueChange={(value) => {
                      const finalValue =
                        value === "TODOS" || value === "" ? undefined : value || undefined;
                      changeFilter(filterConfig.name, finalValue);
                    }}
                  >
                    <SelectTrigger className="w-40" size="md">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(filterConfig.options || filterConfig.fields)
                        ?.filter((field: { value: string; label: string }) => field.value !== "")
                        ?.map((field: { value: string; label: string }) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Input
                  className="mt-1"
                  placeholder="Pesquisar..."
                  type={filterConfig.type}
                  value={(filterValue as string) || ""}
                  onChange={(e) => changeFilter(filterConfig.name, e.target.value || undefined)}
                />
              )}
            </div>
          );
        })}
        {clearFilters ? (
          <IconButton
            icon={<BroomIcon size={18} />}
            className="mt-auto"
            onClick={clearFilters}
            variant="primary"
          />
        ) : undefined}
      </PopoverContent>
    </Popover>
  );
};
