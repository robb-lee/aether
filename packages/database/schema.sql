-- Aether Database Schema
-- PostgreSQL/Supabase database schema for AI-powered website builder

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Functions and triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate AI usage cost
CREATE OR REPLACE FUNCTION calculate_ai_cost(
  p_model TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  v_cost DECIMAL;
BEGIN
  CASE p_model
    WHEN 'gpt-4-turbo' THEN
      v_cost := (p_input_tokens * 0.01 + p_output_tokens * 0.03) / 1000;
    WHEN 'claude-3-haiku' THEN
      v_cost := (p_input_tokens * 0.00025 + p_output_tokens * 0.00125) / 1000;
    WHEN 'dalle-3' THEN
      v_cost := 0.04; -- Per image
    ELSE
      v_cost := 0;
  END CASE;
  
  RETURN v_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_user_id UUID,
  p_resource TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_current_usage INTEGER;
  v_limit INTEGER;
BEGIN
  SELECT subscription_tier INTO v_tier
  FROM users WHERE id = p_user_id;
  
  CASE p_resource
    WHEN 'sites' THEN
      SELECT COUNT(*) INTO v_current_usage
      FROM sites WHERE user_id = p_user_id;
      
      SELECT max_sites_allowed INTO v_limit
      FROM users WHERE id = p_user_id;
      
    WHEN 'ai_credits' THEN
      SELECT ai_credits_used INTO v_current_usage
      FROM users WHERE id = p_user_id;
      
      SELECT monthly_ai_credits INTO v_limit
      FROM users WHERE id = p_user_id;
  END CASE;
  
  RETURN v_current_usage < v_limit OR v_limit = -1; -- -1 means unlimited
END;
$$ LANGUAGE plpgsql;

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'business')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
    monthly_ai_credits INTEGER DEFAULT 10,
    ai_credits_used INTEGER DEFAULT 0,
    total_sites_created INTEGER DEFAULT 0,
    max_sites_allowed INTEGER DEFAULT 3,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Templates table (moved before sites to avoid FK reference error)
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('saas', 'portfolio', 'ecommerce', 'blog', 'restaurant', 'landing', 'other')),
    
    -- Template structure
    structure JSONB NOT NULL,
    default_content JSONB,
    theme_presets JSONB,
    
    -- AI generation hints
    ai_prompts JSONB DEFAULT '{
        "structure": "",
        "content": "",
        "style": ""
    }',
    
    -- Metadata
    description TEXT,
    preview_image_url TEXT,
    demo_url TEXT,
    tags TEXT[],
    features TEXT[],
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,
    
    -- Pricing (for marketplace)
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    
    -- Creator info
    created_by UUID REFERENCES public.users(id),
    is_official BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    template_id UUID REFERENCES public.templates(id),
    
    -- Component tree stored as JSONB for flexibility
    components JSONB NOT NULL DEFAULT '{"root": {"type": "page", "children": []}}',
    
    -- Theme and styling
    theme JSONB DEFAULT '{
        "colors": {
            "primary": "#0070f3",
            "secondary": "#000",
            "background": "#fff"
        },
        "fonts": {
            "heading": "Inter",
            "body": "Inter"
        }
    }',
    
    -- SEO metadata
    seo_metadata JSONB DEFAULT '{
        "title": "",
        "description": "",
        "keywords": [],
        "ogImage": ""
    }',
    
    -- Deployment information
    deployment_url TEXT,
    preview_url TEXT,
    custom_domain TEXT,
    last_deployed_at TIMESTAMPTZ,
    deployment_status TEXT CHECK (deployment_status IN ('pending', 'building', 'ready', 'error')),
    
    -- Analytics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    
    -- Version control
    version INTEGER DEFAULT 1,
    published_version INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Components table (for reusable components)
