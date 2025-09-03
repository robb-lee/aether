-- Make user_id nullable in tables for development without authentication
-- This allows creating sites and other records without being logged in

-- Sites table
ALTER TABLE public.sites 
ALTER COLUMN user_id DROP NOT NULL;

-- AI generations table  
ALTER TABLE public.ai_generations
ALTER COLUMN user_id DROP NOT NULL;

-- Deployments table
ALTER TABLE public.deployments
ALTER COLUMN user_id DROP NOT NULL;

-- Component selections table
ALTER TABLE public.component_selections
ALTER COLUMN user_id DROP NOT NULL;

-- Site backups table
ALTER TABLE public.site_backups
ALTER COLUMN user_id DROP NOT NULL;

-- Assets table
ALTER TABLE public.assets
ALTER COLUMN user_id DROP NOT NULL;

-- Verify changes
SELECT 
    table_name,
    column_name,
    is_nullable,
    data_type
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND column_name = 'user_id'
ORDER BY 
    table_name;