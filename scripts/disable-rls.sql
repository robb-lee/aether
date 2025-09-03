-- Aether Database - Disable RLS for Development
-- This script disables Row Level Security on all tables for development purposes
-- Run this in Supabase SQL Editor to allow unrestricted access during development

-- Disable RLS on all tables
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.components DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_selections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_backups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;