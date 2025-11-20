/*
  Warnings:

  - You are about to drop the column `clienteId` on the `ContaReceber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ContaReceber" DROP CONSTRAINT "ContaReceber_clienteId_fkey";

-- AlterTable
ALTER TABLE "ContaReceber" DROP COLUMN "clienteId";
