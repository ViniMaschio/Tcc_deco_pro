import { ReactNode } from "react";

export interface DefaultHeadCellProps {
  id: string;
  label: string;
  align: "center" | "left" | "right" | "justify";
  action?: boolean;
  comum?: boolean;
  filter?: string;
  type?: "text" | "number" | "date" | "custom";
  sort?: string;
  component?: ReactNode;
  hide?: boolean;
  checked?: boolean;
  defaultValue?: any;
  customizedPadding?: number;
  customComponent?: ReactNode;
  width?: number;
  widthPdf?: number;
}
