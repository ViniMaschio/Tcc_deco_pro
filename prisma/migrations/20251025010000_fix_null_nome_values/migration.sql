-- Update NULL nome values before making the column required
UPDATE "Empresa" SET nome = 'Empresa Sem Nome' WHERE nome IS NULL;

-- Now make the nome column required
ALTER TABLE "Empresa" ALTER COLUMN "nome" SET NOT NULL;
