/**
 * Usage & Cost Tracking with LiteLLM
 * 
 * Extracts cost and usage data from LiteLLM response metadata
 * and tracks usage per model with tier-based quotas
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';

// Edge Runtime compatible cost model
const costPerModel: Record<string, { input: number; output: number }> = {
  'gpt-5': { input: 0.02, output: 0.04 },
  'gpt-5-mini': { input: 0.001, output: 0.002 },
  'claude-4-sonnet': { input: 0.003, output: 0.015 },
  'openai/gpt-oss-20b': { input: 0.001, output: 0.002 },
  'gemini-2.0-flash-thinking-exp': { input: 0.001, output: 0.002 },
};

// Supabase client for logging usage - use service role for server operations
const getSupabaseClient = () => createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UsageMetadata {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costCents: number;
  requestType: 'generation' | 'image' | 'streaming' | 'analysis';
  metadata?: Record<string, any>;
}

export interface UserQuotas {
  free: { monthlyCostCents: 500 };      // $5
  starter: { monthlyCostCents: 5000 };   // $50
  pro: { monthlyCostCents: 20000 };      // $200
  business: { monthlyCostCents: -1 };    // Unlimited
}

export const USER_QUOTAS: UserQuotas = {
  free: { monthlyCostCents: 500 },
  starter: { monthlyCostCents: 5000 },
  pro: { monthlyCostCents: 20000 },
  business: { monthlyCostCents: -1 }
};

/**
 * Extract cost and usage data from LiteLLM response
 */
export function extractUsageFromResponse(
  response: any,
  model: string,
  requestType: UsageMetadata['requestType'] = 'generation'
): Omit<UsageMetadata, 'userId'> {
  // Extract usage from LiteLLM response metadata
  const usage = response.usage || {};
  const promptTokens = usage.prompt_tokens || 0;
  const completionTokens = usage.completion_tokens || 0;
  const totalTokens = usage.total_tokens || promptTokens + completionTokens;

  // Calculate cost using our cost model
  const costCents = calculateCostCents(model, promptTokens, completionTokens);

  return {
    model,
    promptTokens,
    completionTokens,
    totalTokens,
    costCents,
    requestType,
    metadata: {
      responseId: response.id,
      created: response.created,
      object: response.object
    }
  };
}

/**
 * Calculate cost in cents based on token usage
 */
export function calculateCostCents(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = costPerModel[model as keyof typeof costPerModel];
  if (!costs) return 0;

  const inputCost = (promptTokens / 1000) * costs.input;
  const outputCost = (completionTokens / 1000) * costs.output;
  
  return Math.round((inputCost + outputCost) * 100); // Convert to cents
}

/**
 * Log usage to database
 */
export async function logUsage(usage: UsageMetadata): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: usage.userId,
        model: usage.model,
        prompt_tokens: usage.promptTokens,
        completion_tokens: usage.completionTokens,
        total_tokens: usage.totalTokens,
        cost_cents: usage.costCents,
        request_type: usage.requestType,
        metadata: usage.metadata
      });

    if (error) {
      console.error('Failed to log usage:', error);
    }
  } catch (err) {
    console.error('Error logging usage to database:', err);
  }
}

/**
 * Check if user has quota remaining
 */
export async function checkQuotaRemaining(
  userId: string,
  additionalCostCents: number = 0
): Promise<{
  hasQuota: boolean;
  currentUsageCents: number;
  limitCents: number;
  remainingCents: number;
  tier: string;
}> {
  try {
    const supabase = getSupabaseClient();
    // Get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    const tier = profile?.subscription_tier || 'free';
    const limitCents = USER_QUOTAS[tier as keyof UserQuotas]?.monthlyCostCents || 500;

    // If business tier (unlimited), always allow
    if (limitCents === -1) {
      return {
        hasQuota: true,
        currentUsageCents: 0,
        limitCents: -1,
        remainingCents: -1,
        tier
      };
    }

    // Get current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('cost_cents')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    const currentUsageCents = usageData?.reduce((sum: number, record: any) => sum + (record.cost_cents || 0), 0) || 0;
    const remainingCents = limitCents - currentUsageCents - additionalCostCents;

    return {
      hasQuota: remainingCents >= 0,
      currentUsageCents,
      limitCents,
      remainingCents: Math.max(0, remainingCents),
      tier
    };
  } catch (error) {
    console.error('Error checking quota:', error);
    // Default to no quota on error for safety
    return {
      hasQuota: false,
      currentUsageCents: 0,
      limitCents: 0,
      remainingCents: 0,
      tier: 'free'
    };
  }
}

/**
 * Get usage breakdown by model for current month
 */
export async function getUsageBreakdown(userId: string): Promise<{
  total: number;
  byModel: Record<string, { tokens: number; costCents: number; requests: number }>;
  dailyUsage: Array<{ date: string; costCents: number }>;
}> {
  try {
    const supabase = getSupabaseClient();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('model, total_tokens, cost_cents, created_at')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())
      .order('created_at', { ascending: true });

    if (!usageData) {
      return { total: 0, byModel: {}, dailyUsage: [] };
    }

    // Aggregate by model
    const byModel: Record<string, { tokens: number; costCents: number; requests: number }> = {};
    const dailyMap: Record<string, number> = {};

    for (const record of usageData) {
      // By model aggregation
      if (!byModel[record.model]) {
        byModel[record.model] = { tokens: 0, costCents: 0, requests: 0 };
      }
      byModel[record.model].tokens += record.total_tokens || 0;
      byModel[record.model].costCents += record.cost_cents || 0;
      byModel[record.model].requests += 1;

      // Daily aggregation
      const date = new Date(record.created_at).toISOString().split('T')[0];
      dailyMap[date] = (dailyMap[date] || 0) + (record.cost_cents || 0);
    }

    const totalCostCents = Object.values(byModel).reduce((sum, model) => sum + model.costCents, 0);
    const dailyUsage = Object.entries(dailyMap).map(([date, costCents]) => ({ date, costCents }));

    return {
      total: totalCostCents,
      byModel,
      dailyUsage
    };
  } catch (error) {
    console.error('Error getting usage breakdown:', error);
    return { total: 0, byModel: {}, dailyUsage: [] };
  }
}

/**
 * Estimate cost before making a request
 */
export function estimateRequestCost(
  model: string,
  promptLength: number,
  expectedResponseLength: number = 500
): number {
  const costs = costPerModel[model as keyof typeof costPerModel];
  if (!costs) return 0;

  // Rough token estimation: ~4 characters per token
  const estimatedPromptTokens = Math.ceil(promptLength / 4);
  const estimatedCompletionTokens = Math.ceil(expectedResponseLength / 4);

  return calculateCostCents(model, estimatedPromptTokens, estimatedCompletionTokens);
}

/**
 * Wrapper function to track usage for any LiteLLM call
 */
export async function trackUsage<T>(
  userId: string,
  model: string,
  requestType: UsageMetadata['requestType'],
  operation: () => Promise<T>
): Promise<T> {
  const result = await operation();
  
  // Extract usage data if available
  if (result && typeof result === 'object' && 'usage' in result) {
    const usageData = extractUsageFromResponse(result, model, requestType);
    await logUsage({ ...usageData, userId });
  }

  return result;
}