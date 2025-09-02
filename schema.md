# Aether Database Schema & API Specification

## 1. Database Schema

### 1.0 Database Setup

#### Extensions
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### Functions
```sql
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
```

### 1.1 Users Table
Extended user profiles linked to Supabase Auth.

```sql
CREATE TABLE users (
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

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Sites Table
Website metadata and configuration.

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template_id UUID REFERENCES templates(id),
  
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

-- Indexes
CREATE INDEX idx_sites_user_id ON sites(user_id);
CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_template_id ON sites(template_id);
CREATE INDEX idx_sites_components_gin ON sites USING GIN(components);

-- RLS Policies
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sites" ON sites
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (SELECT COUNT(*) FROM sites WHERE user_id = auth.uid()) < 
    (SELECT max_sites_allowed FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON sites
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Published sites are publicly viewable" ON sites
  FOR SELECT USING (status = 'published');
```

### 1.3 Components Table
Reusable component library with Component Registry support.

```sql
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
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

-- Indexes
CREATE INDEX idx_components_user_id ON components(user_id);
CREATE INDEX idx_components_site_id ON components(site_id);
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_is_public ON components(is_public);
CREATE INDEX idx_components_tags_gin ON components USING GIN(tags);

-- Component Registry 관련 인덱스
CREATE INDEX idx_components_registry_id ON components(registry_id);
CREATE INDEX idx_components_variant ON components(variant);
CREATE INDEX idx_components_is_registry ON components(is_registry_component);
CREATE INDEX idx_components_registry_metadata_gin ON components USING GIN(registry_metadata);
CREATE INDEX idx_components_performance ON components(lighthouse_score DESC, accessibility_score DESC);

-- RLS Policies
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own components" ON components
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create components" ON components
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own components" ON components
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own components" ON components
  FOR DELETE USING (auth.uid() = user_id);

-- Component Registry 전용 정책
CREATE POLICY "Registry components are publicly readable" ON components
  FOR SELECT USING (is_registry_component = true);
```

#### Component Selections Table
Track AI component selections for analytics.

```sql
CREATE TABLE component_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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

-- Indexes for analytics
CREATE INDEX idx_component_selections_site_id ON component_selections(site_id);
CREATE INDEX idx_component_selections_component_id ON component_selections(component_id);
CREATE INDEX idx_component_selections_user_id ON component_selections(user_id);
CREATE INDEX idx_component_selections_model ON component_selections(model_used);
CREATE INDEX idx_component_selections_created_at ON component_selections(created_at DESC);

-- RLS Policies
ALTER TABLE component_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own component selections" ON component_selections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create component selections" ON component_selections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 1.4 Templates Table
AI template library for quick site generation.

```sql
CREATE TABLE templates (
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
  created_by UUID REFERENCES users(id),
  is_official BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_slug ON templates(slug);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_is_premium ON templates(is_premium);
CREATE INDEX idx_templates_tags_gin ON templates USING GIN(tags);
CREATE INDEX idx_templates_created_by ON templates(created_by);

-- RLS Policies
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly viewable" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create official templates" ON templates
  FOR INSERT WITH CHECK (
    (is_official = false AND auth.uid() = created_by) OR
    (SELECT subscription_tier FROM users WHERE id = auth.uid()) = 'business'
  );
```

### 1.5 Deployments Table
Deployment history and status tracking.

```sql
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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

-- Indexes
CREATE INDEX idx_deployments_site_id ON deployments(site_id);
CREATE INDEX idx_deployments_user_id ON deployments(user_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_deployment_id ON deployments(deployment_id);
CREATE INDEX idx_deployments_created_at ON deployments(created_at DESC);

-- RLS Policies
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deployments" ON deployments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deployments" ON deployments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 1.6 AI Generations Table
Track AI generation usage and costs.

```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  
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

-- Indexes
CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_site_id ON ai_generations(site_id);
CREATE INDEX idx_ai_generations_generation_type ON ai_generations(generation_type);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at DESC);
CREATE INDEX idx_ai_generations_model ON ai_generations(model);

-- RLS Policies
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI generations" ON ai_generations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (SELECT ai_credits_used FROM users WHERE id = auth.uid()) < 
    (SELECT monthly_ai_credits FROM users WHERE id = auth.uid())
  );
```

### 1.7 Subscriptions Table
User subscription and billing information.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

### 1.8 Additional Supporting Tables

#### Site Versions Table
```sql
CREATE TABLE site_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  components JSONB NOT NULL,
  theme JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, version_number)
);

CREATE INDEX idx_site_versions_site_id ON site_versions(site_id);
CREATE INDEX idx_site_versions_created_at ON site_versions(created_at DESC);
```

#### Custom Domains Table
```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'active', 'error')),
  ssl_status TEXT CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'error')),
  verification_token TEXT,
  dns_records JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX idx_custom_domains_site_id ON custom_domains(site_id);
CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);
```

#### Site Backups Table
```sql
CREATE TABLE site_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  backup_type TEXT DEFAULT 'manual' CHECK (backup_type IN ('manual', 'auto', 'pre_deploy')),
  backup_data JSONB NOT NULL,
  version INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_site_backups_site_id ON site_backups(site_id);
CREATE INDEX idx_site_backups_user_id ON site_backups(user_id);
CREATE INDEX idx_site_backups_created_at ON site_backups(created_at DESC);
CREATE INDEX idx_site_backups_expires_at ON site_backups(expires_at);

-- RLS Policies
ALTER TABLE site_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own backups" ON site_backups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create backups for own sites" ON site_backups
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM sites WHERE id = site_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete own backups" ON site_backups
  FOR DELETE USING (auth.uid() = user_id);
```

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);

-- Partitioning for performance (monthly partitions)
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- RLS Policies (admin only)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND subscription_tier = 'business'
    )
  );
