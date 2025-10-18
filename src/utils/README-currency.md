# Funções de Manipulação de Valores Monetários

Este conjunto de utilitários foi criado para garantir precisão nos cálculos monetários trabalhando com **centavos (inteiros)** no banco de dados e convertendo para decimal apenas na exibição.

## 📁 Arquivos Criados

- `src/utils/currency.ts` - Funções utilitárias para manipulação de valores
- `src/hooks/use-currency.ts` - Hooks React para facilitar o uso
- `src/components/input/input-currency.tsx` - Componente de input para valores decimais
- `src/components/input/input-currency-cents.tsx` - Componente de input para valores em centavos
- `src/types/currency.ts` - Tipos TypeScript para valores monetários
- `src/examples/currency-usage.tsx` - Exemplos de uso com decimais
- `src/examples/currency-cents-usage.tsx` - Exemplos de uso com centavos

## 🚀 Como Usar

### 1. Funções Básicas para Centavos (Recomendado)

```typescript
import {
  formatCurrencyFromCents,
  decimalToCents,
  centsToDecimal,
  sumCents,
} from "@/utils/currency";

// Converter decimal para centavos
const cents = decimalToCents(123.45); // 12345

// Converter centavos para decimal
const decimal = centsToDecimal(12345); // 123.45

// Formatar centavos para exibição
const formatted = formatCurrencyFromCents(12345); // "R$ 123,45"

// Somar valores em centavos
const total = sumCents(10000, 5000, 2500); // 17500 centavos
```

### 2. Funções Básicas para Decimais

```typescript
import { formatCurrency, parseDecimalString, sumDecimals } from "@/utils/currency";

// Formatar valor para exibição
const formatted = formatCurrency(123.45); // "R$ 123,45"

// Converter string brasileira para número
const value = parseDecimalString("123,45"); // 123.45

// Somar valores com precisão
const total = sumDecimals(100, 50.5, 25.25); // 175.75
```

### 3. Hook useCurrencyCents (Recomendado)

```typescript
import { useCurrencyCents } from '@/hooks/use-currency';

function MyComponent() {
  const currency = useCurrencyCents(0); // 0 centavos

  return (
    <div>
      <InputCurrencyCents
        value={currency.centsValue}
        onChange={currency.updateCents}
        showCurrency={true}
      />
      <p>Valor formatado: {currency.getFormattedCurrency()}</p>
      <p>Valor em centavos: {currency.centsValue}</p>
    </div>
  );
}
```

### 4. Hook useCurrency (para decimais)

```typescript
import { useCurrency } from '@/hooks/use-currency';

function MyComponent() {
  const currency = useCurrency(0);

  return (
    <div>
      <InputCurrency
        value={currency.rawValue}
        onChange={currency.updateValue}
        showCurrency={true}
      />
      <p>Valor formatado: {currency.getFormattedCurrency()}</p>
    </div>
  );
}
```

### 3. Componente InputCurrency

```typescript
import { InputCurrency } from '@/components/input/input-currency';

function Form() {
  const [value, setValue] = useState(0);

  return (
    <InputCurrency
      value={value}
      onChange={setValue}
      showCurrency={true}
      placeholder="Digite o valor"
      allowNegative={false}
    />
  );
}
```

## 🔧 Funções Disponíveis

### Conversão de Valores

- `decimalToCents(value)` - Converte decimal para centavos
- `centsToDecimal(cents)` - Converte centavos para decimal
- `parseDecimalString(value)` - Converte string brasileira para decimal
- `parseCurrencyString(value)` - Converte string brasileira para centavos

### Formatação

- `formatCurrency(value)` - Formata como moeda brasileira
- `formatDecimal(value)` - Formata como número decimal brasileiro
- `formatForInput(value)` - Formata para input (remove formatação)
- `formatForInputBR(value)` - Formata para input brasileiro

### Cálculos

- `sumDecimals(...values)` - Soma valores com precisão
- `multiplyDecimals(value1, value2)` - Multiplica valores
- `divideDecimals(value1, value2)` - Divide valores
- `calculateDiscount(value, percent)` - Calcula desconto
- `applyDiscount(value, percent)` - Aplica desconto

### Validação

- `isValidDecimal(value)` - Valida se é um decimal válido
- `roundDecimal(value, decimals)` - Arredonda valor

## 🎯 Hooks Disponíveis

### useCurrency

Hook para manipulação de um único valor monetário:

