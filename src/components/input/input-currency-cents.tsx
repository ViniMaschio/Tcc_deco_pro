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

    // Atualiza o valor de exibição quando o valor prop muda
    useEffect(() => {
      const cents = typeof value === "string" ? parseInt(value) : value;
      if (!isFocused) {
        setDisplayValue(formatDecimal(centsToDecimal(cents)));
      }
    }, [value, isFocused]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanValue = inputValue.replace(/[^\d,.-]/g, "");

      // Se não permite negativos, remove o sinal de menos
      const finalValue = allowNegative ? cleanValue : cleanValue.replace("-", "");

      setDisplayValue(finalValue);

      // Converte para centavos e chama onChange
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

      // Formata o valor final
      const numericValue = parseDecimalString(displayValue);
      const cents = decimalToCents(numericValue);
      const formattedValue = formatDecimal(centsToDecimal(cents));

      setDisplayValue(formattedValue);
      onBlur?.(cents);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite apenas números, vírgula, ponto, backspace, delete, tab, escape, enter
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

      // Permite vírgula e ponto apenas uma vez
      if ((e.key === "," || e.key === ".") && displayValue.includes(",")) {
        e.preventDefault();
        return;
      }

      // Permite apenas números, vírgula e ponto
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

// Componente para exibição de valores em centavos (somente leitura)
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
