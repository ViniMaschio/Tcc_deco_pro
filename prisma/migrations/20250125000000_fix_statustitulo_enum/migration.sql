-- Migração para corrigir o problema do StatusTitulo_new que não foi renomeado
-- Este script garante que o tipo enum está correto no banco de dados

-- 1. Verificar e corrigir se StatusTitulo_new existe mas StatusTitulo não existe ou está incorreto
DO $$
BEGIN
  -- Se StatusTitulo_new existe e as colunas estão usando ele
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new') THEN
    -- Verificar se as colunas estão usando StatusTitulo_new
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name IN ('ContaPagar', 'ContaReceber') 
        AND column_name = 'status' 
        AND udt_name = 'StatusTitulo_new'
    ) THEN
      -- Se StatusTitulo também existe, precisamos lidar com isso
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') THEN
        -- Verificar se StatusTitulo está sendo usado
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE udt_name = 'StatusTitulo'
        ) THEN
          -- Ambos existem e estão sendo usados - isso é um problema
          -- Primeiro, alterar as colunas que usam StatusTitulo_new para usar StatusTitulo
          -- Mas isso requer alterar o tipo da coluna, então vamos renomear o tipo
          -- Remover StatusTitulo_new após renomear as colunas
          RAISE NOTICE 'Ambos os tipos existem. Removendo StatusTitulo_new...';
          DROP TYPE IF EXISTS "StatusTitulo_new";
        ELSE
          -- StatusTitulo existe mas não está sendo usado, podemos removê-lo
          DROP TYPE IF EXISTS "StatusTitulo";
          -- Renomear StatusTitulo_new para StatusTitulo
          ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
          RAISE NOTICE 'StatusTitulo_new renomeado para StatusTitulo';
        END IF;
      ELSE
        -- StatusTitulo não existe, apenas renomear StatusTitulo_new
        ALTER TYPE "StatusTitulo_new" RENAME TO "StatusTitulo";
        RAISE NOTICE 'StatusTitulo_new renomeado para StatusTitulo';
      END IF;
      
      -- Remover StatusTitulo_old se existir
      DROP TYPE IF EXISTS "StatusTitulo_old";
    ELSE
      -- StatusTitulo_new existe mas não está sendo usado, podemos removê-lo
      DROP TYPE IF EXISTS "StatusTitulo_new";
      RAISE NOTICE 'StatusTitulo_new removido (não estava em uso)';
    END IF;
  END IF;
  
  -- Remover StatusTitulo_old se ainda existir
  DROP TYPE IF EXISTS "StatusTitulo_old";
  
END $$;

-- 2. Verificar o estado final
DO $$
DECLARE
  tipo_existe boolean;
  tipo_new_existe boolean;
  colunas_corretas boolean;
BEGIN
  -- Verificar se o tipo StatusTitulo existe
  SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo' AND typtype = 'e') INTO tipo_existe;
  
  -- Verificar se StatusTitulo_new ainda existe
  SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statustitulo_new' AND typtype = 'e') INTO tipo_new_existe;
  
  -- Verificar se as colunas estão usando StatusTitulo (não StatusTitulo_new)
  SELECT NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name IN ('ContaPagar', 'ContaReceber') 
      AND column_name = 'status' 
      AND udt_name = 'StatusTitulo_new'
  ) INTO colunas_corretas;
  
  IF tipo_existe AND NOT tipo_new_existe AND colunas_corretas THEN
    RAISE NOTICE 'Correção concluída com sucesso!';
  ELSE
    RAISE WARNING 'Estado: tipo_existe: %, tipo_new_existe: %, colunas_corretas: %', tipo_existe, tipo_new_existe, colunas_corretas;
  END IF;
END $$;