```

#### API Keys Table
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  permissions JSONB DEFAULT '{"read": true, "write": false, "deploy": false}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);

-- RLS Policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);
```

#### Triggers Setup
```sql
-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at 
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at 
  BEFORE UPDATE ON deployments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at 
  BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 2. API Endpoints

### 2.1 AI Generation APIs

#### POST /api/ai/generate
Generate a complete website from a prompt.

```yaml
Method: POST
Path: /api/ai/generate
Auth: Required
Rate Limit: 10/hour (free), 100/hour (starter), unlimited (pro+)

Request:
  Headers:
    Authorization: Bearer {token}
    Content-Type: application/json
  Body:
    prompt: string (required, 10-500 chars)
    template?: string (saas|portfolio|ecommerce|blog|restaurant)
    style?:
      colorScheme?: light|dark|auto
      font?: modern|classic|playful
    features?: string[]
    
Response:
  200 OK:
    siteId: string
    status: generating|complete
    estimatedTime: number (seconds)
    preview?: string (base64 preview image)
    
  400 Bad Request:
    error:
      code: INVALID_PROMPT
      message: string
      
  401 Unauthorized:
    error:
      code: UNAUTHORIZED
      message: string
      
  429 Too Many Requests:
    error:
      code: RATE_LIMIT_EXCEEDED
      message: string
      retryAfter: number (seconds)
```

#### GET /api/ai/status/{generationId}
Check AI generation progress.

```yaml
Method: GET
Path: /api/ai/status/{generationId}
Auth: Required

Response:
  200 OK:
    status: pending|processing|complete|error
    progress: number (0-100)
    currentStep: string
    preview?: string
    siteId?: string (when complete)
    error?: string (if failed)
```

#### POST /api/ai/component
Generate a single component.

```yaml
Method: POST
Path: /api/ai/component
Auth: Required
Rate Limit: 50/hour (free), 500/hour (starter), unlimited (pro+)

Request:
  Body:
    description: string (required)
    type: section|element|widget|layout
    style?: object
    
Response:
  200 OK:
    componentId: string
    code: string
    preview: string
    props: object
    dependencies: string[]
```

#### POST /api/ai/optimize
Optimize existing content.

```yaml
Method: POST
Path: /api/ai/optimize
Auth: Required

Request:
  Body:
    content: string
    context:
      industry?: string
      tone?: professional|casual|friendly
      goal?: conversion|engagement|information
      
Response:
  200 OK:
    optimized: string
    suggestions: string[]
    score:
      readability: number
      seo: number
      engagement: number
```

### 2.2 Site Management APIs

#### GET /api/sites
List user's sites.

```yaml
Method: GET
Path: /api/sites
Auth: Required

Query Parameters:
  page?: number (default: 1)
  limit?: number (default: 10, max: 50)
  status?: draft|published|archived
  sort?: created_at|updated_at|name (default: updated_at)
  order?: asc|desc (default: desc)
  
