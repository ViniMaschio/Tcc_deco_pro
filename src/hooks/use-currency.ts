import { useCallback, useState } from "react";

import {
  applyDiscount,
  applyDiscountCents,
  calculateDiscount,
  calculateDiscountCents,
  centsToDecimal,
  decimalToCents,
  divideDecimals,
  formatCurrency,
  formatCurrencyFromCents,
  formatDecimal,
  isValidDecimal,
  multiplyCents,
  multiplyDecimals,
  parseDecimalString,
  roundDecimal,
  sumCents,
  sumDecimals,
} from "@/utils/currency";

/**
 * Hook para manipulação de valores monetários e decimais
 * Fornece funções utilitárias e estado para valores formatados
 */
export function useCurrency(initialValue: number | string = 0) {
  const [rawValue, setRawValue] = useState<number>(() => {
    const numValue = typeof initialValue === "string" ? parseFloat(initialValue) : initialValue;
    return isNaN(numValue) ? 0 : numValue;
  });

  const [displayValue, setDisplayValue] = useState<string>(() => {
    return formatDecimal(rawValue);
  });

  // Atualiza o valor bruto e o valor de exibição
  const updateValue = useCallback((value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const validValue = isNaN(numValue) ? 0 : numValue;

    setRawValue(validValue);
    setDisplayValue(formatDecimal(validValue));
  }, []);

  // Atualiza o valor a partir de uma string formatada brasileira
  const updateFromFormattedString = useCallback(
    (formattedValue: string) => {
      const parsedValue = parseDecimalString(formattedValue);
      updateValue(parsedValue);
    },
    [updateValue]
  );

  // Atualiza o valor a partir de centavos
  const updateFromCents = useCallback(
    (cents: number) => {
      const decimalValue = centsToDecimal(cents);
      updateValue(decimalValue);
    },
    [updateValue]
  );

  // Formata o valor atual para moeda
  const getFormattedCurrency = useCallback(() => {
    return formatCurrency(rawValue);
  }, [rawValue]);

  // Formata o valor atual para decimal
  const getFormattedDecimal = useCallback(() => {
    return formatDecimal(rawValue);
  }, [rawValue]);

  // Obtém o valor em centavos
  const getCents = useCallback(() => {
    return decimalToCents(rawValue);
  }, [rawValue]);

  // Valida se o valor atual é válido
  const isValid = useCallback(() => {
    return isValidDecimal(rawValue);
  }, [rawValue]);

  // Aplica desconto ao valor atual
  const applyDiscountToValue = useCallback(
    (discountPercent: number | string) => {
      const discountedValue = applyDiscount(rawValue, discountPercent);
      updateValue(discountedValue);
      return discountedValue;
    },
    [rawValue, updateValue]
  );

  // Calcula desconto do valor atual
  const calculateDiscountFromValue = useCallback(
    (discountPercent: number | string) => {
      return calculateDiscount(rawValue, discountPercent);
    },
    [rawValue]
  );

  // Soma valores ao valor atual
  const addToValue = useCallback(
    (...values: (number | string)[]) => {
      const sum = sumDecimals(rawValue, ...values);
      updateValue(sum);
      return sum;
    },
    [rawValue, updateValue]
  );

  // Multiplica o valor atual
  const multiplyValue = useCallback(
    (multiplier: number | string) => {
      const result = multiplyDecimals(rawValue, multiplier);
      updateValue(result);
      return result;
    },
    [rawValue, updateValue]
  );

  // Divide o valor atual
  const divideValue = useCallback(
    (divisor: number | string) => {
      const result = divideDecimals(rawValue, divisor);
      updateValue(result);
      return result;
    },
    [rawValue, updateValue]
  );

  // Arredonda o valor atual
  const roundValue = useCallback(
    (decimals: number = 2) => {
      const rounded = roundDecimal(rawValue, decimals);
      updateValue(rounded);
      return rounded;
    },
    [rawValue, updateValue]
  );

  // Reseta o valor para zero
  const reset = useCallback(() => {
    updateValue(0);
  }, [updateValue]);

  return {
    // Valores
    rawValue,
    displayValue,

    // Funções de atualização
    updateValue,
    updateFromFormattedString,
    updateFromCents,

    // Funções de formatação
    getFormattedCurrency,
    getFormattedDecimal,
    getCents,

    // Funções de validação
    isValid,

    // Funções de cálculo
    applyDiscountToValue,
    calculateDiscountFromValue,
    addToValue,
    multiplyValue,
    divideValue,
    roundValue,

    // Utilitários
    reset,
  };
}

/**
 * Hook para manipulação de valores monetários em centavos (inteiros)
 * Ideal para trabalhar com o banco de dados
 */
