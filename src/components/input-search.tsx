import { CircleNotchIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onSearch: (value: string | number | readonly string[] | undefined) => void;
  searching?: boolean;
};

const InputWithSearch = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onSearch, searching, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border-none text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none",
          props.disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <Input
          className="focus:border-input w-full rounded-l-md rounded-r-none border focus:outline-none"
          type={type}
          autoComplete="off"
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          className="dark:bg-primary hover:bg-primary/90 bg-primary border-primary h-full w-14 rounded-l-none border text-white"
          onClick={() => !searching && !props.disabled && onSearch(props.value)}
        >
          {!searching ? (
            <MagnifyingGlassIcon weight="bold" />
          ) : (
            <CircleNotchIcon className="animate-spin" weight="bold" />
          )}
        </Button>
      </div>
    );
  },
);
InputWithSearch.displayName = "InputWithSearch";

export { InputWithSearch };