Response:
  200 OK:
    sites: Site[]
    pagination:
      page: number
      limit: number
      total: number
      totalPages: number
```

#### GET /api/sites/{siteId}
Get site details.

```yaml
Method: GET
Path: /api/sites/{siteId}
Auth: Required for private, Optional for published

Response:
  200 OK:
    id: string
    name: string
    slug: string
    components: ComponentTree
    theme: ThemeConfig
    status: string
    deploymentUrl?: string
    customDomain?: string
    analytics:
      pageViews: number
      uniqueVisitors: number
```

#### PUT /api/sites/{siteId}
Update site.

```yaml
Method: PUT
Path: /api/sites/{siteId}
Auth: Required

Request:
  Body:
    name?: string
    description?: string
    components?: ComponentTree
    theme?: ThemeConfig
    seoMetadata?: SEOMetadata
    
Response:
  200 OK:
    site: Site
    version: number
```

#### DELETE /api/sites/{siteId}
Delete site.

```yaml
Method: DELETE
Path: /api/sites/{siteId}
Auth: Required

Response:
  204 No Content
```

#### POST /api/sites/{siteId}/duplicate
Duplicate a site.

```yaml
Method: POST
Path: /api/sites/{siteId}/duplicate
Auth: Required

Request:
  Body:
    name: string
    
Response:
  201 Created:
    siteId: string
    slug: string
```

### 2.3 Template APIs

#### GET /api/templates
List available templates.

```yaml
Method: GET
Path: /api/templates
Auth: Optional

Query Parameters:
  category?: saas|portfolio|ecommerce|blog|restaurant
  isPremium?: boolean
  tags?: string[] (comma-separated)
  sort?: popular|recent|rating
  
Response:
  200 OK:
    templates: Template[]
    categories: string[]
```

#### GET /api/templates/{templateId}
Get template details.

```yaml
Method: GET
Path: /api/templates/{templateId}
Auth: Optional

Response:
  200 OK:
    id: string
    name: string
    category: string
    structure: object
    preview: string
    features: string[]
    isPremium: boolean
    price?: number
```

#### POST /api/templates
Create custom template (Pro+ only).

```yaml
Method: POST
Path: /api/templates
Auth: Required (Pro or Business tier)

Request:
  Body:
    name: string
    category: string
    structure: object
    description?: string
    tags?: string[]
    
Response:
  201 Created:
    templateId: string
```

### 2.4 Deployment APIs

#### POST /api/deploy/{siteId}
Deploy site to production.

```yaml
Method: POST
Path: /api/deploy/{siteId}
Auth: Required

Request:
  Body:
    environment?: preview|production (default: production)
    domain?: string (custom domain)
    
Response:
  202 Accepted:
    deploymentId: string
    status: pending
    estimatedTime: number
```

#### GET /api/deploy/status/{deploymentId}
Check deployment status.

```yaml
Method: GET
Path: /api/deploy/status/{deploymentId}
Auth: Required

Response:
  200 OK:
    status: pending|building|ready|error
    url?: string
    error?: string
    buildTime?: number
    logs?: string[]
```

#### POST /api/deploy/{siteId}/rollback
Rollback to previous deployment.

```yaml
Method: POST
Path: /api/deploy/{siteId}/rollback
Auth: Required

Request:
  Body:
    deploymentId: string
    
Response:
  200 OK:
    deploymentId: string
    status: string
```

#### POST /api/deploy/{siteId}/domain
Connect custom domain.

```yaml
Method: POST
Path: /api/deploy/{siteId}/domain
Auth: Required (Starter+ tier)

Request:
  Body:
    domain: string
    
Response:
  200 OK:
    verificationToken: string
    dnsRecords: DNSRecord[]
    status: pending
```

### 2.5 User APIs

#### GET /api/users/profile
Get current user profile.

```yaml
Method: GET
Path: /api/users/profile
Auth: Required

Response:
  200 OK:
    id: string
    email: string
    username?: string
    subscription:
      tier: string
      status: string
      aiCredits: number
      aiCreditsUsed: number
      maxSites: number
    stats:
      totalSites: number
      totalDeployments: number
      totalAIGenerations: number
```

#### PUT /api/users/profile
Update user profile.

```yaml
Method: PUT
Path: /api/users/profile
Auth: Required

Request:
  Body:
    username?: string
    fullName?: string
    avatarUrl?: string
    
