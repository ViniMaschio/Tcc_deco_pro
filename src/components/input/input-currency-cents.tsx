"use client";

import React, { forwardRef, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  centsToDecimal,
  decimalToCents,
  formatDecimal,
  isValidDecimal,
  parseDecimalString,
} from "@/utils/currency";

interface InputCurrencyCentsProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur"> {
  value?: number | string; // Valor em centavos
  onChange?: (cents: number) => void;
  onBlur?: (cents: number) => void;
  placeholder?: string;
  showCurrency?: boolean;
  precision?: number;
  allowNegative?: boolean;
  className?: string;
}

export const InputCurrencyCents = forwardRef<HTMLInputElement, InputCurrencyCentsProps>(
  (
    {
      value = 0,
      onChange,
      onBlur,
      placeholder = "0,00",
      showCurrency = false,
      allowNegative = false,
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(() => {
      const cents = typeof value === "string" ? parseInt(value) : value;
      return formatDecimal(centsToDecimal(cents));
    });

    const [isFocused, setIsFocused] = useState(false);


    useEffect(() => {
      const cents = typeof value === "string" ? parseInt(value) : value;
      if (!isFocused) {
        setDisplayValue(formatDecimal(centsToDecimal(cents)));
      }
    }, [value, isFocused]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;


      const cleanValue = inputValue.replace(/[^\d,.-]/g, "");


      const finalValue = allowNegative ? cleanValue : cleanValue.replace("-", "");

      setDisplayValue(finalValue);


      const numericValue = parseDecimalString(finalValue);
      const cents = decimalToCents(numericValue);

      if (isValidDecimal(numericValue)) {
        onChange?.(cents);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);


      const numericValue = parseDecimalString(displayValue);
      const cents = decimalToCents(numericValue);
      const formattedValue = formatDecimal(centsToDecimal(cents));

      setDisplayValue(formattedValue);
      onBlur?.(cents);
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


      if ((e.key === "," || e.key === ".") && displayValue.includes(",")) {
        e.preventDefault();
        return;
      }


      if (!/[\d,.-]/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className="relative">
        {showCurrency && (
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform text-sm">
            R$
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(showCurrency && "pl-8", className)}
          {...props}
        />
      </div>
    );
  }
);

InputCurrencyCents.displayName = "InputCurrencyCents";


interface CurrencyCentsDisplayProps {
  value: number | string; // Valor em centavos
  showCurrency?: boolean;
  className?: string;
}

export const CurrencyCentsDisplay: React.FC<CurrencyCentsDisplayProps> = ({
  value,
  showCurrency = true,
  className,
}) => {
  const formatValue = (cents: number | string) => {
    const numCents = typeof cents === "string" ? parseInt(cents) : cents;
    const decimalValue = centsToDecimal(numCents);

    return showCurrency
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(decimalValue)
      : formatDecimal(decimalValue);
  };

  return <span className={className}>{formatValue(value)}</span>;
};