export function useCurrencyCents(initialValue: number | string = 0) {
  const [centsValue, setCentsValue] = useState<number>(() => {
    const numValue = typeof initialValue === "string" ? parseInt(initialValue) : initialValue;
    return isNaN(numValue) ? 0 : numValue;
  });

  const [displayValue, setDisplayValue] = useState<string>(() => {
    return formatDecimal(centsToDecimal(centsValue));
  });

  // Atualiza o valor em centavos e o valor de exibição
  const updateCents = useCallback((cents: number | string) => {
    const numCents = typeof cents === "string" ? parseInt(cents) : cents;
    const validCents = isNaN(numCents) ? 0 : numCents;

    setCentsValue(validCents);
    setDisplayValue(formatDecimal(centsToDecimal(validCents)));
  }, []);

  // Atualiza o valor a partir de um decimal
  const updateFromDecimal = useCallback(
    (decimal: number | string) => {
      const cents = decimalToCents(decimal);
      updateCents(cents);
    },
    [updateCents]
  );

  // Atualiza o valor a partir de uma string formatada brasileira
  const updateFromFormattedString = useCallback(
    (formattedValue: string) => {
      const parsedValue = parseDecimalString(formattedValue);
      const cents = decimalToCents(parsedValue);
      updateCents(cents);
    },
    [updateCents]
  );

  // Formata o valor atual para moeda
  const getFormattedCurrency = useCallback(() => {
    return formatCurrencyFromCents(centsValue);
  }, [centsValue]);

  // Formata o valor atual para decimal
  const getFormattedDecimal = useCallback(() => {
    return formatDecimal(centsToDecimal(centsValue));
  }, [centsValue]);

  // Obtém o valor em decimal
  const getDecimal = useCallback(() => {
    return centsToDecimal(centsValue);
  }, [centsValue]);

  // Valida se o valor atual é válido
  const isValid = useCallback(() => {
    return isValidDecimal(centsValue);
  }, [centsValue]);

  // Aplica desconto ao valor atual
  const applyDiscountToValue = useCallback(
    (discountPercent: number | string) => {
      const discountedCents = applyDiscountCents(centsValue, discountPercent);
      updateCents(discountedCents);
      return discountedCents;
    },
    [centsValue, updateCents]
  );

  // Calcula desconto do valor atual
  const calculateDiscountFromValue = useCallback(
    (discountPercent: number | string) => {
      return calculateDiscountCents(centsValue, discountPercent);
    },
    [centsValue]
  );

  // Soma valores ao valor atual
  const addToValue = useCallback(
    (...values: (number | string)[]) => {
      const sum = sumCents(centsValue, ...values);
      updateCents(sum);
      return sum;
    },
    [centsValue, updateCents]
  );

  // Multiplica o valor atual
  const multiplyValue = useCallback(
    (multiplier: number | string) => {
      const result = multiplyCents(centsValue, multiplier);
      updateCents(result);
      return result;
    },
    [centsValue, updateCents]
  );

  // Reseta o valor para zero
  const reset = useCallback(() => {
    updateCents(0);
  }, [updateCents]);

  return {
    // Valores
    centsValue,
    displayValue,

    // Funções de atualização
    updateCents,
    updateFromDecimal,
    updateFromFormattedString,

    // Funções de formatação
    getFormattedCurrency,
    getFormattedDecimal,
    getDecimal,

    // Funções de validação
    isValid,

    // Funções de cálculo
    applyDiscountToValue,
    calculateDiscountFromValue,
    addToValue,
    multiplyValue,

    // Utilitários
    reset,
  };
}

/**
 * Hook para manipulação de múltiplos valores monetários
 */
export function useMultipleCurrency() {
  const [values, setValues] = useState<Record<string, number>>({});

  const setValue = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const validValue = isNaN(numValue) ? 0 : numValue;

    setValues((prev) => ({
      ...prev,
      [key]: validValue,
    }));
  }, []);

  const getValue = useCallback(
    (key: string) => {
      return values[key] || 0;
    },
    [values]
  );

  const getFormattedCurrency = useCallback(
    (key: string) => {
      return formatCurrency(getValue(key));
    },
    [getValue]
  );

  const getFormattedDecimal = useCallback(
    (key: string) => {
      return formatDecimal(getValue(key));
    },
    [getValue]
  );

  const getTotal = useCallback(() => {
    return sumDecimals(...Object.values(values));
  }, [values]);

  const getTotalFormatted = useCallback(() => {
    return formatCurrency(getTotal());
  }, [getTotal]);

  const reset = useCallback(() => {
    setValues({});
  }, []);

  const resetValue = useCallback((key: string) => {
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  }, []);

  return {
    values,
    setValue,
    getValue,
    getFormattedCurrency,
    getFormattedDecimal,
    getTotal,
    getTotalFormatted,
    reset,
    resetValue,
  };
}

/**
 * Hook para manipulação de múltiplos valores em centavos
 */
export function useMultipleCurrencyCents() {
  const [values, setValues] = useState<Record<string, number>>({});

  const setValue = useCallback((key: string, cents: number | string) => {
    const numCents = typeof cents === "string" ? parseInt(cents) : cents;
    const validCents = isNaN(numCents) ? 0 : numCents;

    setValues((prev) => ({
      ...prev,
      [key]: validCents,
    }));
  }, []);

  const getValue = useCallback(
    (key: string) => {
      return values[key] || 0;
    },
    [values]
  );

  const getFormattedCurrency = useCallback(
    (key: string) => {
      return formatCurrencyFromCents(getValue(key));
    },
    [getValue]
  );

  const getFormattedDecimal = useCallback(
    (key: string) => {
      return formatDecimal(centsToDecimal(getValue(key)));
    },
    [getValue]
  );

  const getTotal = useCallback(() => {
    return sumCents(...Object.values(values));
  }, [values]);

  const getTotalFormatted = useCallback(() => {
    return formatCurrencyFromCents(getTotal());
  }, [getTotal]);

  const reset = useCallback(() => {
    setValues({});
  }, []);

  const resetValue = useCallback((key: string) => {
    setValues((prev) => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  }, []);

  return {
    values,
    setValue,
    getValue,
    getFormattedCurrency,
    getFormattedDecimal,
    getTotal,
    getTotalFormatted,
    reset,
    resetValue,
  };
}