Response:
  200 OK:
    user: User
```

#### GET /api/users/usage
Get usage statistics.

```yaml
Method: GET
Path: /api/users/usage
Auth: Required

Query Parameters:
  period?: day|week|month|year
  
Response:
  200 OK:
    aiGenerations:
      total: number
      byType: object
      remaining: number
    sites:
      created: number
      published: number
      maxAllowed: number
    deployments:
      total: number
      successful: number
      failed: number
    billing:
      currentPlan: string
      nextBillingDate?: string
      amount?: number
```

## 3. Data Types & Interfaces

### 3.1 Core Types

```typescript
interface Site {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  components: ComponentTree;
  theme: ThemeConfig;
  seoMetadata: SEOMetadata;
  deploymentUrl?: string;
  customDomain?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface ComponentTree {
  root: ComponentNode;
  version: string;
}

interface ComponentNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentNode[];
  styles?: StyleConfig;
  animations?: AnimationConfig;
  responsive?: ResponsiveConfig;
}

interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  fonts: {
    heading: string;
    body: string;
    code?: string;
  };
  spacing?: {
    unit: number;
    scale: number[];
  };
  borderRadius?: string;
  shadows?: Record<string, string>;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  category: TemplateCategory;
  structure: ComponentTree;
  defaultContent?: Record<string, any>;
  themePresets?: ThemeConfig[];
  aiPrompts?: {
    structure: string;
    content: string;
    style: string;
  };
  preview: string;
  isPremium: boolean;
  price?: number;
}

interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  monthlyAiCredits: number;
  aiCreditsUsed: number;
  maxSitesAllowed: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

interface Deployment {
  id: string;
  siteId: string;
  deploymentId: string;
  deploymentUrl: string;
  status: DeploymentStatus;
  environment: 'development' | 'preview' | 'production';
  buildTimeSeconds?: number;
  createdAt: Date;
  completedAt?: Date;
}

interface AIGeneration {
  id: string;
  userId: string;
  siteId?: string;
  generationType: AIGenerationType;
  prompt: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  result?: any;
  success: boolean;
  durationMs: number;
  createdAt: Date;
}
```

### 3.2 Request/Response Types

```typescript
interface GenerateSiteRequest {
  prompt: string;
  template?: TemplateCategory;
  style?: {
    colorScheme?: 'light' | 'dark' | 'auto';
    font?: 'modern' | 'classic' | 'playful';
  };
  features?: string[];
}

interface GenerateSiteResponse {
  siteId: string;
  status: 'generating' | 'complete';
  estimatedTime: number;
  preview?: string;
}

interface DeployRequest {
  environment?: 'preview' | 'production';
  domain?: string;
}

interface DeployResponse {
  deploymentId: string;
  status: DeploymentStatus;
  estimatedTime: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

### 3.3 Enums

```typescript
enum SubscriptionTier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  BUSINESS = 'business'
}

enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  INCOMPLETE = 'incomplete',
  PAST_DUE = 'past_due'
}

enum DeploymentStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  READY = 'ready',
  ERROR = 'error',
  CANCELLED = 'cancelled'
}

enum AIGenerationType {
  SITE = 'site',
  COMPONENT = 'component',
  CONTENT = 'content',
  IMAGE = 'image',
  OPTIMIZATION = 'optimization'
}

enum TemplateCategory {
  SAAS = 'saas',
  PORTFOLIO = 'portfolio',
  ECOMMERCE = 'ecommerce',
  BLOG = 'blog',
  RESTAURANT = 'restaurant',
  LANDING = 'landing',
  OTHER = 'other'
}

enum ComponentType {
  SECTION = 'section',
  ELEMENT = 'element',
  WIDGET = 'widget',
  LAYOUT = 'layout'
}
```

## 4. Real-time Subscriptions

### 4.1 Channels

```typescript
// Site updates channel
const siteChannel = supabase
  .channel(`sites:${userId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'sites',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Handle site changes
  });

