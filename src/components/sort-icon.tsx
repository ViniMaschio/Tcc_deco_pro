import type React from "react";
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCaretUpDownBold,
} from "react-icons/pi";

import { IconButton } from "./icon-button";

export interface OrderProps {
  key: string;
  value: "asc" | "desc" | undefined;
}

interface SortableIconProps {
  field: string;
  strings: OrderProps;
  handleRequestSort: (value: string) => void;
}

const SortableIcon: React.FC<SortableIconProps> = ({
  field,
  strings,
  handleRequestSort,
}) => {
  const getIcon = () => {
    if (strings.key === field) {
      return strings.value === "asc" ? <PiCaretUpBold /> : <PiCaretDownBold />;
    }
    return <PiCaretUpDownBold />;
  };

  return (
    <IconButton
      className="hover:bg-opacity-75 h-full w-8 transition-all"
      icon={getIcon()}
      type="button"
      onClick={() => handleRequestSort(field)}
    />
  );
};

export default SortableIcon;
