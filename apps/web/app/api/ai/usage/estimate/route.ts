/**
 * Cost Estimation API
 * 
 * Endpoint for estimating costs before making AI requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { estimateRequestCost } from '@/lib/cost-tracker-simple';

export const runtime = 'edge';

/**
 * POST /api/ai/usage/estimate - Estimate cost for a request
 */
export async function POST(request: NextRequest) {
  try {
    // For now, skip auth until Supabase is properly set up

    const body = await request.json();
    const { model, promptLength, expectedResponseLength = 500 } = body;

    if (!model || typeof promptLength !== 'number') {
      return NextResponse.json(
        { error: 'Model and promptLength are required' },
        { status: 400 }
      );
    }

    const estimatedCostCents = estimateRequestCost(model, promptLength, expectedResponseLength);
    
    // Mock quota check for now
    const remainingCents = 255; // $2.55 remaining from $5.00 limit
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