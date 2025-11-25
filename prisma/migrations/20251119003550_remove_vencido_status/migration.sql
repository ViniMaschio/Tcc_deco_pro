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
-- Nota: Esta migration pode ser redundante se StatusTitulo_new já foi criado por migrations anteriores
-- Vamos verificar e criar apenas se necessário, ou usar o tipo existente
DO $$
BEGIN
  -- Se StatusTitulo_new já existe, não criar novamente
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new') THEN
    -- Verificar qual enum está sendo usado atualmente
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') THEN
      -- Criar StatusTitulo_new apenas se StatusTitulo existe
      CREATE TYPE "StatusTitulo_new" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');
    END IF;
  END IF;
END $$;

ALTER TABLE "public"."ContaPagar" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."ContaReceber" ALTER COLUMN "status" DROP DEFAULT;

-- Converter apenas se as colunas ainda não estão usando StatusTitulo_new
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ContaPagar' 
      AND column_name = 'status' 
      AND udt_name != 'StatusTitulo_new'
  ) THEN
    ALTER TABLE "ContaPagar" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING ("status"::text::"StatusTitulo_new");
  END IF;
  
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ContaReceber' 
      AND column_name = 'status' 
      AND udt_name != 'StatusTitulo_new'
  ) THEN
    ALTER TABLE "ContaReceber" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING ("status"::text::"StatusTitulo_new");
  END IF;
END $$;

-- Renomear apenas se StatusTitulo ainda existe e StatusTitulo_new também existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') THEN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new' AND typtype = 'e') THEN
      ALTER TYPE "StatusTitulo" RENAME TO "StatusTitulo_old";
      ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
      DROP TYPE IF EXISTS "public"."StatusTitulo_old";
    END IF;
  ELSIF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new' AND typtype = 'e') THEN
    -- Se StatusTitulo não existe mas StatusTitulo_new existe, apenas renomear
    ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
  END IF;
END $$;

ALTER TABLE "ContaPagar" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
ALTER TABLE "ContaReceber" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "ContaPagar" DROP COLUMN "valorPago",
DROP COLUMN "valorRestante",
DROP COLUMN "valorTotal";

-- AlterTable
ALTER TABLE "ContaReceber" DROP COLUMN "valorPago",
DROP COLUMN "valorRestante",
DROP COLUMN "valorTotal";