```typescript
const currency = useCurrency(initialValue);

// Propriedades
currency.rawValue; // Valor numérico
currency.displayValue; // Valor formatado para exibição
currency.getFormattedCurrency(); // Valor como moeda
currency.getCents(); // Valor em centavos
currency.isValid(); // Se o valor é válido

// Métodos
currency.updateValue(value); // Atualiza valor
currency.updateFromFormattedString(str); // Atualiza de string formatada
currency.addToValue(...values); // Adiciona valores
currency.multiplyValue(multiplier); // Multiplica valor
currency.applyDiscountToValue(percent); // Aplica desconto
```

### useMultipleCurrency

Hook para manipulação de múltiplos valores:

```typescript
const multiple = useMultipleCurrency();

// Métodos
multiple.setValue(key, value); // Define valor para uma chave
multiple.getValue(key); // Obtém valor de uma chave
multiple.getTotal(); // Soma todos os valores
multiple.getTotalFormatted(); // Total formatado
```

## 🎨 Componentes

### InputCurrency

Componente de input especializado para valores monetários:

```typescript
<InputCurrency
  value={value}
  onChange={setValue}
  showCurrency={true}        // Mostra símbolo R$
  allowNegative={false}      // Permite valores negativos
  precision={2}              // Casas decimais
  placeholder="0,00"
/>
```

### CurrencyDisplay

Componente para exibição de valores (somente leitura):

```typescript
<CurrencyDisplay
  value={123.45}
  showCurrency={true}
/>
```

## 📋 Exemplos Práticos

### Formulário de Item com Centavos (Implementado)

```typescript
// Modal de cadastro de item usando InputCurrencyCents
function ItemModal() {
  const form = useForm({
    defaultValues: {
      nome: "",
      precoBase: 0, // Valor em centavos
    }
  });

  const onSubmit = (values) => {
    // Converter centavos para decimal para envio à API
    const dataToSend = {
      ...values,
      precoBase: centsToDecimal(values.precoBase),
    };

    // Enviar para API...
  };

  return (
    <FormField
      control={form.control}
      name="precoBase"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preço Base</FormLabel>
          <FormControl>
            <InputCurrencyCents
              value={field.value}
              onChange={field.onChange}
              showCurrency={true}
              placeholder="0,00"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
```

### Formulário de Orçamento

```typescript
function OrcamentoForm() {
  const [items, setItems] = useState([]);
  const [desconto, setDesconto] = useState(0);

  const subtotal = sumDecimals(...items.map(item => item.valor));
  const descontoValue = calculateDiscount(subtotal, desconto);
  const total = subtotal - descontoValue;

  return (
    <div>
      {/* Campos dos itens */}
      <InputCurrency
        value={desconto}
        onChange={setDesconto}
        placeholder="Desconto (%)"
      />

      <div>
        <p>Subtotal: {formatCurrency(subtotal)}</p>
        <p>Desconto: {formatCurrency(descontoValue)}</p>
        <p>Total: {formatCurrency(total)}</p>
      </div>
    </div>
  );
}
```

### Cálculo de Parcelas

```typescript
function ParcelasCalculator() {
  const [valor, setValor] = useState(0);
  const [parcelas, setParcelas] = useState(1);

  const valorParcela = divideDecimals(valor, parcelas);

  return (
    <div>
      <InputCurrency
        value={valor}
        onChange={setValor}
        placeholder="Valor total"
      />
      <input
        type="number"
        value={parcelas}
        onChange={(e) => setParcelas(Number(e.target.value))}
        placeholder="Número de parcelas"
      />
      <p>Valor da parcela: {formatCurrency(valorParcela)}</p>
    </div>
  );
}
```

## ⚠️ Importante

1. **Sempre use as funções fornecidas** para cálculos monetários
2. **Nunca use operações matemáticas diretas** com valores monetários
3. **Use os hooks** para componentes React que manipulam valores
4. **Valide sempre** os valores antes de usar em cálculos
5. **Use o componente InputCurrency** para inputs de valores monetários

## 🔄 Migração

Para migrar código existente:

1. Substitua `parseFloat()` por `parseDecimalString()`
2. Substitua formatação manual por `formatCurrency()`
3. Substitua operações matemáticas por funções do utilitário
4. Use `InputCurrency` em vez de inputs normais para valores monetários
5. Use os hooks para gerenciar estado de valores monetários
