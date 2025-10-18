/**
 * Utilitários para manipulação de valores monetários
 * Trabalha com centavos (inteiros) como padrão para evitar erros de precisão
 * Converte para decimal apenas na exibição
 */

/**
 * Converte um valor decimal para centavos (inteiro)
 * Exemplo: 123.45 -> 12345
 */
export function decimalToCents(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 0;
  }

  return Math.round(numValue * 100);
}

/**
 * Converte centavos (inteiro) para valor decimal
 * Exemplo: 12345 -> 123.45
 */
export function centsToDecimal(cents: number | string | null | undefined): number {
  if (cents === null || cents === undefined || cents === "") {
    return 0;
  }

  const numCents = typeof cents === "string" ? parseInt(cents) : cents;

  if (isNaN(numCents)) {
    return 0;
  }

  return numCents / 100;
}

/**
 * Converte quantidade decimal para milésimos (inteiro)
 * Exemplo: 1.5 -> 1500
 */
export function decimalToMilliseconds(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 0;
  }

  return Math.round(numValue * 1000);
}

/**
 * Converte milésimos (inteiro) para quantidade decimal
 * Exemplo: 1500 -> 1.5
 */
export function millisecondsToDecimal(milliseconds: number | string | null | undefined): number {
  if (milliseconds === null || milliseconds === undefined || milliseconds === "") {
    return 0;
  }

  const numMilliseconds = typeof milliseconds === "string" ? parseInt(milliseconds) : milliseconds;

  if (isNaN(numMilliseconds)) {
    return 0;
  }

  return numMilliseconds / 1000;
}

/**
 * Formata centavos para exibição em moeda brasileira
 * Exemplo: 12345 -> "R$ 123,45"
 */
export function formatCurrencyFromCents(cents: number | string | null | undefined): string {
  if (cents === null || cents === undefined || cents === "") {
    return "R$ 0,00";
  }

  const numCents = typeof cents === "string" ? parseInt(cents) : cents;

  if (isNaN(numCents)) {
    return "R$ 0,00";
  }

  const decimalValue = numCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(decimalValue);
}

/**
 * Formata um valor decimal para exibição em moeda brasileira
 * Exemplo: 123.45 -> "R$ 123,45"
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "R$ 0,00";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

/**
 * Formata um valor decimal para exibição numérica brasileira
 * Exemplo: 123.45 -> "123,45"
 */
export function formatDecimal(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "0,00";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Converte string formatada brasileira para número decimal
 * Exemplo: "123,45" -> 123.45
 */
export function parseDecimalString(value: string): number {
  if (!value || value.trim() === "") {
    return 0;
  }

  // Remove espaços e converte vírgula para ponto
  const cleanValue = value.trim().replace(/\./g, "").replace(",", ".");

  const numValue = parseFloat(cleanValue);

  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Converte string formatada brasileira para centavos
 * Exemplo: "123,45" -> 12345
 */
export function parseCurrencyString(value: string): number {
  return decimalToCents(parseDecimalString(value));
}

/**
 * Valida se um valor é um número decimal válido
 */
export function isValidDecimal(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true; // Considera vazio como válido
  }

  const numValue = typeof value === "string" ? parseFloat(value) : Number(value);

  return !isNaN(numValue) && isFinite(numValue);
}

/**
 * Arredonda um valor decimal para 2 casas decimais
 */
export function roundDecimal(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calcula a soma de valores decimais com precisão
 */
export function sumDecimals(...values: (number | string | null | undefined)[]): number {
  return values.reduce((sum: number, value) => {
    const numValue = typeof value === "string" ? parseFloat(value) : (value ?? 0);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);
}

/**
 * Calcula a soma de centavos (inteiros)
 */
export function sumCents(...values: (number | string | null | undefined)[]): number {
  return values.reduce((sum: number, value) => {
    const numValue = typeof value === "string" ? parseInt(value) : (value ?? 0);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);
}

/**
 * Calcula a multiplicação de valores decimais com precisão
 */
export function multiplyDecimals(value1: number | string, value2: number | string): number {
  const num1 = typeof value1 === "string" ? parseFloat(value1) : value1 || 0;
  const num2 = typeof value2 === "string" ? parseFloat(value2) : value2 || 0;

  if (isNaN(num1) || isNaN(num2)) {
    return 0;
  }

  return roundDecimal(num1 * num2);
}

/**
 * Calcula a multiplicação de centavos (inteiros)
 */
export function multiplyCents(value1: number | string, value2: number | string): number {
  const num1 = typeof value1 === "string" ? parseInt(value1) : value1 || 0;
  const num2 = typeof value2 === "string" ? parseInt(value2) : value2 || 0;

  if (isNaN(num1) || isNaN(num2)) {
    return 0;
  }

  return Math.round(num1 * num2);
}

/**
 * Calcula a divisão de valores decimais com precisão
 */
export function divideDecimals(value1: number | string, value2: number | string): number {
  const num1 = typeof value1 === "string" ? parseFloat(value1) : value1 || 0;
  const num2 = typeof value2 === "string" ? parseFloat(value2) : value2 || 0;

  if (isNaN(num1) || isNaN(num2) || num2 === 0) {
    return 0;
  }

  return roundDecimal(num1 / num2);
}

/**
 * Calcula desconto percentual
 */
export function calculateDiscount(
  value: number | string,
  discountPercent: number | string
): number {
  const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
  const numDiscount =
    typeof discountPercent === "string" ? parseFloat(discountPercent) : discountPercent || 0;

  if (isNaN(numValue) || isNaN(numDiscount)) {
    return 0;
  }

  return roundDecimal(numValue * (numDiscount / 100));
}

/**
 * Calcula desconto percentual em centavos
 */
export function calculateDiscountCents(
  valueCents: number | string,
  discountPercent: number | string
): number {
  const numValue = typeof valueCents === "string" ? parseInt(valueCents) : valueCents || 0;
  const numDiscount =
    typeof discountPercent === "string" ? parseFloat(discountPercent) : discountPercent || 0;

  if (isNaN(numValue) || isNaN(numDiscount)) {
    return 0;
  }

  return Math.round(numValue * (numDiscount / 100));
}

/**
 * Aplica desconto a um valor
 */
export function applyDiscount(value: number | string, discountPercent: number | string): number {
  const numValue = typeof value === "string" ? parseFloat(value) : value || 0;
  const discount = calculateDiscount(numValue, discountPercent);

  return roundDecimal(numValue - discount);
}

/**
 * Aplica desconto a um valor em centavos
 */
export function applyDiscountCents(
  valueCents: number | string,
  discountPercent: number | string
): number {
  const numValue = typeof valueCents === "string" ? parseInt(valueCents) : valueCents || 0;
  const discount = calculateDiscountCents(numValue, discountPercent);

  return numValue - discount;
}

/**
 * Formata valor para input (remove formatação de moeda)
 */
export function formatForInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "";
  }

  return numValue.toString();
}

/**
 * Formata valor para input com máscara brasileira
 */
export function formatForInputBR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "";
  }

  return formatDecimal(numValue);
}
