"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatDecimal, parseDecimalString, isValidDecimal } from "@/utils/currency";

interface InputCurrencyProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur"> {
  value?: number | string;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  placeholder?: string;
  showCurrency?: boolean;
  precision?: number;
  allowNegative?: boolean;
  className?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      value = 0,
      onChange,
      onBlur,
      placeholder = "0,00",
      showCurrency = true,
      precision = 2,
      allowNegative = false,
      className,
      error = false,
      helperText,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(() => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      return formatDecimal(numValue);
    });

    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (!isFocused) {
        setDisplayValue(formatDecimal(numValue));
      }
    }, [value, isFocused]);

    const formatCurrencyInput = (inputValue: string): string => {
      let cleaned = inputValue.replace(/\D/g, "");

      if (!allowNegative) {
        cleaned = cleaned.replace("-", "");
      }

      if (cleaned === "") {
        return "";
      }

      const numericValue = parseInt(cleaned) / 100;

      return formatDecimal(numericValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const formattedValue = formatCurrencyInput(inputValue);
      setDisplayValue(formattedValue);

      const numericValue = parseDecimalString(formattedValue);

      if (isValidDecimal(numericValue)) {
        onChange?.(numericValue);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);

      const numericValue = parseDecimalString(displayValue);
      const formattedValue = formatDecimal(numericValue);

      setDisplayValue(formattedValue);
      onBlur?.(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (allowedKeys.includes(e.key)) {
        return;
      }

      if (!/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    };

    return (
      <div className="flex w-full flex-col">
        <div className="relative">
          {showCurrency && (
            <span
              className={cn(
                "text-muted-foreground absolute inset-y-0 left-0 flex items-center pl-3 text-sm",
                disabled && "opacity-50"
              )}
            >
              R$
            </span>
          )}
          <input
            ref={ref}
            type="text"
            autoComplete="off"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              showCurrency && "pl-9",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
        </div>
        {error && helperText && (
          <span className="text-destructive mt-1 ml-2 text-sm">{helperText}</span>
        )}
      </div>
    );
  }
);

InputCurrency.displayName = "InputCurrency";

interface CurrencyDisplayProps {
  value: number | string;
  showCurrency?: boolean;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  showCurrency = true,
  className,
}) => {
  const formatValue = (val: number | string) => {
    const numValue = typeof val === "string" ? parseFloat(val) : val;
    return showCurrency
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(numValue)
      : formatDecimal(numValue);
  };

  return <span className={className}>{formatValue(value)}</span>;
};