// Deployment status channel
const deploymentChannel = supabase
  .channel(`deployments:${siteId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'deployments',
    filter: `site_id=eq.${siteId}`
  }, (payload) => {
    // Handle deployment updates
  });

// AI generation progress channel
const aiChannel = supabase
  .channel(`ai:${generationId}`)
  .on('broadcast', {
    event: 'progress'
  }, (payload) => {
    // Handle progress updates
  });

// Collaboration channel (Phase 2)
const collaborationChannel = supabase
  .channel(`collaboration:${siteId}`)
  .on('presence', {
    event: 'sync'
  }, () => {
    // Handle presence updates
  })
  .on('broadcast', {
    event: 'cursor'
  }, (payload) => {
    // Handle cursor movements
  })
  .on('broadcast', {
    event: 'selection'
  }, (payload) => {
    // Handle selection changes
  });
```

### 4.2 Events

```typescript
interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, any>;
  old_record?: Record<string, any>;
  timestamp: string;
}

interface ProgressEvent {
  generationId: string;
  progress: number;
  currentStep: string;
  preview?: string;
}

interface CollaborationEvent {
  userId: string;
  action: 'cursor' | 'selection' | 'edit';
  data: any;
  timestamp: string;
}
```

## 5. Performance Optimization

### 5.1 Indexes

Critical indexes for query performance:

```sql
-- Component tree queries (JSONB)
CREATE INDEX idx_sites_components_root ON sites ((components->'root'->>'type'));
CREATE INDEX idx_sites_components_search ON sites USING GIN (components jsonb_path_ops);

-- Time-based queries
CREATE INDEX idx_ai_generations_user_date ON ai_generations(user_id, created_at DESC);
CREATE INDEX idx_deployments_site_date ON deployments(site_id, created_at DESC);

-- Slug lookups (partial index for published sites)
CREATE INDEX idx_sites_slug_published ON sites(slug) WHERE status = 'published';

-- Template search
CREATE INDEX idx_templates_search ON templates USING GIN(
  to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' '))
);
```

### 5.2 Query Patterns

Optimized query patterns for common operations:

```sql
-- Get user's sites with pagination
SELECT s.*, 
       COUNT(d.id) as deployment_count,
       MAX(d.created_at) as last_deployed_at
FROM sites s
LEFT JOIN deployments d ON s.id = d.site_id
WHERE s.user_id = $1
GROUP BY s.id
ORDER BY s.updated_at DESC
LIMIT $2 OFFSET $3;

-- Search components in JSONB
SELECT * FROM sites
WHERE components @> '{"root": {"children": [{"type": "hero"}]}}';

-- Get AI usage for current billing period
SELECT 
  generation_type,
  COUNT(*) as count,
  SUM(total_tokens) as total_tokens,
  SUM(estimated_cost) as total_cost
FROM ai_generations
WHERE user_id = $1
  AND created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY generation_type;
```

### 5.3 Caching Strategy

```typescript
interface CacheConfig {
  // Redis cache layers
  layers: {
    // L1: Edge cache (Vercel)
    edge: {
      ttl: 60, // seconds
      patterns: ['/api/templates', '/api/sites/[slug]']
    },
    
    // L2: Redis cache
    redis: {
      ttl: 300, // seconds
      patterns: ['ai-generations', 'user-stats', 'site-analytics']
    },
    
    // L3: Database materialized views
    database: {
      refresh: 3600, // seconds
      views: ['user_statistics', 'site_analytics', 'template_rankings']
    }
  },
  
  // Cache invalidation rules
  invalidation: {
    onSiteUpdate: ['sites:*', 'deployments:*'],
    onDeployment: ['sites:[siteId]', 'deployments:[siteId]'],
    onAIGeneration: ['ai-credits:[userId]', 'usage:[userId]']
  }
}
```

## 6. Security

### 6.1 RLS Policies

Row Level Security policies ensure data isolation:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Example: Complex RLS policy for site sharing (Phase 2)
CREATE POLICY "Sites viewable by owner or team members" ON sites
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT member_id FROM team_members 
      WHERE site_id = sites.id AND status = 'active'
    )
  );
```

### 6.2 API Security

```typescript
interface SecurityConfig {
  // Authentication
  auth: {
    provider: 'supabase',
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d'
    }
  },
  
  // Rate limiting per tier
  rateLimits: {
    free: {
      'ai/generate': '10/hour',
      'sites': '100/hour',
      'deployments': '5/hour'
    },
    starter: {
      'ai/generate': '100/hour',
      'sites': '500/hour',
      'deployments': '20/hour'
    },
    pro: {
      'ai/generate': '1000/hour',
      'sites': '2000/hour',
      'deployments': '100/hour'
    },
    business: {
      // No rate limits
    }
  },
  
  // API key permissions
  apiKeyScopes: {
    read: ['GET /api/sites', 'GET /api/templates'],
    write: ['POST /api/sites', 'PUT /api/sites'],
    deploy: ['POST /api/deploy'],
    admin: ['*']
  },
  
  // Input validation
  validation: {
    maxPromptLength: 500,
    maxComponentTreeDepth: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
}
```

### 6.3 Rate Limiting

```typescript
// Rate limiting implementation
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = {
  free: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true
  }),
  starter: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true
  }),
  pro: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1000, '1 h'),
    analytics: true
  })
};

