/*
  Warnings:

  - You are about to alter the column `valor` on the `CaixaEntrada` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valor` on the `CaixaSaida` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorPago` on the `ContaPagar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorTotal` on the `ContaPagar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorRestante` on the `ContaPagar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorPago` on the `ContaReceber` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorTotal` on the `ContaReceber` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `valorRestante` on the `ContaReceber` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `desconto` on the `Contrato` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `total` on the `Contrato` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantidade` on the `ContratoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `desconto` on the `ContratoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `valorUnit` on the `ContratoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `valorTotal` on the `ContratoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `precoBase` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `desconto` on the `Orcamento` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `total` on the `Orcamento` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `quantidade` on the `OrcamentoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,3)` to `Integer`.
  - You are about to alter the column `desconto` on the `OrcamentoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `valorUnit` on the `OrcamentoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Integer`.
  - You are about to alter the column `valorTotal` on the `OrcamentoItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."CaixaEntrada" ALTER COLUMN "valor" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."CaixaSaida" ALTER COLUMN "valor" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."ContaPagar" ALTER COLUMN "valorPago" SET DEFAULT 0,
ALTER COLUMN "valorPago" SET DATA TYPE INTEGER,
ALTER COLUMN "valorTotal" SET DATA TYPE INTEGER,
ALTER COLUMN "valorRestante" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."ContaReceber" ALTER COLUMN "valorPago" SET DEFAULT 0,
ALTER COLUMN "valorPago" SET DATA TYPE INTEGER,
ALTER COLUMN "valorTotal" SET DATA TYPE INTEGER,
ALTER COLUMN "valorRestante" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Contrato" ALTER COLUMN "desconto" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."ContratoItem" ALTER COLUMN "quantidade" SET DATA TYPE INTEGER,
ALTER COLUMN "desconto" SET DATA TYPE INTEGER,
ALTER COLUMN "valorUnit" SET DATA TYPE INTEGER,
ALTER COLUMN "valorTotal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Item" ALTER COLUMN "precoBase" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Orcamento" ALTER COLUMN "desconto" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."OrcamentoItem" ALTER COLUMN "quantidade" SET DATA TYPE INTEGER,
ALTER COLUMN "desconto" SET DATA TYPE INTEGER,
ALTER COLUMN "valorUnit" SET DATA TYPE INTEGER,
ALTER COLUMN "valorTotal" SET DATA TYPE INTEGER;