CREATE TABLE IF NOT EXISTS public.components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('section', 'element', 'widget', 'layout')),
    category TEXT,
    
    -- Component definition
    definition JSONB NOT NULL,
    props_schema JSONB,
    default_props JSONB,
    
    -- Component Registry fields
    registry_id TEXT UNIQUE, -- For Component Registry system
    variant TEXT, -- Component variant (e.g., 'centered', 'split')
    registry_metadata JSONB DEFAULT '{
        "category": "",
        "keywords": [],
        "performance": {
            "renderTime": 0,
            "bundleSize": 0,
            "lighthouseScore": 0
        },
        "compatibility": {
            "browsers": ["chrome", "firefox", "safari", "edge"],
            "responsive": true,
            "accessibility": "WCAG-AA"
        },
        "aiHints": {
            "bestFor": [],
            "avoidFor": [],
            "commonProps": {}
        }
    }',
    
    -- Metadata
    description TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    is_ai_generated BOOLEAN DEFAULT false,
    is_registry_component BOOLEAN DEFAULT false, -- Component Registry 컴포넌트 구분
    usage_count INTEGER DEFAULT 0,
    
    -- Performance metrics
    avg_render_time_ms INTEGER DEFAULT 0,
    lighthouse_score INTEGER DEFAULT 0,
    accessibility_score INTEGER DEFAULT 0,
    
    -- Versioning
    version TEXT DEFAULT '1.0.0',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Component selections table
CREATE TABLE IF NOT EXISTS public.component_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Selection details
    selection_reason TEXT,
    business_context JSONB,
    user_prompt TEXT,
    
    -- AI details
    model_used TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    selection_confidence DECIMAL(3,2) DEFAULT 0.0,
    
    -- Generated props
    props_generated JSONB NOT NULL,
    props_token_count INTEGER DEFAULT 0,
    
    -- Performance tracking
    render_success BOOLEAN DEFAULT true,
    render_time_ms INTEGER,
    user_satisfaction_score INTEGER, -- 1-5 rating
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Deployment details
    deployment_id TEXT UNIQUE, -- Vercel deployment ID
    deployment_url TEXT,
    preview_url TEXT,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'ready', 'error', 'cancelled')),
    error_message TEXT,
    
    -- Build information
    build_time_seconds INTEGER,
    bundle_size_bytes BIGINT,
    
    -- Environment
    environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'preview', 'production')),
    branch TEXT,
    commit_sha TEXT,
    commit_message TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- AI Generations table (for caching and history)
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    
    -- Generation details
    generation_type TEXT NOT NULL CHECK (generation_type IN ('site', 'component', 'content', 'image', 'optimization')),
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    
    -- Model information
    model TEXT NOT NULL,
    model_version TEXT,
    
    -- Token usage and costs
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    estimated_cost DECIMAL(10,4),
    
    -- Results
    result JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    
    -- Performance metrics
    duration_ms INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Stripe integration
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_price_id TEXT,
    
    -- Subscription details
    plan TEXT NOT NULL CHECK (plan IN ('free', 'starter', 'pro', 'business')),
    status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'cancelled', 'incomplete', 'past_due')),
    
    -- Billing
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Usage limits
    monthly_ai_generations INTEGER,
    max_sites INTEGER,
    max_custom_domains INTEGER,
    max_team_members INTEGER,
    
    -- Features
    features JSONB DEFAULT '{
        "ai_component_generator": false,
        "custom_domains": false,
        "team_collaboration": false,
        "api_access": false,
        "white_label": false,
        "priority_support": false
    }',
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site versions table
CREATE TABLE IF NOT EXISTS public.site_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    components JSONB NOT NULL,
    theme JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, version_number)
);

-- Custom domains table
CREATE TABLE IF NOT EXISTS public.custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    domain TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'active', 'error')),
    ssl_status TEXT CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'error')),
    verification_token TEXT,
    dns_records JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- Site backups table
CREATE TABLE IF NOT EXISTS public.site_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    backup_type TEXT DEFAULT 'manual' CHECK (backup_type IN ('manual', 'auto', 'pre_deploy')),
    backup_data JSONB NOT NULL,
    version INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN (
        'user.login', 'user.logout', 'user.signup',
        'site.create', 'site.update', 'site.delete', 'site.publish',
        'deployment.create', 'deployment.complete', 'deployment.fail',
        'subscription.create', 'subscription.update', 'subscription.cancel',
        'ai.generate', 'ai.component_create'
    )),
    resource_type TEXT,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT NOT NULL, -- First 8 chars for identification
    permissions JSONB DEFAULT '{"read": true, "write": false, "deploy": false}',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Assets table (for uploaded images, fonts, etc.)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    page_path TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_stripe_customer ON public.users(stripe_customer_id);

