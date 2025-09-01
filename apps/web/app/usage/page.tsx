/**
 * Usage Dashboard Page
 * 
 * Displays LiteLLM usage tracking and cost estimation
 */

import SimpleUsageDashboard from '@/components/SimpleUsageDashboard';

export default function UsagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LiteLLM Usage & Cost Tracking
        </h1>
        <p className="text-gray-600">
          Monitor your AI usage, track costs per model, and manage quotas across all LiteLLM models.
        </p>
      </div>
      
      <SimpleUsageDashboard />
    </div>
  );
}