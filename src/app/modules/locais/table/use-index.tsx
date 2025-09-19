import { useState } from "react";

import { OrderProps } from "@/components/sort-icon";
import { DefaultHeadCellProps } from "@/components/types";

export const useTabelaLocais = () => {
  const [strings, setStrings] = useState<OrderProps>({
    key: "id",
    value: "asc",
  });

  const handleRequestSort = () => {};

  const headCells: DefaultHeadCellProps[] = [
    {
      id: "id",
      label: "ID",
      align: "left",
      sort: "id",
    },
    {
      id: "description",
      label: "Descrição",
      align: "left",
      sort: "description",
      filter: "description",
    },
    {
      id: "actions",
      label: "Ações",
      align: "right",
      action: true,
    },
  ];

  return {
    headCells,
    handleRequestSort,
    strings,
    setStrings,
  };
};
