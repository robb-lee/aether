/**
 * Simple Usage Dashboard
 * 
 * Edge Runtime compatible usage dashboard with cost estimation
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@aether/ui';

interface UsageData {
  usage: {
    currentPeriod: string;
    currentPeriodCents: number;
    limit: string;
    limitCents: number;
    remaining: string;
    remainingCents: number;
    percentageUsed: number;
    daysUntilReset: number;
    tier: string;
  };
}

interface EstimationData {
  estimate: {
    model: string;
    promptLength: number;
    expectedResponseLength: number;
    estimatedCostCents: number;
    estimatedCost: string;
    tokensEstimated: number;
  };
  quota: {
    canAfford: boolean;
    remainingCents: number;
    remaining: string;
    currentUsage: string;
    limit: string;
    tier: string;
  };
}

export default function SimpleUsageDashboard() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [estimationData, setEstimationData] = useState<EstimationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cost estimation form
  const [estimateModel, setEstimateModel] = useState('claude-4-sonnet');
  const [promptLength, setPromptLength] = useState(100);
  const [responseLength, setResponseLength] = useState(500);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/usage/simple');
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }
      
      const data = await response.json();
      setUsageData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const estimateCost = async () => {
    try {
      const response = await fetch('/api/ai/usage/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: estimateModel,
          promptLength,
          expectedResponseLength: responseLength
        })
      });

      if (!response.ok) {
        throw new Error('Failed to estimate cost');
      }

      const data = await response.json();
      setEstimationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Estimation failed');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading usage data...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-red-500 p-4">
            Error: {error}
            <button 
              onClick={fetchUsageData} 
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!usageData) return null;

  const { usage } = usageData;

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">LiteLLM Usage Tracking - {usage.tier.toUpperCase()} Plan</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{usage.currentPeriod}</div>
              <div className="text-sm text-gray-500">Used This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{usage.remaining}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{usage.percentageUsed}%</div>
              <div className="text-sm text-gray-500">Quota Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{usage.daysUntilReset}</div>
              <div className="text-sm text-gray-500">Days Until Reset</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Usage Progress</span>
              <span>{usage.currentPeriod} / {usage.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  usage.percentageUsed > 90 ? 'bg-red-500' :
                  usage.percentageUsed > 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cost Estimator */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">LiteLLM Cost Estimator</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select 
                value={estimateModel}
                onChange={(e) => setEstimateModel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="claude-4-sonnet">Claude 4 Sonnet ($0.003/$0.015)</option>
                <option value="gpt-5-mini">GPT-5 Mini ($0.001/$0.002)</option>
                <option value="gpt-5">GPT-5 ($0.02/$0.04)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Length (chars)</label>
              <input
                type="number"
                value={promptLength}
                onChange={(e) => setPromptLength(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Characters in prompt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Response (chars)</label>
              <input
                type="number"
                value={responseLength}
                onChange={(e) => setResponseLength(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Expected response length"
              />
            </div>
          </div>
          
          <button
            onClick={estimateCost}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Estimate Cost with LiteLLM
          </button>

          {estimationData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Cost Estimation Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Estimated Cost</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {estimationData.estimate.estimatedCost}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Tokens</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {estimationData.estimate.tokensEstimated.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Can Afford</div>
                  <div className={`text-lg font-semibold ${estimationData.quota.canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    {estimationData.quota.canAfford ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Remaining quota: {estimationData.quota.remaining} / {estimationData.quota.limit}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Available Models</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">Claude 4 Sonnet</div>
                <div className="text-sm text-gray-600">Primary model for content & analysis</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$0.003 / $0.015</div>
                <div className="text-xs text-gray-500">per 1K tokens (in/out)</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">GPT-5 Mini</div>
                <div className="text-sm text-gray-600">Fast processing & optimization</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$0.001 / $0.002</div>
                <div className="text-xs text-gray-500">per 1K tokens (in/out)</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium">GPT-5</div>
                <div className="text-sm text-gray-600">Image generation & complex tasks</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">$0.02 / $0.04</div>
                <div className="text-xs text-gray-500">per 1K tokens (in/out)</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quota Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Subscription Tiers</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-blue-600">Free</div>
              <div className="text-2xl font-bold">$5.00</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-green-600">Starter</div>
              <div className="text-2xl font-bold">$50.00</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-purple-600">Pro</div>
              <div className="text-2xl font-bold">$200.00</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-orange-600">Business</div>
              <div className="text-2xl font-bold">Unlimited</div>
              <div className="text-sm text-gray-600">usage</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}