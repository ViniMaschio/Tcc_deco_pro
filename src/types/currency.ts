/**
 * Tipos para manipulação de valores monetários e decimais
 */

export type CurrencyValue = number | string | null | undefined;

export type CurrencyInputProps = {
  value?: CurrencyValue;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  placeholder?: string;
  showCurrency?: boolean;
  precision?: number;
  allowNegative?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export type CurrencyDisplayProps = {
  value: CurrencyValue;
  showCurrency?: boolean;
  className?: string;
  format?: "currency" | "decimal";
};

export type CurrencyCalculation = {
  baseValue: number;
  discount?: number;
  discountPercent?: number;
  total: number;
  formatted: string;
};

export type CurrencyFormData = {
  [key: string]: CurrencyValue;
};

export type CurrencyValidation = {
  isValid: boolean;
  error?: string;
  value: number;
};

export type CurrencyMask = {
  pattern: string;
  placeholder: string;
  allowNegative: boolean;
  precision: number;
};

export type CurrencyLocale = {
  currency: string;
  locale: string;
  symbol: string;
  decimalSeparator: string;
  thousandSeparator: string;
};


export const CURRENCY_CONFIG = {
  DEFAULT_LOCALE: "pt-BR",
  DEFAULT_CURRENCY: "BRL",
  DEFAULT_PRECISION: 2,
  DEFAULT_SYMBOL: "R$",
  DECIMAL_SEPARATOR: ",",
  THOUSAND_SEPARATOR: ".",
} as const;

export const CURRENCY_MASKS = {
  CURRENCY: {
    pattern: "currency",
    placeholder: "0,00",
    allowNegative: false,
    precision: 2,
  },
  DECIMAL: {
    pattern: "decimal",
    placeholder: "0,00",
    allowNegative: false,
    precision: 2,
  },
  QUANTITY: {
    pattern: "quantity",
    placeholder: "0,000",
    allowNegative: false,
    precision: 3,
  },
} as const;
