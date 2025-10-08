"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { PiSpinner } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const buttonVariants = cva(
  "flex cursor-pointer items-center justify-center rounded-md border transition-all duration-300 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
  {
    variants: {
      variant: {
        default: "hover:bg-slate-100 text-gray-800",
        primary: "bg-primary text-white hover:bg-primary/90",
        deleteDefault: "bg-red-500 text-white hover:bg-red-400",
        libOutlined:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-primary text-primary hover:bg-primary/15 transition-colors duration-500 ",
        "outline-yellow":
          "border border-yellow-700 text-yellow-700 hover:bg-yellow-700/10 transition-colors duration-500",
        "outline-green":
          "border border-green-500 text-green-500 hover:bg-green-500/10 transition-colors duration-500",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-2 py-3",
        sm: "h-9",
        lg: "h-11",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "icon",
    },
  },
);

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
  variant,
  size = "icon",
  placement = "bottom",
  loading = false,
  loadingColor,
  disabled = false,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip disableHoverableContent={disabled}>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={twMerge(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {loading ? (
            <PiSpinner
              className="animate-spin"
              size="18px"
              color={loadingColor}
            />
          ) : (
            icon
          )}
        </button>
      </TooltipTrigger>
      {tooltip && <TooltipContent side={placement}>{tooltip}</TooltipContent>}
    </Tooltip>
  );
}
