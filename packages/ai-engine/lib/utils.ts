/**
 * Utility functions for AI engine
 */

/**
 * Generate unique ID with prefix
 */
export function generateUniqueId(prefix: string = 'comp'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Calculate token count (rough estimate)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4); // ~4 characters per token
}

/**
 * Format cost display
 */
export function formatCost(cost: number): string {
  if (cost < 0.001) {
    return `$${(cost * 1000).toFixed(2)}‰`; // Show in per-mille for very small costs
  }
  return `$${cost.toFixed(4)}`;
}

/**
 * Calculate percentage savings
 */
export function calculateSavings(oldValue: number, newValue: number): {
  absolute: number;
  percentage: number;
} {
  const absolute = oldValue - newValue;
  const percentage = oldValue > 0 ? Math.round((absolute / oldValue) * 100) : 0;
  
  return { absolute, percentage };
}

/**
 * Validate JSON string
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean AI response (remove markdown formatting)
 */
export function cleanAIResponse(response: string): string {
  return response
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s*```.*$/gm, '')
    .trim();
}