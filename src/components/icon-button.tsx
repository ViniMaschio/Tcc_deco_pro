"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { PiSpinner } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: string;
  loading?: boolean;
  loadingColor?: string;
  placement?: "bottom" | "left" | "right" | "top" | undefined;
}

export function IconButton({
  className,
  icon,
  tooltip,
  placement = "bottom",
  loading = false,
  loadingColor,
  disabled = false,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={twMerge(
        "flex w-9 cursor-pointer items-center justify-center rounded-md transition-all duration-300 disabled:cursor-default disabled:opacity-60",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <Tooltip disableHoverableContent={disabled}>
        <TooltipTrigger asChild>
          {loading ? (
            <PiSpinner
              className="animate-spin"
              size="18px"
              color={loadingColor}
            />
          ) : (
            icon
          )}
        </TooltipTrigger>
        {tooltip && <TooltipContent side={placement}>{tooltip}</TooltipContent>}
      </Tooltip>
    </button>
  );
}
