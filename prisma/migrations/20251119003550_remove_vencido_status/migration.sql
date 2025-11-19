/*
  Warnings:

  - The values [PARCIAL,VENCIDO] on the enum `StatusTitulo` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `valorPago` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `valorRestante` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `valorPago` on the `ContaReceber` table. All the data in the column will be lost.
  - You are about to drop the column `valorRestante` on the `ContaReceber` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `ContaReceber` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusTitulo_new" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');
ALTER TABLE "public"."ContaPagar" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."ContaReceber" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ContaPagar" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING ("status"::text::"StatusTitulo_new");
ALTER TABLE "ContaReceber" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING ("status"::text::"StatusTitulo_new");
ALTER TYPE "StatusTitulo" RENAME TO "StatusTitulo_old";
ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
DROP TYPE "public"."StatusTitulo_old";
ALTER TABLE "ContaPagar" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
ALTER TABLE "ContaReceber" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
COMMIT;

-- AlterTable
ALTER TABLE "ContaPagar" DROP COLUMN "valorPago",
DROP COLUMN "valorRestante",
DROP COLUMN "valorTotal";

-- AlterTable
ALTER TABLE "ContaReceber" DROP COLUMN "valorPago",
DROP COLUMN "valorRestante",
DROP COLUMN "valorTotal";
