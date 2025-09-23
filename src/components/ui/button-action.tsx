import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const buttonActionVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonActionVariants> {
  asChild?: boolean;
  tooltip?: string;
}

const ButtonAction = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, children, tooltip, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return tooltip ? (
      <TooltipProvider delayDuration={100}>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Comp
              className={cn(
                "flex cursor-pointer gap-1",
                buttonActionVariants({ variant, size }),
                className,
              )}
              ref={ref}
              {...props}
            >
              {children}
            </Comp>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            side="left"
            className="sticky z-[200000] text-xs font-bold"
          >
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <Comp
        className={cn(
          "flex gap-1",
          buttonActionVariants({ variant, size }),
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
ButtonAction.displayName = "Button";

export { ButtonAction, buttonActionVariants };