// Middleware
export async function rateLimitMiddleware(req: Request, tier: string) {
  const identifier = req.headers.get('authorization') || req.ip;
  const { success, limit, reset, remaining } = await ratelimit[tier].limit(identifier);
  
  if (!success) {
    return new Response('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString()
      }
    });
  }
}
```

## 7. Migration Strategy

### 7.1 Initial Setup

```sql
-- Create database functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption

-- Create initial enum types
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'business');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'cancelled', 'incomplete', 'past_due');
CREATE TYPE deployment_status AS ENUM ('pending', 'building', 'ready', 'error', 'cancelled');
CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
```

### 7.2 Seed Data

```sql
-- Insert default templates
INSERT INTO templates (name, slug, category, structure, is_official) VALUES
('SaaS Landing', 'saas-landing', 'saas', '{"root": {...}}', true),
('Portfolio Modern', 'portfolio-modern', 'portfolio', '{"root": {...}}', true),
('E-commerce Starter', 'ecommerce-starter', 'ecommerce', '{"root": {...}}', true),
('Blog Minimal', 'blog-minimal', 'blog', '{"root": {...}}', true),
('Restaurant Elegant', 'restaurant-elegant', 'restaurant', '{"root": {...}}', true);

-- Insert subscription tiers configuration
INSERT INTO subscription_tiers_config (tier, monthly_ai_credits, max_sites, max_custom_domains, price) VALUES
('free', 10, 3, 0, 0),
('starter', 100, 10, 1, 5),
('pro', -1, -1, 5, 19), -- -1 means unlimited
('business', -1, -1, -1, 49);
```

## 8. Monitoring & Analytics

### 8.1 Key Metrics

```sql
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
```

### 8.2 Performance Monitoring

```typescript
interface MonitoringConfig {
  // Key performance indicators
  kpis: {
    aiGenerationTime: {
      target: 30000, // 30 seconds
      warning: 25000,
      critical: 35000
    },
    deploymentTime: {
      target: 60000, // 60 seconds
      warning: 50000,
      critical: 90000
    },
    apiResponseTime: {
      target: 200, // 200ms
      warning: 500,
      critical: 1000
    }
  },
  
  // Alert thresholds
  alerts: {
    errorRate: 0.01, // 1%
    aiQuotaUsage: 0.8, // 80%
    databaseConnections: 0.9, // 90%
    storageUsage: 0.85 // 85%
  },
  
  // Metrics to track
  metrics: [
    'api.requests.total',
    'api.requests.duration',
    'ai.generations.total',
    'ai.generations.duration',
    'ai.tokens.used',
    'deployments.total',
    'deployments.duration',
    'database.queries.duration',
    'cache.hit.rate'
  ]
}
```

## 9. Backup & Recovery

### 9.1 Backup Strategy

```yaml
Backup Schedule:
  Database:
    - Full backup: Daily at 2 AM UTC
    - Incremental: Every 6 hours
    - Retention: 30 days
    
  File Storage:
    - Full backup: Weekly
    - Incremental: Daily
    - Retention: 90 days
    
  Configuration:
    - Git repository: Continuous
    - Environment variables: On change
    
Recovery Objectives:
  RPO (Recovery Point Objective): 6 hours
  RTO (Recovery Time Objective): 2 hours
```

### 9.2 Disaster Recovery

```sql
-- Point-in-time recovery setup
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'aws s3 cp %p s3://backup-bucket/wal/%f';

-- Create read replica for failover
CREATE PUBLICATION aether_publication FOR ALL TABLES;
-- On replica:
CREATE SUBSCRIPTION aether_subscription
  CONNECTION 'host=primary dbname=aether'
  PUBLICATION aether_publication;
