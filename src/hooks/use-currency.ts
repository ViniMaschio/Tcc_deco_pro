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


  const updateValue = useCallback((value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const validValue = isNaN(numValue) ? 0 : numValue;

    setRawValue(validValue);
    setDisplayValue(formatDecimal(validValue));
  }, []);


  const updateFromFormattedString = useCallback(
    (formattedValue: string) => {
      const parsedValue = parseDecimalString(formattedValue);
      updateValue(parsedValue);
    },
    [updateValue]
  );


  const updateFromCents = useCallback(
    (cents: number) => {
      const decimalValue = centsToDecimal(cents);
      updateValue(decimalValue);
    },
    [updateValue]
  );


  const getFormattedCurrency = useCallback(() => {
    return formatCurrency(rawValue);
  }, [rawValue]);


  const getFormattedDecimal = useCallback(() => {
    return formatDecimal(rawValue);
  }, [rawValue]);


  const getCents = useCallback(() => {
    return decimalToCents(rawValue);
  }, [rawValue]);


  const isValid = useCallback(() => {
    return isValidDecimal(rawValue);
  }, [rawValue]);


  const applyDiscountToValue = useCallback(
    (discountPercent: number | string) => {
      const discountedValue = applyDiscount(rawValue, discountPercent);
      updateValue(discountedValue);
      return discountedValue;
    },
    [rawValue, updateValue]
  );


  const calculateDiscountFromValue = useCallback(
    (discountPercent: number | string) => {
      return calculateDiscount(rawValue, discountPercent);
    },
    [rawValue]
  );


  const addToValue = useCallback(
    (...values: (number | string)[]) => {
      const sum = sumDecimals(rawValue, ...values);
      updateValue(sum);
      return sum;
    },
    [rawValue, updateValue]
  );


  const multiplyValue = useCallback(
    (multiplier: number | string) => {
      const result = multiplyDecimals(rawValue, multiplier);
      updateValue(result);
      return result;
    },
    [rawValue, updateValue]
  );


  const divideValue = useCallback(
    (divisor: number | string) => {
      const result = divideDecimals(rawValue, divisor);
      updateValue(result);
      return result;
    },
    [rawValue, updateValue]
  );


  const roundValue = useCallback(
    (decimals: number = 2) => {
      const rounded = roundDecimal(rawValue, decimals);
      updateValue(rounded);
      return rounded;
    },
    [rawValue, updateValue]
  );


  const reset = useCallback(() => {
    updateValue(0);
  }, [updateValue]);

  return {

    rawValue,
    displayValue,


    updateValue,
    updateFromFormattedString,
    updateFromCents,


    getFormattedCurrency,
    getFormattedDecimal,
    getCents,


    isValid,


    applyDiscountToValue,
    calculateDiscountFromValue,
    addToValue,
    multiplyValue,
    divideValue,
    roundValue,


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


  const updateCents = useCallback((cents: number | string) => {
    const numCents = typeof cents === "string" ? parseInt(cents) : cents;
    const validCents = isNaN(numCents) ? 0 : numCents;

    setCentsValue(validCents);
    setDisplayValue(formatDecimal(centsToDecimal(validCents)));
  }, []);


  const updateFromDecimal = useCallback(
    (decimal: number | string) => {
      const cents = decimalToCents(decimal);
      updateCents(cents);
    },
    [updateCents]
  );


  const updateFromFormattedString = useCallback(
    (formattedValue: string) => {
      const parsedValue = parseDecimalString(formattedValue);
      const cents = decimalToCents(parsedValue);
      updateCents(cents);
    },
    [updateCents]
  );


  const getFormattedCurrency = useCallback(() => {
    return formatCurrencyFromCents(centsValue);
  }, [centsValue]);


  const getFormattedDecimal = useCallback(() => {
    return formatDecimal(centsToDecimal(centsValue));
  }, [centsValue]);


  const getDecimal = useCallback(() => {
    return centsToDecimal(centsValue);
  }, [centsValue]);


  const isValid = useCallback(() => {
    return isValidDecimal(centsValue);
  }, [centsValue]);


  const applyDiscountToValue = useCallback(
    (discountPercent: number | string) => {
      const discountedCents = applyDiscountCents(centsValue, discountPercent);
      updateCents(discountedCents);
      return discountedCents;
    },
    [centsValue, updateCents]
  );


  const calculateDiscountFromValue = useCallback(
    (discountPercent: number | string) => {
      return calculateDiscountCents(centsValue, discountPercent);
    },
    [centsValue]
  );


  const addToValue = useCallback(
    (...values: (number | string)[]) => {
      const sum = sumCents(centsValue, ...values);
      updateCents(sum);
      return sum;
    },
    [centsValue, updateCents]
  );


  const multiplyValue = useCallback(
    (multiplier: number | string) => {
      const result = multiplyCents(centsValue, multiplier);
      updateCents(result);
      return result;
    },
    [centsValue, updateCents]
  );


  const reset = useCallback(() => {
    updateCents(0);
  }, [updateCents]);

  return {

    centsValue,
    displayValue,


    updateCents,
    updateFromDecimal,
    updateFromFormattedString,


    getFormattedCurrency,
    getFormattedDecimal,
    getDecimal,


    isValid,


    applyDiscountToValue,
    calculateDiscountFromValue,
    addToValue,
    multiplyValue,


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
