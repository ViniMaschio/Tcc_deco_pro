"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDecimal, parseDecimalString, isValidDecimal } from "@/utils/currency";

interface InputCurrencyProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: number | string;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  placeholder?: string;
  showCurrency?: boolean;
  precision?: number;
  allowNegative?: boolean;
  className?: string;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      value = 0,
      onChange,
      onBlur,
      placeholder = "0,00",
      showCurrency = false,
      precision = 2,
      allowNegative = false,
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(() => {
      return formatDecimal(typeof value === "string" ? parseFloat(value) : value);
    });

    const [isFocused, setIsFocused] = useState(false);

    // Atualiza o valor de exibição quando o valor prop muda
    useEffect(() => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (!isFocused) {
        setDisplayValue(formatDecimal(numValue));
      }
    }, [value, isFocused]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove caracteres não numéricos exceto vírgula e ponto
      const cleanValue = inputValue.replace(/[^\d,.-]/g, "");

      // Se não permite negativos, remove o sinal de menos
      const finalValue = allowNegative ? cleanValue : cleanValue.replace("-", "");

      setDisplayValue(finalValue);

      // Converte para número e chama onChange
      const numericValue = parseDecimalString(finalValue);

      if (isValidDecimal(numericValue)) {
        onChange?.(numericValue);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);

      // Formata o valor final
      const numericValue = parseDecimalString(displayValue);
      const formattedValue = formatDecimal(numericValue);

      setDisplayValue(formattedValue);
      onBlur?.(numericValue);
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

InputCurrency.displayName = "InputCurrency";

// Componente para exibição de valores formatados (somente leitura)
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