```

## 10. Future Considerations

### 10.1 Phase 2 Features

```typescript
interface Phase2Features {
  collaboration: {
    tables: ['team_members', 'site_permissions', 'collaboration_sessions'],
    apis: ['/api/teams', '/api/collaborate'],
    realtime: ['presence', 'cursors', 'live-edits']
  },
  
  marketplace: {
    tables: ['marketplace_items', 'purchases', 'reviews', 'payouts'],
    apis: ['/api/marketplace', '/api/purchases'],
    features: ['template-sales', 'component-store', 'revenue-sharing']
  },
  
  analytics: {
    tables: ['page_views', 'events', 'conversions', 'funnels'],
    apis: ['/api/analytics', '/api/reports'],
    features: ['real-user-monitoring', 'heatmaps', 'ab-testing']
  },
  
  enterprise: {
    tables: ['organizations', 'sso_configs', 'audit_logs'],
    apis: ['/api/organizations', '/api/sso'],
    features: ['sso', 'audit-trail', 'compliance', 'sla']
  }
}
```

### 10.2 Scalability Roadmap

```yaml
6 Months:
  Database:
    - Implement read replicas
    - Add connection pooling (PgBouncer)
    - Partition large tables by date
    
  Caching:
    - Implement Redis cluster
    - Add CDN for static assets
    - Edge caching for API responses
    
  Architecture:
    - Microservices for AI generation
    - Queue-based processing (BullMQ)
    - Event-driven architecture
    
12 Months:
  Database:
    - Multi-region replication
    - Automated sharding
    - Time-series database for analytics
    
  Infrastructure:
    - Kubernetes deployment
    - Auto-scaling policies
    - Multi-cloud strategy
```

## Appendix

### A. Error Codes

```typescript
enum ErrorCodes {
  // Authentication
  AUTH_INVALID_TOKEN = 'AUTH_001',
  AUTH_EXPIRED_TOKEN = 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_003',
  
  // AI Generation
  AI_GENERATION_FAILED = 'AI_001',
  AI_QUOTA_EXCEEDED = 'AI_002',
  AI_INVALID_PROMPT = 'AI_003',
  AI_TIMEOUT = 'AI_004',
  
  // Sites
  SITE_NOT_FOUND = 'SITE_001',
  SITE_LIMIT_EXCEEDED = 'SITE_002',
  SITE_INVALID_SLUG = 'SITE_003',
  
  // Deployment
  DEPLOY_FAILED = 'DEPLOY_001',
  DEPLOY_TIMEOUT = 'DEPLOY_002',
  DEPLOY_INVALID_CONFIG = 'DEPLOY_003',
  
  // Subscription
  SUB_PAYMENT_FAILED = 'SUB_001',
  SUB_LIMIT_EXCEEDED = 'SUB_002',
  SUB_INVALID_PLAN = 'SUB_003',
  
  // Validation
  VAL_INVALID_INPUT = 'VAL_001',
  VAL_MISSING_FIELD = 'VAL_002',
  VAL_INVALID_FORMAT = 'VAL_003'
}
```

### B. Database Functions

```sql
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
```

### C. Sample Queries

```sql
-- Get user's dashboard data
WITH user_stats AS (
  SELECT 
    u.id,
    u.subscription_tier,
    u.monthly_ai_credits - u.ai_credits_used as ai_credits_remaining,
    COUNT(DISTINCT s.id) as total_sites,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'published') as published_sites,
    COUNT(DISTINCT d.id) FILTER (WHERE d.created_at > NOW() - INTERVAL '30 days') as recent_deployments
  FROM users u
  LEFT JOIN sites s ON u.id = s.user_id
  LEFT JOIN deployments d ON s.id = d.site_id
  WHERE u.id = $1
  GROUP BY u.id
)
SELECT * FROM user_stats;

-- Get popular templates
SELECT 
  t.*,
  COUNT(DISTINCT s.id) as sites_created,
  AVG(r.rating) as avg_rating
FROM templates t
LEFT JOIN sites s ON t.id = s.template_id
LEFT JOIN template_ratings r ON t.id = r.template_id
GROUP BY t.id
ORDER BY sites_created DESC, avg_rating DESC
LIMIT 10;

-- Monitor AI generation performance
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  generation_type,
  COUNT(*) as total_generations,
  AVG(duration_ms) as avg_duration,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95_duration,
  SUM(estimated_cost) as total_cost,
  COUNT(*) FILTER (WHERE success = false) as failures
FROM ai_generations
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour, generation_type
ORDER BY hour DESC;
```