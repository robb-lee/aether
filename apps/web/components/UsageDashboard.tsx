/**
 * Usage Dashboard Component
 * 
 * Real-time usage tracking with model breakdown and quota management
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
  breakdown?: {
    byModel: Array<{
      model: string;
      requests: number;
      tokens: number;
      costCents: number;
      costFormatted: string;
      tokensFormatted: string;
      percentageOfTotal: number;
    }>;
    dailyUsage: Array<{
      date: string;
      costCents: number;
      costFormatted: string;
    }>;
    trend: {
      currentMonthCents: number;
      previousMonthCents: number;
      percentageChange: number;
      trending: 'up' | 'down' | 'stable';
      currentMonthFormatted: string;
      previousMonthFormatted: string;
    };
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

export default function UsageDashboard({ showDetailed = true }: { showDetailed?: boolean }) {
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
  }, [showDetailed]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/usage?detailed=${showDetailed}`);
      
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
      const response = await fetch('/api/ai/usage/estimate', {
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

  const { usage, breakdown } = usageData;

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Current Usage - {usage.tier.toUpperCase()} Plan</h3>
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
              <span>{usage.limit === 'Unlimited' ? 'Unlimited' : `${usage.currentPeriod} / ${usage.limit}`}</span>
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
          <h3 className="text-lg font-semibold">Cost Estimator</h3>
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
                <option value="claude-4-sonnet">Claude 4 Sonnet</option>
                <option value="gpt-5-mini">GPT-5 Mini</option>
                <option value="gpt-5">GPT-5</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Length</label>
              <input
                type="number"
                value={promptLength}
                onChange={(e) => setPromptLength(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Characters in prompt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Response</label>
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
            Estimate Cost
          </button>

          {estimationData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Estimated Cost</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {estimationData.estimate.estimatedCost}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Can Afford</div>
                  <div className={`text-lg font-semibold ${estimationData.quota.canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    {estimationData.quota.canAfford ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Model Breakdown - Only show if detailed view */}
      {showDetailed && breakdown && (
        <>
          {/* Model Usage Breakdown */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Usage by Model</h3>
            </CardHeader>
            <CardBody>
              {breakdown.byModel.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No usage data for this month
                </div>
              ) : (
                <div className="space-y-3">
                  {breakdown.byModel.map((model) => (
                    <div key={model.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{model.model}</div>
                        <div className="text-sm text-gray-600">
                          {model.requests} requests • {model.tokensFormatted}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{model.costFormatted}</div>
                        <div className="text-sm text-gray-600">{model.percentageOfTotal}% of total</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Usage Trend */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Usage Trend</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{breakdown.trend.currentMonthFormatted}</div>
                  <div className="text-sm text-gray-500">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{breakdown.trend.previousMonthFormatted}</div>
                  <div className="text-sm text-gray-500">Last Month</div>
                </div>
              </div>
              
              {breakdown.trend.percentageChange !== 0 && (
                <div className="mt-4 text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    breakdown.trend.trending === 'up' ? 'bg-red-100 text-red-800' :
                    breakdown.trend.trending === 'down' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {breakdown.trend.trending === 'up' ? '↗️' : breakdown.trend.trending === 'down' ? '↘️' : '→'}
                    {Math.abs(breakdown.trend.percentageChange)}% {breakdown.trend.trending === 'up' ? 'increase' : 'decrease'}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Daily Usage Chart */}
          {breakdown.dailyUsage.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Daily Usage (This Month)</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {breakdown.dailyUsage.slice(-7).map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((day.costCents / Math.max(...breakdown.dailyUsage.map(d => d.costCents))) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <div className="text-sm font-medium min-w-[60px] text-right">
                          {day.costFormatted}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchUsageData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 Refresh Data
            </button>
            
            {usage.tier !== 'business' && usage.percentageUsed > 80 && (
              <button
                onClick={() => window.open('/pricing', '_blank')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                ⬆️ Upgrade Plan
              </button>
            )}
            
            <button
              onClick={() => window.open('/usage/history', '_blank')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              📊 View History
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * Simple usage widget for embedding in other components
 */
export function UsageWidget() {
  const [usage, setUsage] = useState<UsageData['usage'] | null>(null);

  useEffect(() => {
    const fetchQuickUsage = async () => {
      try {
        const response = await fetch('/api/ai/usage');
        if (response.ok) {
          const data = await response.json();
          setUsage(data.usage);
        }
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      }
    };
    
    fetchQuickUsage();
  }, []);

  if (!usage) return null;

  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-lg">
      <div className="text-sm">
        <span className="font-medium">{usage.currentPeriod}</span>
        {usage.limitCents > 0 && <span className="text-gray-500"> / {usage.limit}</span>}
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-300 ${
            usage.percentageUsed > 90 ? 'bg-red-500' :
            usage.percentageUsed > 75 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {usage.daysUntilReset}d left
      </div>
    </div>
  );
}