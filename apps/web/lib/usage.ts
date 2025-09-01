/**
 * Usage and Quota Management
 * 
 * Simplified implementation for Edge Runtime compatibility
 * Full database integration will be added in Task 2.6 with Redis caching
 */

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface UsageStats {
  currentPeriodCents: number;
  limitCents: number;
  remainingCents: number;
  percentageUsed: number;
  daysUntilReset: number;
  tier: SubscriptionTier;
}

export interface ModelUsageStats {
  model: string;
  requests: number;
  tokens: number;
  costCents: number;
  percentageOfTotal: number;
}

// Simple utility functions for formatting
export function formatCost(costCents: number): string {
  if (costCents < 0) return 'Unlimited';
  return `$${(costCents / 100).toFixed(2)}`;
}

export function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens} tokens`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`;
  return `${(tokens / 1000000).toFixed(1)}M tokens`;
}

// Note: Full implementation with database queries will be added in Task 2.6
// For now, this provides the essential types and utility functions needed