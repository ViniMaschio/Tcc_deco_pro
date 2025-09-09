"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

import { cn } from "@/lib/utils";

type OnChangeAccepts =
  | ((value: string) => void)
  | ((e: React.ChangeEvent<HTMLInputElement>) => void);

interface InputCnpjProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "defaultValue"
  > {
  name?: string;
  value?: string;
  onChange?: OnChangeAccepts;
}

export const InputCnpj = forwardRef<HTMLInputElement, InputCnpjProps>(
  ({ value, onChange, onBlur, name, placeholder, ...props }, ref) => {
    return (
      <IMaskInput
        mask="00.000.000/0000-00"
        unmask={true}
        value={value ?? ""}
        onAccept={(val) =>
          (onChange as unknown as (v: string) => void)?.(String(val))
        }
        onBlur={onBlur}
        name={name}
        inputRef={ref}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:border-destructive aria-invalid:ring-transparent dark:aria-invalid:ring-transparent",
          props.className,
        )}
        placeholder={placeholder ?? "00.000.000/0000-00"}
        {...props}
      />
    );
  },
);

InputCnpj.displayName = "InputCnpj";
