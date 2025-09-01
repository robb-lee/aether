/**
 * Cache Invalidation API Endpoint
 * 
 * Provides cache management capabilities for development and admin use.
 */

import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache, resetCacheStats } from '@/packages/ai-engine/lib/cache';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pattern, resetStats = false } = body;

    let deletedEntries = 0;
    
    // Invalidate cache entries
    if (pattern !== undefined) {
      deletedEntries = await invalidateCache(pattern || undefined);
    }
    
    // Reset statistics if requested
    if (resetStats) {
      await resetCacheStats();
    }

    return NextResponse.json({
      success: true,
      data: {
        deletedEntries,
        statsReset: resetStats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Cache API] Error invalidating cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to invalidate cache',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear all cache entries
  try {
    const deletedEntries = await invalidateCache();
    
    return NextResponse.json({
      success: true,
      data: {
        deletedEntries,
        message: 'All cache entries cleared',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Cache API] Error clearing cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        details: error.message,
      },
      { status: 500 }
    );
  }
}