-- Sites indexes
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_sites_slug ON public.sites(slug);
CREATE INDEX idx_sites_status ON public.sites(status);
CREATE INDEX idx_sites_template_id ON public.sites(template_id);
CREATE INDEX idx_sites_components_gin ON public.sites USING GIN(components);
CREATE INDEX idx_sites_slug_published ON public.sites(slug) WHERE status = 'published';
CREATE INDEX idx_sites_components_root ON public.sites ((components->'root'->>'type'));
CREATE INDEX idx_sites_components_search ON public.sites USING GIN (components jsonb_path_ops);

-- Components indexes
CREATE INDEX idx_components_user_id ON public.components(user_id);
CREATE INDEX idx_components_site_id ON public.components(site_id);
CREATE INDEX idx_components_type ON public.components(type);
CREATE INDEX idx_components_category ON public.components(category);
CREATE INDEX idx_components_is_public ON public.components(is_public);
CREATE INDEX idx_components_tags_gin ON public.components USING GIN(tags);
CREATE INDEX idx_components_registry_id ON public.components(registry_id);
CREATE INDEX idx_components_variant ON public.components(variant);
CREATE INDEX idx_components_is_registry ON public.components(is_registry_component);
CREATE INDEX idx_components_registry_metadata_gin ON public.components USING GIN(registry_metadata);
CREATE INDEX idx_components_performance ON public.components(lighthouse_score DESC, accessibility_score DESC);

-- Component selections indexes
CREATE INDEX idx_component_selections_site_id ON public.component_selections(site_id);
CREATE INDEX idx_component_selections_component_id ON public.component_selections(component_id);
CREATE INDEX idx_component_selections_user_id ON public.component_selections(user_id);
CREATE INDEX idx_component_selections_model ON public.component_selections(model_used);
CREATE INDEX idx_component_selections_created_at ON public.component_selections(created_at DESC);

-- Templates indexes
CREATE INDEX idx_templates_slug ON public.templates(slug);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_premium ON public.templates(is_premium);
CREATE INDEX idx_templates_tags_gin ON public.templates USING GIN(tags);
CREATE INDEX idx_templates_created_by ON public.templates(created_by);
-- Full text search index (removed due to IMMUTABLE function requirement)
-- CREATE INDEX idx_templates_search ON public.templates USING GIN(
--     to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' '))
-- );

-- Deployments indexes
CREATE INDEX idx_deployments_site_id ON public.deployments(site_id);
CREATE INDEX idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);
CREATE INDEX idx_deployments_deployment_id ON public.deployments(deployment_id);
CREATE INDEX idx_deployments_created_at ON public.deployments(created_at DESC);
CREATE INDEX idx_deployments_site_date ON public.deployments(site_id, created_at DESC);

-- AI generations indexes
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_site_id ON public.ai_generations(site_id);
CREATE INDEX idx_ai_generations_generation_type ON public.ai_generations(generation_type);
CREATE INDEX idx_ai_generations_created_at ON public.ai_generations(created_at DESC);
CREATE INDEX idx_ai_generations_model ON public.ai_generations(model);
CREATE INDEX idx_ai_generations_user_date ON public.ai_generations(user_id, created_at DESC);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON public.subscriptions(plan);

-- Site versions indexes
CREATE INDEX idx_site_versions_site_id ON public.site_versions(site_id);
CREATE INDEX idx_site_versions_created_at ON public.site_versions(created_at DESC);

-- Custom domains indexes
CREATE INDEX idx_custom_domains_site_id ON public.custom_domains(site_id);
CREATE INDEX idx_custom_domains_domain ON public.custom_domains(domain);
CREATE INDEX idx_custom_domains_status ON public.custom_domains(status);

