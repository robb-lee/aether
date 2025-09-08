/**
 * Aether Database Types
 * Auto-generated TypeScript types from PostgreSQL schema
 */

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  ai_credits: number;
  max_sites: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  preview_image?: string;
  preview_url?: string;
  component_structure: Record<string, any>;
  style_config: Record<string, any>;
  ai_hints: Record<string, any>;
  performance_score?: number;
  usage_count: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_id?: string;
  domain?: string;
  custom_domain?: string;
  status: 'draft' | 'generating' | 'completed' | 'published' | 'archived';
  generation_prompt?: string;
  components: Record<string, any>;
  seo_config: Record<string, any>;
  style_config: Record<string, any>;
  performance_metrics: Record<string, any>;
  ai_generation_id?: string;
  version: number;
  is_public: boolean;
  last_published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  description?: string;
  html_structure: string;
  css_styles: string;
  typescript_logic?: string;
  props_schema: Record<string, any>;
  design_tokens: Record<string, any>;
  performance_score: number;
  lighthouse_metrics: Record<string, any>;
  accessibility_score: number;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComponentSelection {
  id: string;
  ai_generation_id: string;
  component_id: string;
  position: number;
  customization_prompt?: string;
  props_override: Record<string, any>;
  style_override: Record<string, any>;
  reasoning?: string;
  confidence_score: number;
  created_at: string;
}

export interface Deployment {
  id: string;
  site_id: string;
  version: number;
  provider: string;
  deployment_url: string;
  status: 'pending' | 'building' | 'ready' | 'error';
  build_log?: string;
  error_message?: string;
  environment: 'preview' | 'production';
  metrics: Record<string, any>;
  deployed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  site_id?: string;
  prompt: string;
  context_extracted: Record<string, any>;
  model_used: string;
  template_suggestions: string[];
  component_selections: Record<string, any>;
  content_generated: Record<string, any>;
  tokens_used: number;
  cost_cents: number;
  generation_time_ms: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  quality_score?: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  ai_credits_limit: number;
  sites_limit: number;
  custom_domains_limit: number;
  priority_support: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteVersion {
  id: string;
  site_id: string;
  version: number;
  components_snapshot: Record<string, any>;
  created_at: string;
}

export interface CustomDomain {
  id: string;
  site_id: string;
  domain: string;
  status: 'pending' | 'active' | 'error';
  verification_record?: string;
  ssl_certificate?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SiteBackup {
  id: string;
  site_id: string;
  backup_data: Record<string, any>;
  backup_type: 'manual' | 'automatic';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface APIKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  permissions: string[];
  last_used_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  site_id?: string;
  filename: string;
  file_path: string;
  file_size: number;
  content_type: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  site_id: string;
  event_type: string;
  properties: Record<string, any>;
  user_properties?: Record<string, any>;
  session_id?: string;
  created_at: string;
}

// Utility types
export type SiteStatus = Site['status'];
export type DeploymentStatus = Deployment['status'];
export type AIGenerationStatus = AIGeneration['status'];
export type SubscriptionPlan = Subscription['plan'];
export type SubscriptionStatus = Subscription['status'];

// Database response types
export type DatabaseError = {
  error: string;
  details?: string;
  hint?: string;
};

export type DatabaseResponse<T> = {
  data: T | null;
  error: DatabaseError | null;
};

// Query filter types
export type UserFilter = Partial<Pick<User, 'subscription_tier' | 'created_at'>>;
export type SiteFilter = Partial<Pick<Site, 'user_id' | 'status' | 'is_public' | 'created_at'>>;
export type ComponentFilter = Partial<Pick<Component, 'category' | 'is_active' | 'version'>>;