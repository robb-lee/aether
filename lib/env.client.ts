import { z } from 'zod';

/**
 * Client-side environment variable validation
 * Only includes NEXT_PUBLIC_* variables that are safe to expose to the browser
 */

// ============================================================================
// Client Environment Schema
// ============================================================================

/**
 * Schema for client-side environment variables
 * These are embedded in the JavaScript bundle and visible to users
 */
const clientEnvSchema = z.object({
  // Supabase public configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
  }),
  
  // Stripe public key (optional - only needed if payments are enabled)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  
  // Application configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Aether'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default(
    'AI-powered website builder that creates professional websites in 30 seconds'
  ),
});

// ============================================================================
// Validation and Export
// ============================================================================

/**
 * Validates and returns client-side environment variables
 * This should be called once at app initialization
 */
function validateClientEnv() {
  // Filter only NEXT_PUBLIC_ variables from process.env
  const clientEnv = Object.entries(process.env)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  try {
    return clientEnvSchema.parse(clientEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = '❌ Invalid client environment variables:\n' +
        error.errors.map(err => {
          const path = err.path.join('.');
          const message = err.message;
          return `  • ${path}: ${message}`;
        }).join('\n') +
        '\n\n💡 Check your .env.local file for missing NEXT_PUBLIC_* variables.';
      
      console.error(errorMessage);
      
      // In development, throw error to catch issues early
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Client environment validation failed');
      }
      
      // In production, return defaults where possible
      console.warn('Using default values for missing environment variables');
      return clientEnvSchema.parse({});
    }
    throw error;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Type for client-side environment variables
 */
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Validated client environment variables
 * Safe to use in React components and client-side code
 * 
 * @example
 * ```tsx
 * import { clientEnv } from '@/lib/env.client';
 * 
 * function MyComponent() {
 *   return <div>App: {clientEnv.NEXT_PUBLIC_SITE_NAME}</div>;
 * }
 * ```
 */
export const clientEnv: ClientEnv = validateClientEnv();

/**
 * Helper to check if Stripe is configured
 */
export const isStripeEnabled = (): boolean => {
  return !!clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

/**
 * Helper to get the full app URL with optional path
 */
export const getAppUrl = (path?: string): string => {
  const baseUrl = clientEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  if (!path) return baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Helper to check if running in development
 */
export const isDevelopment = (): boolean => {
  return clientEnv.NEXT_PUBLIC_APP_URL.includes('localhost');
};

// Export schema for testing
export { clientEnvSchema };