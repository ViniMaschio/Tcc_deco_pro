import { CircleNotchIcon } from "@phosphor-icons/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "flex min-w-28 cursor-pointer gap-1 focus-visible:ring-0",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <CircleNotchIcon className="animate-spin" weight="bold" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
