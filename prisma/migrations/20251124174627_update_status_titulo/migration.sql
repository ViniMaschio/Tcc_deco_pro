/*
  Warnings:

  - The values [PAGO,CANCELADO] on the enum `StatusTitulo` will be removed. If these variants are still used in the database, this will fail.

*/
-- Step 1: Create new enum type (check if exists first)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new') THEN
    CREATE TYPE "StatusTitulo_new" AS ENUM ('PENDENTE', 'FINALIZADO');
  END IF;
END $$;

-- Step 2: Drop defaults
ALTER TABLE "public"."ContaPagar" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."ContaReceber" ALTER COLUMN "status" DROP DEFAULT;

-- Step 3: Convert existing data and alter columns
ALTER TABLE "ContaPagar" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING (
  CASE 
    WHEN "status"::text = 'PAGO' THEN 'FINALIZADO'::"StatusTitulo_new"
    WHEN "status"::text = 'CANCELADO' THEN 'PENDENTE'::"StatusTitulo_new"
    WHEN "status"::text = 'PENDENTE' THEN 'PENDENTE'::"StatusTitulo_new"
    ELSE 'PENDENTE'::"StatusTitulo_new"
  END
);

ALTER TABLE "ContaReceber" ALTER COLUMN "status" TYPE "StatusTitulo_new" USING (
  CASE 
    WHEN "status"::text = 'PAGO' THEN 'FINALIZADO'::"StatusTitulo_new"
    WHEN "status"::text = 'CANCELADO' THEN 'PENDENTE'::"StatusTitulo_new"
    WHEN "status"::text = 'PENDENTE' THEN 'PENDENTE'::"StatusTitulo_new"
    ELSE 'PENDENTE'::"StatusTitulo_new"
  END
);

-- Step 4: Replace old enum with new one
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo') THEN
    ALTER TYPE "StatusTitulo" RENAME TO "StatusTitulo_old";
    ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
    DROP TYPE IF EXISTS "public"."StatusTitulo_old";
  END IF;
END $$;

-- Step 5: Restore defaults
ALTER TABLE "ContaPagar" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
ALTER TABLE "ContaReceber" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
