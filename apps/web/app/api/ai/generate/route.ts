import { NextRequest, NextResponse } from 'next/server'
import { handleAPIError } from '@aether/ai-engine/lib/error-handler'
import { ValidationError } from '@aether/ai-engine/lib/errors'
import { generateSiteComplete, extractContextFromPrompt } from '@aether/ai-engine/generators/site-generator'
import { createClient } from '@/lib/supabase/server'

// Temporarily disable Edge Runtime due to component registry Node.js dependencies
// export const runtime = 'edge'

export async function POST(request: NextRequest) {
  let siteId: string | null = null;
  
  try {
    const body = await request.json()
    const { prompt, type = 'website', preferences = {}, streaming = false } = body

    // Validate input
    if (!prompt) {
      throw new ValidationError('Prompt is required');
    }

    if (prompt.length < 10) {
      throw new ValidationError('Prompt must be at least 10 characters long');
    }

    if (prompt.length > 5000) {
      throw new ValidationError('Prompt cannot exceed 5000 characters');
    }

    // Create unique site ID
    siteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize database record with 'generating' status
    const supabase = createClient();
    const { error: initError } = await supabase
      .from('sites')
      .insert({
        id: siteId,
        name: 'Generating...',
        component_tree: null,
        status: 'generating',
        generation_prompt: prompt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (initError) {
      console.error('❌ Database initialization error:', initError);
      throw new Error(`Failed to initialize site: ${initError.message}`);
    }

    // Extract context from prompt for better component selection
    const context = extractContextFromPrompt(prompt);
    console.log('🎯 Extracted context:', context);

    // Progress tracking
    let generationProgress = 0;
    const onProgress = async (progress: any) => {
      generationProgress = Math.min(generationProgress + 10, 90);
      console.log('📊 Generation progress:', progress);
      
      // Update database with progress
      await supabase
        .from('sites')
        .update({ 
          status: `generating_${progress.stage || 'unknown'}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId);
    };

    console.log('🚀 Starting complete AI site generation pipeline for:', prompt);
    
    // Generate site using complete pipeline with Component Registry
    // Set timeout for 30-second response requirement
    const generateWithTimeout = Promise.race([
      generateSiteComplete(prompt, {
        context: { ...context, ...preferences },
        streaming: streaming,
        onProgress: onProgress,
        model: preferences.model
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Generation timeout after 30 seconds')), 30000)
      )
    ]);

    const siteResult = await generateWithTimeout;

    // Update database with completed site
    const { data: site, error: dbError } = await supabase
      .from('sites')
      .update({
        name: siteResult.name || siteResult.title || 'Generated Site',
        component_tree: siteResult,
        status: 'completed',
        generation_metadata: {
          generationMethod: siteResult.metadata?.generationMethod || 'registry',
          tokenSavings: siteResult.metadata?.performance?.tokenSavings || 0,
          lighthouseScore: siteResult.metadata?.performance?.estimatedLighthouse || 85,
          generationTime: siteResult.metadata?.duration || 0,
          model: siteResult.metadata?.model,
          cost: siteResult.metadata?.cost || 0
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId)
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database update error:', dbError);
      throw new Error(`Failed to save generated site: ${dbError.message}`);
    }

    const response = {
      id: siteId,
      status: 'completed',
      prompt: prompt,
      type: type,
      createdAt: site.created_at,
      completedAt: site.updated_at,
      siteStructure: siteResult,
      previewUrl: `/preview/${siteId}`,
      editorUrl: `/editor/${siteId}`,
      metadata: {
        generationMethod: siteResult.metadata?.generationMethod || 'registry',
        tokenSavings: siteResult.metadata?.performance?.tokenSavings || 0,
        lighthouse: siteResult.metadata?.performance?.estimatedLighthouse || 85,
        duration: siteResult.metadata?.duration || 0,
        model: siteResult.metadata?.model,
        cost: siteResult.metadata?.cost || 0
      },
      message: '✅ Site generated successfully with Component Registry!',
    };

    console.log(`✅ Site generation completed: ${siteId} (${response.metadata.duration}ms)`);
    console.log(`📊 Performance: ${response.metadata.lighthouse} Lighthouse score`);
    console.log(`💾 Token savings: ${response.metadata.tokenSavings} tokens`);
    
    return NextResponse.json(response)
  } catch (error) {
    // Handle timeout specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      // Update site status to failed
      const supabase = createClient();
      await supabase
        .from('sites')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId!);
    }
    
    const errorResponse = handleAPIError(error, 'AI Generation');
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      throw new ValidationError('Generation ID is required');
    }

    // Check site status from database
    const supabase = createClient();
    const { data: site, error: dbError } = await supabase
      .from('sites')
      .select('id, name, status, generation_metadata, created_at, updated_at')
      .eq('id', id)
      .single();

    if (dbError || !site) {
      throw new ValidationError('Site not found');
    }

    // Calculate progress based on status
    let progress = 0;
    let stage = 'unknown';
    
    switch (site.status) {
      case 'generating':
        progress = 10;
        stage = 'initializing';
        break;
      case 'generating_selecting_components':
        progress = 30;
        stage = 'selecting_components';
        break;
      case 'generating_composing_site':
        progress = 60;
        stage = 'composing_site';
        break;
      case 'generating_finalizing':
        progress = 90;
        stage = 'finalizing';
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
    }

    const statusResponse = {
      id: site.id,
      name: site.name,
      status: site.status,
      progress: progress,
      stage: stage,
      createdAt: site.created_at,
      updatedAt: site.updated_at,
      result: site.status === 'completed' ? {
        siteId: site.id,
        editorUrl: `/editor/${site.id}`,
        previewUrl: `/preview/${site.id}`,
        metadata: site.generation_metadata
      } : null,
    };

    return NextResponse.json(statusResponse)
  } catch (error) {
    const errorResponse = handleAPIError(error, 'Status Check');
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}