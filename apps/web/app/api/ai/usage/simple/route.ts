/**
 * Simplified Usage API
 * 
 * Edge Runtime compatible usage tracking endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { estimateRequestCost, USER_QUOTAS } from '@/lib/cost-tracker-simple';

// export const runtime = 'edge'; // Temporarily disabled due to webpack issue

/**
 * GET /api/ai/usage/simple - Get basic usage stats (mock for now)
 */
export async function GET(_request: NextRequest) {
  try {
    // For now, return mock data since we don't have auth set up
    const mockUsage = {
      usage: {
        currentPeriod: '$2.45',
        currentPeriodCents: 245,
        limit: '$5.00',
        limitCents: 500,
        remaining: '$2.55',
        remainingCents: 255,
        percentageUsed: 49,
        daysUntilReset: 12,
        tier: 'free'
      }
    };

    return NextResponse.json(mockUsage);

  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/usage/simple - Estimate cost for a request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, promptLength, expectedResponseLength = 500 } = body;

    if (!model || typeof promptLength !== 'number') {
      return NextResponse.json(
        { error: 'Model and promptLength are required' },
        { status: 400 }
      );
    }

    const estimatedCostCents = estimateRequestCost(model, promptLength, expectedResponseLength);
    
    // Mock quota data for free tier
    const remainingCents = USER_QUOTAS.free.monthlyCostCents - 245; // Mock current usage
    const canAfford = remainingCents >= estimatedCostCents;

    return NextResponse.json({
      estimate: {
        model,
        promptLength,
        expectedResponseLength,
        estimatedCostCents,
        estimatedCost: `$${(estimatedCostCents / 100).toFixed(3)}`,
        tokensEstimated: Math.ceil((promptLength + expectedResponseLength) / 4)
      },
      quota: {
        canAfford,
        remainingCents,
        remaining: `$${(remainingCents / 100).toFixed(2)}`,
        currentUsage: '$2.45',
        limit: '$5.00',
        tier: 'free'
      }
    });

  } catch (error) {
    console.error('Error estimating cost:', error);
    return NextResponse.json(
      { error: 'Failed to estimate cost' },
      { status: 500 }
    );
  }
}
