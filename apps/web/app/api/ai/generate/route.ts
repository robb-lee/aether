import { NextRequest, NextResponse } from 'next/server'
import { handleAPIError } from '@aether/ai-engine/lib/error-handler'
import { ValidationError } from '@aether/ai-engine/lib/errors'
import { generateSiteStructure } from '@aether/ai-engine/generators/site-generator'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type = 'website' } = body

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

    // Generate site structure with AI
    console.log('🚀 Starting AI site generation for:', prompt);
    
    const siteStructure = await generateSiteStructure(prompt, {
      streaming: false,
      onProgress: (progress) => {
        console.log('📊 Generation progress:', progress);
      }
    });

    // Create unique site ID
    const siteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in database
    const supabase = createClient();
    const { data: site, error: dbError } = await supabase
      .from('sites')
      .insert({
        id: siteId,
        name: siteStructure.name || 'Generated Site',
        component_tree: siteStructure,
        status: 'completed',
        generation_prompt: prompt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(`Failed to save site: ${dbError.message}`);
    }

    const response = {
      id: siteId,
      status: 'completed',
      prompt: prompt,
      type: type,
      createdAt: site.created_at,
      siteStructure: siteStructure,
      previewUrl: `/preview/${siteId}`,
      editorUrl: `/editor/${siteId}`,
      message: '✅ Site generated successfully with AI!',
    };

    console.log('✅ Site generation completed:', siteId);
    return NextResponse.json(response)
  } catch (error) {
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

    // TODO: Implement status checking logic
    const mockStatus = {
      id: id,
      status: 'completed',
      progress: 100,
      result: {
        siteId: id,
        url: `/editor/${id}`,
        previewUrl: `https://preview.aether.ai/${id}`,
      },
    }

    return NextResponse.json(mockStatus)
  } catch (error) {
    const errorResponse = handleAPIError(error, 'Status Check');
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}