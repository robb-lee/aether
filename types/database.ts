/**
 * Database Types
 * 
 * TypeScript types for Supabase database schema
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'business' | 'enterprise';
          credits_remaining: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'business' | 'enterprise';
          credits_remaining?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'business' | 'enterprise';
          credits_remaining?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sites: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          domain: string | null;
          subdomain: string | null;
          component_tree: any;
          theme: any;
          metadata: any;
          is_published: boolean;
          published_at: string | null;
          template_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          domain?: string | null;
          subdomain?: string | null;
          component_tree?: any;
          theme?: any;
          metadata?: any;
          is_published?: boolean;
          published_at?: string | null;
          template_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          domain?: string | null;
          subdomain?: string | null;
          component_tree?: any;
          theme?: any;
          metadata?: any;
          is_published?: boolean;
          published_at?: string | null;
          template_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          model: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          cost_cents: number;
          request_type: 'generation' | 'image' | 'streaming' | 'analysis';
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          model: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
          cost_cents?: number;
          request_type: 'generation' | 'image' | 'streaming' | 'analysis';
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          model?: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
          cost_cents?: number;
          request_type?: 'generation' | 'image' | 'streaming' | 'analysis';
          metadata?: any;
          created_at?: string;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          site_id: string | null;
          prompt: string;
          prompt_type: 'structure' | 'content' | 'design' | 'image';
          model: string;
          response: any;
          tokens_used: number | null;
          cost_cents: number | null;
          duration_ms: number | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          site_id?: string | null;
          prompt: string;
          prompt_type: 'structure' | 'content' | 'design' | 'image';
          model: string;
          response: any;
          tokens_used?: number | null;
          cost_cents?: number | null;
          duration_ms?: number | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_id?: string | null;
          prompt?: string;
          prompt_type?: 'structure' | 'content' | 'design' | 'image';
          model?: string;
          response?: any;
          tokens_used?: number | null;
          cost_cents?: number | null;
          duration_ms?: number | null;
          error?: string | null;
          created_at?: string;
        };
      };
    };
  };
}