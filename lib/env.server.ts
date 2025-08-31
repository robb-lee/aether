import { z } from 'zod';

/**
 * Server-side environment variable validation
 * Includes sensitive keys and server-only configuration
 * 
 * ⚠️ IMPORTANT: Never import this file in client-side code!
 * These variables contain secrets that must not be exposed to the browser.
 */

// ============================================================================
// Server Environment Schema
// ============================================================================

/**
 * Schema for server-only environment variables
 * These are only available in API routes, server components, and middleware
 */
const serverEnvSchema = z.object({
  // Supabase service role (server-only, has full database access)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, {
    message: 'SUPABASE_SERVICE_ROLE_KEY is required for server-side database operations',
  }),
  
  // LiteLLM Configuration (AI Gateway)
  LITELLM_API_BASE: z.string().url({
    message: 'LITELLM_API_BASE must be a valid URL (e.g., http://localhost:4000)',
  }),
  LITELLM_API_KEY: z.string().min(1, {
    message: 'LITELLM_API_KEY is required for AI operations',
  }),
  
  // AI Model Configuration
  AI_PRIMARY_MODEL: z.string().default('gpt-4-turbo-preview'),
  AI_FALLBACK_MODEL: z.string().default('claude-3-haiku'),
  AI_IMAGE_MODEL: z.string().default('dall-e-3'),
  
  // Optional: Direct API keys for fallback
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  
  // Vercel Configuration (optional - for deployments)
  VERCEL_TOKEN: z.string().min(1).optional(),
  VERCEL_TEAM_ID: z.string().min(1).optional(),
  
  // Redis Configuration (optional - for caching)
  REDIS_URL: z.string().url().optional(),
  
  // Stripe Configuration (optional - for payments)
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
});

// ============================================================================
// Validation Function
// ============================================================================

/**
 * Validates server-side environment variables
 * Should only be called in server-side code
 */
function validateServerEnv() {
  // Ensure this is only called server-side
  if (typeof window !== 'undefined') {
    throw new Error(
      '🚨 Security Error: Server environment variables accessed in client-side code!\n' +
      'This file should only be imported in API routes, server components, or middleware.'
    );
  }
  
  try {
    // Filter out NEXT_PUBLIC_ variables for server-only validation
    const serverOnlyEnv = Object.entries(process.env)
      .filter(([key]) => !key.startsWith('NEXT_PUBLIC_'))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return serverEnvSchema.parse(serverOnlyEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = '❌ Invalid server environment variables:\n' +
        error.errors.map(err => {
          const path = err.path.join('.');
          const message = err.message;
          return `  • ${path}: ${message}`;
        }).join('\n') +
        '\n\n💡 Check your .env.local file for missing server variables.\n' +
        '📖 Refer to .env.local.example for the required configuration.';
      
      console.error(errorMessage);
      
      // Always throw in server-side to prevent app from starting with missing config
      throw new Error('Server environment validation failed. Check console for details.');
    }
    throw error;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Type for server-side environment variables
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// ============================================================================
// Singleton Export with Lazy Loading
// ============================================================================

let _serverEnv: ServerEnv | undefined;

/**
 * Get validated server environment variables
 * Lazy loads and caches the result
 * 
 * @example
 * ```ts
 * // In an API route
 * import { getServerEnv } from '@/lib/env.server';
 * 
 * export async function POST(request: Request) {
 *   const env = getServerEnv();
 *   const response = await fetch(env.LITELLM_API_BASE, {
 *     headers: { 'Authorization': `Bearer ${env.LITELLM_API_KEY}` }
 *   });
 * }
 * ```
 */
export function getServerEnv(): ServerEnv {
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

// ============================================================================
// Service Configuration Helpers
// ============================================================================

/**
 * Check if LiteLLM is properly configured
 */
export function isLiteLLMConfigured(): boolean {
  try {
    const env = getServerEnv();
    return !!(env.LITELLM_API_BASE && env.LITELLM_API_KEY);
  } catch {
    return false;
  }
}

/**
 * Check if direct API fallbacks are configured
 */
export function hasFallbackAPIs(): boolean {
  try {
    const env = getServerEnv();
    return !!(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY);
  } catch {
    return false;
  }
}

/**
 * Check if Vercel deployment is configured
 */
export function isVercelConfigured(): boolean {
  try {
    const env = getServerEnv();
    return !!(env.VERCEL_TOKEN && env.VERCEL_TEAM_ID);
  } catch {
    return false;
  }
}

/**
 * Check if Redis caching is configured
 */
export function isRedisConfigured(): boolean {
  try {
    const env = getServerEnv();
    return !!env.REDIS_URL;
  } catch {
    return false;
  }
}

/**
 * Check if Stripe payments are configured
 */
export function isStripeConfigured(): boolean {
  try {
    const env = getServerEnv();
    return !!(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return false;
  }
}

/**
 * Get the primary AI model configuration
 */
export function getAIModelConfig() {
  const env = getServerEnv();
  return {
    primary: env.AI_PRIMARY_MODEL,
    fallback: env.AI_FALLBACK_MODEL,
    image: env.AI_IMAGE_MODEL,
  };
}

// Export schema for testing
export { serverEnvSchema };