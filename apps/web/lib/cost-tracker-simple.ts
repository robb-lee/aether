/**
 * Simplified Cost Tracker for Edge Runtime
 * 
 * Edge Runtime compatible version without complex dependencies
 */

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

// Edge Runtime compatible cost model
const costPerModel: Record<string, { input: number; output: number }> = {
  'gpt-5': { input: 0.02, output: 0.04 },
  'gpt-5-mini': { input: 0.001, output: 0.002 },
  'claude-4-sonnet': { input: 0.003, output: 0.015 },
  'gemini-2.0-flash-thinking-exp': { input: 0.001, output: 0.002 },
};

export const USER_QUOTAS = {
  free: { monthlyCostCents: 500 },      // $5
  starter: { monthlyCostCents: 5000 },   // $50
  pro: { monthlyCostCents: 20000 },      // $200
  business: { monthlyCostCents: -1 }     // Unlimited
};

/**
 * Extract cost and usage data from LiteLLM response
 */
export function extractUsageFromResponse(
  response: any,
  model: string,
  requestType: UsageMetadata['requestType'] = 'generation'
): Omit<UsageMetadata, 'userId'> {
  const usage = response.usage || {};
  const promptTokens = usage.prompt_tokens || 0;
  const completionTokens = usage.completion_tokens || 0;
  const totalTokens = usage.total_tokens || promptTokens + completionTokens;

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
  
  return Math.round((inputCost + outputCost) * 100);
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

  const estimatedPromptTokens = Math.ceil(promptLength / 4);
  const estimatedCompletionTokens = Math.ceil(expectedResponseLength / 4);

  return calculateCostCents(model, estimatedPromptTokens, estimatedCompletionTokens);
}