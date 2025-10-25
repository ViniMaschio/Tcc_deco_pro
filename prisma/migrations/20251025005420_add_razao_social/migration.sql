/*
  Warnings:

  - Made the column `nome` on table `Empresa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "razaoSocial" TEXT,
ALTER COLUMN "nome" SET NOT NULL;
