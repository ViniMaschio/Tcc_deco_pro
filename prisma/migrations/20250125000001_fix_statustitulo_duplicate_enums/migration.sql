-- Migração para corrigir os enums duplicados StatusTitulo e StatusTitulo_new
-- Este script garante que existe apenas um enum StatusTitulo com os valores corretos

-- 1. Verificar e corrigir qual tipo as colunas estão usando
DO $$
DECLARE
  coluna_usa_new boolean;
  coluna_usa_old boolean;
BEGIN
  -- Verificar qual tipo as colunas estão usando
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name IN ('ContaPagar', 'ContaReceber') 
      AND column_name = 'status' 
      AND udt_name = 'StatusTitulo_new'
  ) INTO coluna_usa_new;
  
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name IN ('ContaPagar', 'ContaReceber') 
      AND column_name = 'status' 
      AND udt_name = 'StatusTitulo'
  ) INTO coluna_usa_old;
  
  -- Se as colunas estão usando StatusTitulo (antigo com PAGO, CANCELADO)
  IF coluna_usa_old THEN
    -- Verificar se StatusTitulo_new existe
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new' AND typtype = 'e') THEN
      -- Converter os dados das colunas para StatusTitulo_new
      ALTER TABLE "ContaPagar" ALTER COLUMN "status" DROP DEFAULT;
      ALTER TABLE "ContaReceber" ALTER COLUMN "status" DROP DEFAULT;
      
      ALTER TABLE "ContaPagar" ALTER COLUMN "status" TYPE "StatusTitulo_new" 
        USING (
          CASE 
            WHEN "status"::text = 'PAGO' THEN 'FINALIZADO'::"StatusTitulo_new"
            WHEN "status"::text = 'CANCELADO' THEN 'PENDENTE'::"StatusTitulo_new"
            WHEN "status"::text = 'PENDENTE' THEN 'PENDENTE'::"StatusTitulo_new"
            ELSE 'PENDENTE'::"StatusTitulo_new"
          END
        );
      
      ALTER TABLE "ContaReceber" ALTER COLUMN "status" TYPE "StatusTitulo_new" 
        USING (
          CASE 
            WHEN "status"::text = 'PAGO' THEN 'FINALIZADO'::"StatusTitulo_new"
            WHEN "status"::text = 'CANCELADO' THEN 'PENDENTE'::"StatusTitulo_new"
            WHEN "status"::text = 'PENDENTE' THEN 'PENDENTE'::"StatusTitulo_new"
            ELSE 'PENDENTE'::"StatusTitulo_new"
          END
        );
      
      ALTER TABLE "ContaPagar" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
      ALTER TABLE "ContaReceber" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
    END IF;
    
    -- Remover o StatusTitulo antigo (com PAGO, CANCELADO) se não estiver mais sendo usado
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') THEN
      IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE udt_name = 'StatusTitulo'
      ) THEN
        DROP TYPE "StatusTitulo";
      END IF;
    END IF;
  END IF;
  
  -- Se as colunas estão usando StatusTitulo_new OU se acabamos de converter para ele
  IF coluna_usa_new OR (coluna_usa_old AND EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new')) THEN
    -- Renomear StatusTitulo_new para StatusTitulo
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new' AND typtype = 'e') THEN
      -- Verificar se StatusTitulo ainda existe (não deveria)
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') THEN
        -- Se ainda existe, verificar se está sendo usado
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE udt_name = 'StatusTitulo'
        ) THEN
          DROP TYPE "StatusTitulo";
        END IF;
      END IF;
      
      -- Renomear StatusTitulo_new para StatusTitulo
      ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
    END IF;
  END IF;
  
  -- Remover StatusTitulo_old se existir
  DROP TYPE IF EXISTS "StatusTitulo_old";
  
END $$;

