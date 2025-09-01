/**
 * Cache Statistics API Endpoint
 * 
 * Provides real-time cache performance metrics and health status.
 */

import { NextResponse } from 'next/server';
import { getCacheDashboard, getCacheEfficiencyMetrics } from '@/lib/cache-stats';

export const runtime = 'edge';

export async function GET() {
  try {
    const [dashboard, efficiency] = await Promise.all([
      getCacheDashboard(),
      getCacheEfficiencyMetrics(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        dashboard,
        efficiency,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Cache API] Error getting stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve cache statistics',
        details: error.message,
      },
      { status: 500 }
    );
  }
}