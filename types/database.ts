/**
 * Database Types
 * 
 * TypeScript types for Supabase database schema
 * Generated to match schema.md - DO NOT manually edit field names
 */

// Helper type for JSON columns
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'starter' | 'pro' | 'business';
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
          monthly_ai_credits: number;
          ai_credits_used: number;
          total_sites_created: number;
          max_sites_allowed: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'starter' | 'pro' | 'business';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          monthly_ai_credits?: number;
          ai_credits_used?: number;
          total_sites_created?: number;
          max_sites_allowed?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'starter' | 'pro' | 'business';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          monthly_ai_credits?: number;
          ai_credits_used?: number;
          total_sites_created?: number;
          max_sites_allowed?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      sites: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          status: 'draft' | 'published' | 'archived';
          template_id: string | null;
          components: Json;
          theme: Json;
          seo_metadata: Json;
          deployment_url: string | null;
          preview_url: string | null;
          custom_domain: string | null;
          last_deployed_at: string | null;
          deployment_status: 'pending' | 'building' | 'ready' | 'error' | null;
          page_views: number;
          unique_visitors: number;
          version: number;
          published_version: number | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          status?: 'draft' | 'published' | 'archived';
          template_id?: string | null;
          components?: Json;
          theme?: Json;
          seo_metadata?: Json;
          deployment_url?: string | null;
          preview_url?: string | null;
          custom_domain?: string | null;
          last_deployed_at?: string | null;
          deployment_status?: 'pending' | 'building' | 'ready' | 'error' | null;
          page_views?: number;
          unique_visitors?: number;
          version?: number;
          published_version?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: 'draft' | 'published' | 'archived';
          template_id?: string | null;
          components?: Json;
          theme?: Json;
          seo_metadata?: Json;
          deployment_url?: string | null;
          preview_url?: string | null;
          custom_domain?: string | null;
          last_deployed_at?: string | null;
          deployment_status?: 'pending' | 'building' | 'ready' | 'error' | null;
          page_views?: number;
          unique_visitors?: number;
          version?: number;
          published_version?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          site_id: string | null;
          generation_type: 'site' | 'component' | 'content' | 'image' | 'optimization';
          prompt: string;
          enhanced_prompt: string | null;
          model: string;
          model_version: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          total_tokens: number | null;
          estimated_cost: number | null;
          result: Json | null;
          success: boolean;
          error_message: string | null;
          duration_ms: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          site_id?: string | null;
          generation_type: 'site' | 'component' | 'content' | 'image' | 'optimization';
          prompt: string;
          enhanced_prompt?: string | null;
          model: string;
          model_version?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          estimated_cost?: number | null;
          result?: Json | null;
          success?: boolean;
          error_message?: string | null;
          duration_ms?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_id?: string | null;
          generation_type?: 'site' | 'component' | 'content' | 'image' | 'optimization';
          prompt?: string;
          enhanced_prompt?: string | null;
          model?: string;
          model_version?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          estimated_cost?: number | null;
          result?: Json | null;
          success?: boolean;
          error_message?: string | null;
          duration_ms?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      components: {
        Row: {
          id: string;
          user_id: string | null;
          site_id: string | null;
          name: string;
          type: 'section' | 'element' | 'widget' | 'layout';
          category: string | null;
          definition: Json;
          props_schema: Json | null;
          default_props: Json | null;
          registry_id: string | null;
          variant: string | null;
          registry_metadata: Json;
          description: string | null;
          tags: string[] | null;
          is_public: boolean;
          is_ai_generated: boolean;
          is_registry_component: boolean;
          usage_count: number;
          avg_render_time_ms: number;
          lighthouse_score: number;
          accessibility_score: number;
          version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          site_id?: string | null;
          name: string;
          type: 'section' | 'element' | 'widget' | 'layout';
          category?: string | null;
          definition: Json;
          props_schema?: Json | null;
          default_props?: Json | null;
          registry_id?: string | null;
          variant?: string | null;
          registry_metadata?: Json;
          description?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          is_ai_generated?: boolean;
          is_registry_component?: boolean;
          usage_count?: number;
          avg_render_time_ms?: number;
          lighthouse_score?: number;
          accessibility_score?: number;
          version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          site_id?: string | null;
          name?: string;
          type?: 'section' | 'element' | 'widget' | 'layout';
          category?: string | null;
          definition?: Json;
          props_schema?: Json | null;
          default_props?: Json | null;
          registry_id?: string | null;
          variant?: string | null;
          registry_metadata?: Json;
          description?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          is_ai_generated?: boolean;
          is_registry_component?: boolean;
          usage_count?: number;
          avg_render_time_ms?: number;
          lighthouse_score?: number;
          accessibility_score?: number;
          version?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience types for common operations
export type Site = Database['public']['Tables']['sites']['Row']
export type SiteInsert = Database['public']['Tables']['sites']['Insert']
export type SiteUpdate = Database['public']['Tables']['sites']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type AIGeneration = Database['public']['Tables']['ai_generations']['Row']
export type AIGenerationInsert = Database['public']['Tables']['ai_generations']['Insert']
export type AIGenerationUpdate = Database['public']['Tables']['ai_generations']['Update']

export type Component = Database['public']['Tables']['components']['Row']
export type ComponentInsert = Database['public']['Tables']['components']['Insert']
export type ComponentUpdate = Database['public']['Tables']['components']['Update']