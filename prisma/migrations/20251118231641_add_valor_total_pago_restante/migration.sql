/*
  Warnings:

  - You are about to drop the column `parcela` on the `CaixaEntrada` table. All the data in the column will be lost.
  - You are about to drop the column `totalParcelas` on the `CaixaEntrada` table. All the data in the column will be lost.
  - You are about to drop the column `parcela` on the `CaixaSaida` table. All the data in the column will be lost.
  - You are about to drop the column `totalParcelas` on the `CaixaSaida` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaixaEntrada" DROP COLUMN "parcela",
DROP COLUMN "totalParcelas";

-- AlterTable
ALTER TABLE "CaixaSaida" DROP COLUMN "parcela",
DROP COLUMN "totalParcelas";

-- AlterTable
ALTER TABLE "ContaPagar" ADD COLUMN     "valor" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "valorTotal" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ContaReceber" ADD COLUMN     "valor" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "valorTotal" SET DEFAULT 0;