-- Site backups indexes
CREATE INDEX idx_site_backups_site_id ON public.site_backups(site_id);
CREATE INDEX idx_site_backups_user_id ON public.site_backups(user_id);
CREATE INDEX idx_site_backups_created_at ON public.site_backups(created_at DESC);
CREATE INDEX idx_site_backups_expires_at ON public.site_backups(expires_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON public.audit_logs(severity);

-- API keys indexes
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON public.api_keys(key_prefix);

-- Assets indexes
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_site_id ON public.assets(site_id);

-- Analytics events indexes
CREATE INDEX idx_analytics_events_site_id ON public.analytics_events(site_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sites" ON public.sites
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (SELECT COUNT(*) FROM sites WHERE user_id = auth.uid()) < 
        (SELECT max_sites_allowed FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Published sites are publicly viewable" ON public.sites
    FOR SELECT USING (status = 'published');

-- Components policies
CREATE POLICY "Users can view own components" ON public.components
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create components" ON public.components
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own components" ON public.components
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own components" ON public.components
    FOR DELETE USING (auth.uid() = user_id);

-- Component Registry policies
CREATE POLICY "Registry components are publicly readable" ON public.components
    FOR SELECT USING (is_registry_component = true);

-- Component selections policies
CREATE POLICY "Users can view own component selections" ON public.component_selections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create component selections" ON public.component_selections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Templates are publicly viewable" ON public.templates
    FOR SELECT USING (true);

CREATE POLICY "Only admins can create official templates" ON public.templates
    FOR INSERT WITH CHECK (
        (is_official = false AND auth.uid() = created_by) OR
        (SELECT subscription_tier FROM users WHERE id = auth.uid()) = 'business'
    );

-- Deployments policies
CREATE POLICY "Users can view own deployments" ON public.deployments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deployments" ON public.deployments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Generations policies
CREATE POLICY "Users can view own AI generations" ON public.ai_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI generations" ON public.ai_generations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        (SELECT ai_credits_used FROM users WHERE id = auth.uid()) < 
        (SELECT monthly_ai_credits FROM users WHERE id = auth.uid())
    );

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Site versions policies
CREATE POLICY "Users can view own site versions" ON public.site_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sites 
            WHERE id = site_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create site versions" ON public.site_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sites 
            WHERE id = site_id AND user_id = auth.uid()
        )
    );

-- Custom domains policies
CREATE POLICY "Users can view own domains" ON public.custom_domains
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sites 
            WHERE id = site_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create domains for own sites" ON public.custom_domains
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sites 
            WHERE id = site_id AND user_id = auth.uid()
        )
    );

-- Site backups policies
CREATE POLICY "Users can view own backups" ON public.site_backups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create backups for own sites" ON public.site_backups
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM sites WHERE id = site_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete own backups" ON public.site_backups
    FOR DELETE USING (auth.uid() = user_id);

-- Audit logs policies (admin only)
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'business'
        )
    );

-- API keys policies
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets" ON public.assets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets" ON public.assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON public.assets
    FOR DELETE USING (auth.uid() = user_id);

-- Analytics events policies (write-only for public, read for site owners)
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Site owners can view analytics" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites
            WHERE sites.id = analytics_events.site_id
            AND sites.user_id = auth.uid()
        )
    );

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON public.sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at 
    BEFORE UPDATE ON public.deployments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at 
    BEFORE UPDATE ON public.components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create materialized views for analytics

-- User engagement metrics
CREATE MATERIALIZED VIEW user_engagement_metrics AS
SELECT 
  u.id,
  u.subscription_tier,
  COUNT(DISTINCT s.id) as total_sites,
  COUNT(DISTINCT d.id) as total_deployments,
  COUNT(DISTINCT ag.id) as total_ai_generations,
  SUM(ag.estimated_cost) as total_ai_cost,
  MAX(s.created_at) as last_site_created,
  MAX(d.created_at) as last_deployment
FROM users u
LEFT JOIN sites s ON u.id = s.user_id
LEFT JOIN deployments d ON u.id = d.user_id
LEFT JOIN ai_generations ag ON u.id = ag.user_id
GROUP BY u.id, u.subscription_tier;

-- Platform usage statistics
CREATE MATERIALIZED VIEW platform_statistics AS
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT u.id) FILTER (WHERE u.subscription_tier != 'free') as paid_users,
  COUNT(DISTINCT s.id) as total_sites,
  COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'published') as published_sites,
  COUNT(DISTINCT d.id) as total_deployments,
  COUNT(DISTINCT ag.id) as total_ai_generations,
  SUM(ag.estimated_cost) as total_ai_cost,
  AVG(ag.duration_ms) as avg_generation_time
FROM users u
LEFT JOIN sites s ON u.id = s.user_id
LEFT JOIN deployments d ON s.id = d.site_id
LEFT JOIN ai_generations ag ON u.id = ag.user_id;