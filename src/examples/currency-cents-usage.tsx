/**
 * Exemplos de uso das funções de manipulação de valores monetários em centavos
 * Este arquivo demonstra como usar as funções para trabalhar com valores inteiros no banco
 */

import React, { useState } from "react";

import { CurrencyCentsDisplay,InputCurrencyCents } from "@/components/input/input-currency-cents";
import { useCurrencyCents, useMultipleCurrencyCents } from "@/hooks/use-currency";
import {
  applyDiscountCents,
  calculateDiscountCents,
  centsToDecimal,
  decimalToCents,
  multiplyCents,
  sumCents,
} from "@/utils/currency";

// Exemplo 1: Uso básico do hook useCurrencyCents
export function BasicCurrencyCentsExample() {
  const currency = useCurrencyCents(0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo Básico - Hook useCurrencyCents</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Valor (em centavos):</label>
        <InputCurrencyCents
          value={currency.centsValue}
          onChange={currency.updateCents}
          showCurrency={true}
          placeholder="Digite um valor"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Valor em Centavos:</strong> {currency.centsValue}
        </div>
        <div>
          <strong>Valor Decimal:</strong> {currency.getDecimal()}
        </div>
        <div>
          <strong>Valor Formatado:</strong> {currency.getFormattedCurrency()}
        </div>
        <div>
          <strong>Válido:</strong> {currency.isValid() ? "Sim" : "Não"}
        </div>
      </div>
    </div>
  );
}

// Exemplo 2: Cálculos com valores em centavos
export function CurrencyCentsCalculationsExample() {
  const [value1Cents, setValue1Cents] = useState(10000); // R$ 100,00
  const [value2Cents, setValue2Cents] = useState(5000); // R$ 50,00
  const [discountPercent, setDiscountPercent] = useState(10);

  const sum = sumCents(value1Cents, value2Cents);
  const product = multiplyCents(value1Cents, 1.5);
  const discount = calculateDiscountCents(value1Cents, discountPercent);
  const finalValue = applyDiscountCents(value1Cents, discountPercent);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Cálculos em Centavos</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor 1 (centavos):</label>
          <InputCurrencyCents value={value1Cents} onChange={setValue1Cents} showCurrency={true} />
          <div className="text-xs text-gray-500">Centavos: {value1Cents}</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor 2 (centavos):</label>
          <InputCurrencyCents value={value2Cents} onChange={setValue2Cents} showCurrency={true} />
          <div className="text-xs text-gray-500">Centavos: {value2Cents}</div>
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
          <strong>Soma:</strong> <CurrencyCentsDisplay value={sum} />
          <div className="text-xs text-gray-500">({sum} centavos)</div>
        </div>
        <div>
          <strong>Produto (x1.5):</strong> <CurrencyCentsDisplay value={product} />
          <div className="text-xs text-gray-500">({product} centavos)</div>
        </div>
        <div>
          <strong>Desconto:</strong> <CurrencyCentsDisplay value={discount} />
          <div className="text-xs text-gray-500">({discount} centavos)</div>
        </div>
        <div>
          <strong>Valor Final:</strong> <CurrencyCentsDisplay value={finalValue} />
          <div className="text-xs text-gray-500">({finalValue} centavos)</div>
        </div>
      </div>
    </div>
  );
}

// Exemplo 3: Múltiplos valores em centavos
export function MultipleCurrencyCentsExample() {
  const multipleCurrency = useMultipleCurrencyCents();

  const addItem = () => {
    const key = `item_${Date.now()}`;
    multipleCurrency.setValue(key, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo Múltiplos Valores em Centavos</h3>

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
            <InputCurrencyCents
              value={multipleCurrency.getValue(key)}
              onChange={(cents) => multipleCurrency.setValue(key, cents)}
              showCurrency={true}
              placeholder="Valor do item"
            />
            <div className="text-xs text-gray-500">{multipleCurrency.getValue(key)} centavos</div>
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
        <div className="text-sm text-gray-500">{multipleCurrency.getTotal()} centavos</div>
      </div>
    </div>
  );
}

// Exemplo 4: Conversões entre centavos e decimais
export function CurrencyCentsConversionsExample() {
  const [decimalValue, setDecimalValue] = useState(123.45);
  const [centsValue, setCentsValue] = useState(12345);

  const decimalToCentsResult = decimalToCents(decimalValue);
  const centsToDecimalResult = centsToDecimal(centsValue);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exemplo de Conversões Centavos ↔ Decimal</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Valor Decimal:</label>
          <input
            type="number"
            step="0.01"
            value={decimalValue}
            onChange={(e) => setDecimalValue(Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2"
          />
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
            Em decimal: <CurrencyCentsDisplay value={centsToDecimalResult} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Exemplo 5: Simulação de dados do banco
export function DatabaseSimulationExample() {
  const [orcamento] = useState({
    total: 15000, // R$ 150,00 em centavos
    desconto: 1500, // R$ 15,00 em centavos
    itens: [
      { nome: "Item 1", preco: 5000, quantidade: 2 }, // R$ 50,00
      { nome: "Item 2", preco: 3000, quantidade: 1 }, // R$ 30,00
    ],
  });

  const subtotal = sumCents(
    ...orcamento.itens.map((item) => multiplyCents(item.preco, item.quantidade))
  );
  const totalComDesconto = subtotal - orcamento.desconto;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Simulação de Dados do Banco</h3>

      <div className="space-y-2">
        <h4 className="font-medium">Itens do Orçamento:</h4>
        {orcamento.itens.map((item, index) => (
          <div key={index} className="flex justify-between rounded-md bg-gray-50 p-2">
            <span>{item.nome}</span>
            <div className="text-right">
              <div>
                <CurrencyCentsDisplay value={item.preco} />
              </div>
              <div className="text-xs text-gray-500">x {item.quantidade}</div>
              <div className="font-medium">
                <CurrencyCentsDisplay value={multiplyCents(item.preco, item.quantidade)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md bg-blue-50 p-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <CurrencyCentsDisplay value={subtotal} />
        </div>
        <div className="flex justify-between">
          <span>Desconto:</span>
          <CurrencyCentsDisplay value={orcamento.desconto} />
        </div>
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total:</span>
          <CurrencyCentsDisplay value={totalComDesconto} />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <div>Subtotal: {subtotal} centavos</div>
        <div>Desconto: {orcamento.desconto} centavos</div>
        <div>Total: {totalComDesconto} centavos</div>
      </div>
    </div>
  );
}

// Componente principal que agrupa todos os exemplos
export function CurrencyCentsExamples() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Exemplos de Uso - Funções de Moeda em Centavos</h1>
      <p className="text-gray-600">
        Este sistema trabalha com valores inteiros (centavos) no banco de dados para evitar erros de
        precisão.
      </p>

      <BasicCurrencyCentsExample />
      <CurrencyCentsCalculationsExample />
      <MultipleCurrencyCentsExample />
      <CurrencyCentsConversionsExample />
      <DatabaseSimulationExample />
    </div>
  );
}
