import { BroomIcon } from "@phosphor-icons/react/dist/ssr";
import { Funnel } from "lucide-react";

import { IconButton } from "./icon-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type FilterType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type PageFilterProps = {
  filters: FilterType;
  filterCols: FilterType;
  changeFilter: (name: string, value: string | undefined) => void;
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
        {Object.keys(filterCols).map((filter) => (
          <div key={filter}>
            <Label className="font-bold">{filterCols[filter].label}</Label>
            <Input
              className="mt-1"
              placeholder="Pesquisar..."
              type={filterCols[filter].type}
              value={
                filters && (filters[filter as keyof typeof filters] as string)
              }
              onChange={(e) =>
                changeFilter(filterCols[filter].name, e.target.value)
              }
            />
          </div>
        ))}
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
