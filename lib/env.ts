import { z } from 'zod';

/**
 * Comprehensive environment variable validation using Zod
 * This file validates all environment variables and provides type-safe access
 */

// ============================================================================
// Schema Definitions
// ============================================================================

/**
 * Supabase Configuration Schema
 */
const supabaseSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().describe('Supabase project URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).describe('Supabase anonymous key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).describe('Supabase service role key for server-side operations'),
});

/**
 * LiteLLM Configuration Schema (Unified AI Gateway)
 */
const liteLLMSchema = z.object({
  LITELLM_API_BASE: z.string().url().describe('LiteLLM endpoint (e.g., http://localhost:4000)'),
  LITELLM_API_KEY: z.string().min(1).describe('LiteLLM API key for authentication'),
});

/**
 * AI Model Selection Schema
 */
const aiModelSchema = z.object({
  AI_PRIMARY_MODEL: z.string().default('gpt-4-turbo-preview').describe('Primary AI model for generation'),
  AI_FALLBACK_MODEL: z.string().default('claude-3-haiku').describe('Fallback model if primary fails'),
  AI_IMAGE_MODEL: z.string().default('dall-e-3').describe('Model for image generation'),
});

/**
 * Optional Direct API Keys (Fallback)
 */
const fallbackAPISchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional().describe('OpenAI API key for direct fallback'),
  ANTHROPIC_API_KEY: z.string().min(1).optional().describe('Anthropic API key for direct fallback'),
});

/**
 * Vercel Configuration Schema (for deployments)
 */
const vercelSchema = z.object({
  VERCEL_TOKEN: z.string().min(1).optional().describe('Vercel token for deployments'),
  VERCEL_TEAM_ID: z.string().min(1).optional().describe('Vercel team ID'),
});

/**
 * Redis Configuration Schema (optional caching)
 */
const redisSchema = z.object({
  REDIS_URL: z.string().url().optional().describe('Redis connection URL for caching'),
});

/**
 * Stripe Configuration Schema (payments)
 */
const stripeSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1).optional().describe('Stripe secret key for server-side'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional().describe('Stripe webhook endpoint secret'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional().describe('Stripe publishable key for client'),
});

/**
 * Application Configuration Schema
 */
const appConfigSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000').describe('Application base URL'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Aether').describe('Application name'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string()
    .default('AI-powered website builder that creates professional websites in 30 seconds')
    .describe('Application description'),
});

// ============================================================================
// Combined Schema
// ============================================================================

/**
 * Complete environment schema combining all configurations
 */
const envSchema = z.object({
  ...supabaseSchema.shape,
  ...liteLLMSchema.shape,
  ...aiModelSchema.shape,
  ...fallbackAPISchema.shape,
  ...vercelSchema.shape,
  ...redisSchema.shape,
  ...stripeSchema.shape,
  ...appConfigSchema.shape,
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates environment variables and returns typed object
 * @throws {Error} If required environment variables are missing or invalid
 */
export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = '❌ Invalid environment variables detected:\n' +
        error.errors.map(err => {
          const path = err.path.join('.');
          const message = err.message;
          return `  • ${path}: ${message}`;
        }).join('\n') +
        '\n\n💡 Please check your .env.local file and ensure all required variables are set correctly.';
      
      console.error(errorMessage);
      throw new Error('Environment validation failed. See console for details.');
    }
    throw error;
  }
}

/**
 * Get all public environment variables (safe for client-side)
 */
export function getPublicEnv() {
  const publicEnv = Object.entries(process.env)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return publicEnv;
}

/**
 * Check if a specific service is configured
 */
export function isServiceConfigured(service: 'vercel' | 'redis' | 'stripe') {
  const env = process.env;
  
  switch (service) {
    case 'vercel':
      return !!(env.VERCEL_TOKEN && env.VERCEL_TEAM_ID);
    case 'redis':
      return !!env.REDIS_URL;
    case 'stripe':
      return !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    default:
      return false;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Inferred environment type for type-safe access
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Client-safe environment variables type
 */
export type PublicEnv = Pick<Env, 
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  | 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  | 'NEXT_PUBLIC_APP_URL'
  | 'NEXT_PUBLIC_SITE_NAME'
  | 'NEXT_PUBLIC_SITE_DESCRIPTION'
>;

/**
 * Server-only environment variables type
 */
export type ServerEnv = Omit<Env, keyof PublicEnv>;

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Validated environment variables (singleton)
 * Access this for type-safe environment variables throughout the app
 */
let env: Env | undefined;

export function getEnv(): Env {
  if (!env) {
    env = validateEnv();
  }
  return env;
}

// Export the schema for testing purposes
export { envSchema };