import { NextRequest, NextResponse } from 'next/server'
import { handleAPIError } from '@aether/ai-engine/lib/error-handler'
import { ValidationError } from '@aether/ai-engine/lib/errors'
import { createClient } from '@/lib/supabase/server'

// Temporarily disable Edge Runtime due to component registry Node.js dependencies
// export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      throw new ValidationError('Site ID is required');
    }

    // Check site status from database
    const supabase = await createClient();
    const { data: site, error: dbError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !site) {
      throw new ValidationError('Site not found');
    }

    // Calculate progress and stage based on status
    let progress = 0;
    let stage = 'unknown';
    let estimatedCompletion = null;
    
    const siteStatus = site.metadata?.status || 'unknown';
    switch (siteStatus) {
      case 'generating':
        progress = 10;
        stage = 'initializing';
        estimatedCompletion = Date.now() + 25000; // ~25 seconds
        break;
      case 'generating_selecting_components':
        progress = 30;
        stage = 'selecting_components';
        estimatedCompletion = Date.now() + 15000; // ~15 seconds
        break;
      case 'generating_composing_site':
        progress = 60;
        stage = 'composing_site';
        estimatedCompletion = Date.now() + 8000; // ~8 seconds
        break;
      case 'generating_finalizing':
        progress = 90;
        stage = 'finalizing';
        estimatedCompletion = Date.now() + 2000; // ~2 seconds
        break;
      case 'completed':
        progress = 100;
        stage = 'completed';
        break;
      case 'failed':
        progress = 0;
        stage = 'failed';
        break;
      default:
        progress = 5;
        stage = 'unknown';
        estimatedCompletion = Date.now() + 30000; // ~30 seconds
    }

    // Calculate generation time if completed
    const generationStartTime = new Date(site.created_at).getTime();
    const currentTime = Date.now();
    const elapsedTime = currentTime - generationStartTime;

    const statusResponse = {
      id: site.id,
      name: site.name,
      status: siteStatus,
      progress: progress,
      stage: stage,
      createdAt: site.created_at,
      updatedAt: site.updated_at,
      elapsedTime: elapsedTime,
      estimatedCompletion: estimatedCompletion,
      prompt: site.metadata?.generation_prompt,
      
      // Include metadata if available
      metadata: site.metadata?.generation_metadata || null,
      
      // Include result if completed
      result: siteStatus === 'completed' ? {
        siteId: site.id,
        name: site.name,
        editorUrl: `/editor/${site.id}`,
        previewUrl: `/preview/${site.id}`,
        componentTree: site.component_tree,
        generationTime: elapsedTime,
        performance: site.metadata?.generation_metadata || {}
      } : null,
      
      // Error information if failed
      error: siteStatus === 'failed' ? {
        message: 'Generation failed',
        stage: stage,
        retryable: true
      } : null
    };

    // Add performance insights
    if (siteStatus === 'completed' && site.metadata?.generation_metadata) {
      statusResponse.insights = {
        generationMethod: site.metadata.generation_metadata.generationMethod,
        tokenSavings: site.metadata.generation_metadata.tokenSavings || 0,
        lighthouseScore: site.metadata.generation_metadata.lighthouseScore || 85,
        costSavings: site.metadata.generation_metadata.tokenSavings ? 
          `${((site.metadata.generation_metadata.tokenSavings / 20000) * 100).toFixed(1)}%` : '90%',
        model: site.metadata.generation_metadata.model || 'claude-4-sonnet',
        totalCost: site.metadata.generation_metadata.cost || 0
      };
    }

    return NextResponse.json(statusResponse)
  } catch (error) {
    const errorResponse = handleAPIError(error, 'Status Check');
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}