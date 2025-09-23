import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

import { ButtonAction } from "./ui/button-action";

export type SortingType = {
  name: string;
  type: "asc" | "desc";
};

type Filters = {
  sorting: SortingType;
};

type SortTableProps = {
  filters: Filters;
  name: string;
  changeFilter: (name: string, value: SortingType) => void;
};

export const SortTable = ({ filters, name, changeFilter }: SortTableProps) => {
  return filters.sorting.name === name ? (
    <>
      {filters.sorting.type === "asc" ? (
        <ButtonAction
          variant={"ghost"}
          className="w-7 p-0"
          onClick={() =>
            changeFilter("sorting", {
              name,
              type: "desc",
            })
          }
        >
          <CaretUpIcon size={16} weight="bold" />
        </ButtonAction>
      ) : (
        <ButtonAction
          variant={"ghost"}
          className="w-7 p-0"
          onClick={() =>
            changeFilter("sorting", {
              name,
              type: "asc",
            })
          }
        >
          <CaretDownIcon size={16} weight="bold" />
        </ButtonAction>
      )}
    </>
  ) : (
    <ButtonAction
      variant={"ghost"}
      className="w-7 p-0"
      onClick={() =>
        changeFilter("sorting", {
          name,
          type: "asc",
        })
      }
    >
      <CaretUpDownIcon size={16} weight="bold" />
    </ButtonAction>
  );
};
