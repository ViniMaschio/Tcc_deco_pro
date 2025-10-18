/**
 * Exemplos de uso das funções de manipulação de valores monetários
 * Este arquivo demonstra como usar as funções criadas para manipular valores decimais
 */

import React, { useState } from "react";

import { CurrencyDisplay, InputCurrency } from "@/components/input/input-currency";
import { useCurrency, useMultipleCurrency } from "@/hooks/use-currency";
import {
  applyDiscount,
  calculateDiscount,
  centsToDecimal,
  decimalToCents,
  formatCurrency,
  formatDecimal,
  multiplyDecimals,
  parseDecimalString,
  sumDecimals,
} from "@/utils/currency";

// Exemplo 1: Uso básico do hook useCurrency
export function BasicCurrencyExample() {
  const currency = useCurrency(0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo Básico - Hook useCurrency</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Valor:</label>
        <InputCurrency
          value={currency.rawValue}
          onChange={currency.updateValue}
          showCurrency={true}
          placeholder="Digite um valor"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Valor Bruto:</strong> {currency.rawValue}
        </div>
        <div>
          <strong>Valor Formatado:</strong> {currency.getFormattedCurrency()}
        </div>
        <div>
          <strong>Valor em Centavos:</strong> {currency.getCents()}
        </div>
        <div>
          <strong>Válido:</strong> {currency.isValid() ? "Sim" : "Não"}
        </div>
      </div>
    </div>
  );
}

// Exemplo 2: Cálculos com valores monetários
export function CurrencyCalculationsExample() {
  const [value1, setValue1] = useState(100);
  const [value2, setValue2] = useState(50);
  const [discountPercent, setDiscountPercent] = useState(10);

  const sum = sumDecimals(value1, value2);
  const product = multiplyDecimals(value1, 1.5);
  const discount = calculateDiscount(value1, discountPercent);
  const finalValue = applyDiscount(value1, discountPercent);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Cálculos</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor 1:</label>
          <InputCurrency value={value1} onChange={setValue1} showCurrency={true} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor 2:</label>
          <InputCurrency value={value2} onChange={setValue2} showCurrency={true} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Desconto (%):</label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-md bg-gray-50 p-4 text-sm">
        <div>
          <strong>Soma:</strong> <CurrencyDisplay value={sum} />
        </div>
        <div>
          <strong>Produto (x1.5):</strong> <CurrencyDisplay value={product} />
        </div>
        <div>
          <strong>Desconto:</strong> <CurrencyDisplay value={discount} />
        </div>
        <div>
          <strong>Valor Final:</strong> <CurrencyDisplay value={finalValue} />
        </div>
      </div>
    </div>
  );
}

// Exemplo 3: Múltiplos valores monetários
export function MultipleCurrencyExample() {
  const multipleCurrency = useMultipleCurrency();

  const addItem = () => {
    const key = `item_${Date.now()}`;
    multipleCurrency.setValue(key, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo Múltiplos Valores</h3>

      <div className="flex gap-2">
        <button
          onClick={addItem}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Adicionar Item
        </button>
        <button
          onClick={multipleCurrency.reset}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Limpar Tudo
        </button>
      </div>

      <div className="space-y-2">
        {Object.keys(multipleCurrency.values).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <InputCurrency
              value={multipleCurrency.getValue(key)}
              onChange={(value) => multipleCurrency.setValue(key, value)}
              showCurrency={true}
              placeholder="Valor do item"
            />
            <button
              onClick={() => multipleCurrency.resetValue(key)}
              className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <div className="text-lg font-semibold">Total: {multipleCurrency.getTotalFormatted()}</div>
      </div>
    </div>
  );
}

// Exemplo 4: Conversões entre formatos
export function CurrencyConversionsExample() {
  const [decimalValue, setDecimalValue] = useState(123.45);
  const [centsValue, setCentsValue] = useState(12345);

  const decimalToCentsResult = decimalToCents(decimalValue);
  const centsToDecimalResult = centsToDecimal(centsValue);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Conversões</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor Decimal:</label>
          <InputCurrency value={decimalValue} onChange={setDecimalValue} showCurrency={true} />
          <div className="text-sm text-gray-600">Em centavos: {decimalToCentsResult}</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor em Centavos:</label>
          <input
            type="number"
            value={centsValue}
            onChange={(e) => setCentsValue(Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2"
          />
          <div className="text-sm text-gray-600">
            Em decimal: <CurrencyDisplay value={centsToDecimalResult} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Exemplo 5: Formatação de strings
export function CurrencyFormattingExample() {
  const [inputString, setInputString] = useState("123,45");
  const [formattedValue, setFormattedValue] = useState("");

  const handleFormat = () => {
    const parsed = parseDecimalString(inputString);
    const formatted = formatCurrency(parsed);
    setFormattedValue(formatted);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Formatação</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">String de Entrada:</label>
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Ex: 123,45"
          className="w-full rounded-md border px-3 py-2"
        />
        <button
          onClick={handleFormat}
          className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Formatar
        </button>
      </div>

      {formattedValue && (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="text-sm">
            <strong>Valor Formatado:</strong> {formattedValue}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal que agrupa todos os exemplos
export function CurrencyExamples() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Exemplos de Uso - Funções de Moeda</h1>

      <BasicCurrencyExample />
      <CurrencyCalculationsExample />
      <MultipleCurrencyExample />
      <CurrencyConversionsExample />
      <CurrencyFormattingExample />
    </div>
  );
}
