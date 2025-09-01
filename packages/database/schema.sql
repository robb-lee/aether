-- Aether Database Schema
-- PostgreSQL/Supabase database schema for AI-powered website builder

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise')),
    credits_remaining INTEGER DEFAULT 10,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    domain TEXT UNIQUE,
    subdomain TEXT UNIQUE,
    component_tree JSONB NOT NULL DEFAULT '{}',
    theme JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    template_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    preview_image TEXT,
    component_tree JSONB NOT NULL,
    theme JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generations table (for caching and history)
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    prompt_type TEXT NOT NULL CHECK (prompt_type IN ('structure', 'content', 'design', 'image')),
    model TEXT NOT NULL,
    response JSONB NOT NULL,
    tokens_used INTEGER,
    cost_cents INTEGER,
    duration_ms INTEGER,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    deployment_id TEXT UNIQUE, -- Vercel deployment ID
    url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'building', 'ready', 'error', 'cancelled')),
    environment TEXT NOT NULL CHECK (environment IN ('production', 'preview', 'development')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Components table (for reusable components)
CREATE TABLE IF NOT EXISTS public.components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    props JSONB DEFAULT '{}',
    children JSONB DEFAULT '[]',
    is_global BOOLEAN DEFAULT false,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table (for uploaded images, fonts, etc.)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking table (for AI cost and quota management)
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    cost_cents INTEGER NOT NULL DEFAULT 0,
    request_type TEXT NOT NULL CHECK (request_type IN ('generation', 'image', 'streaming', 'analysis')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_sites_slug ON public.sites(slug);
CREATE INDEX idx_sites_subdomain ON public.sites(subdomain);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_slug ON public.templates(slug);
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_site_id ON public.ai_generations(site_id);
CREATE INDEX idx_deployments_site_id ON public.deployments(site_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);
CREATE INDEX idx_components_user_id ON public.components(user_id);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_site_id ON public.assets(site_id);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_model ON public.usage_tracking(model);
CREATE INDEX idx_usage_tracking_created_at ON public.usage_tracking(created_at);
CREATE INDEX idx_analytics_events_site_id ON public.analytics_events(site_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON public.sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Published sites are publicly viewable" ON public.sites
    FOR SELECT USING (is_published = true);

-- Templates policies
CREATE POLICY "Templates are publicly viewable" ON public.templates
    FOR SELECT USING (true);

CREATE POLICY "Users can create templates" ON public.templates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON public.templates
    FOR UPDATE USING (auth.uid() = created_by);

-- AI Generations policies
CREATE POLICY "Users can view own AI generations" ON public.ai_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI generations" ON public.ai_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deployments policies
CREATE POLICY "Users can view own deployments" ON public.deployments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deployments" ON public.deployments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deployments" ON public.deployments
    FOR UPDATE USING (auth.uid() = user_id);

-- Components policies
CREATE POLICY "Users can view own components" ON public.components
    FOR SELECT USING (auth.uid() = user_id OR is_global = true);

CREATE POLICY "Users can insert own components" ON public.components
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own components" ON public.components
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own components" ON public.components
    FOR DELETE USING (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets" ON public.assets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets" ON public.assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON public.assets
    FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage tracking" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert usage tracking" ON public.usage_tracking
    FOR INSERT WITH CHECK (true);

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

-- Functions and triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON public.deployments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();