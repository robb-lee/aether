import { NextRequest, NextResponse } from 'next/server'

// Simple test endpoint to verify the pipeline structure works
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type = 'website', preferences: _preferences = {} } = body

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length < 10) {
      return NextResponse.json({ error: 'Prompt must be at least 10 characters long' }, { status: 400 });
    }

    // Create mock site ID
    const siteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate the generation pipeline
    const mockResponse = {
      id: siteId,
      status: 'completed',
      prompt: prompt,
      type: type,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      siteStructure: {
        id: siteId,
        name: 'Mock Generated Site',
        pages: [{
          id: 'page_home',
          name: 'Home',
          path: '/',
          components: {
            root: {
              id: 'root',
              type: 'page',
              props: {},
              children: [{
                id: 'hero_1',
                type: 'hero',
                props: {
                  title: 'Welcome to Your New Site',
                  subtitle: 'Generated in under 30 seconds'
                }
              }]
            }
          }
        }]
      },
      previewUrl: `/preview/${siteId}`,
      editorUrl: `/editor/${siteId}`,
      metadata: {
        generationMethod: 'mock',
        tokenSavings: 18500,
        lighthouse: 95,
        duration: 1200,
        model: 'mock-model',
        cost: 0.001
      },
      message: '✅ Mock site generated successfully for testing!',
    };

    console.log(`✅ Mock generation completed: ${siteId}`);
    return NextResponse.json(mockResponse);
    
  } catch (error) {
    console.error('❌ Test API error:', error);
    return NextResponse.json(
      { error: 'Test generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
  }

  const mockStatus = {
    id: id,
    name: 'Mock Site',
    status: 'completed',
    progress: 100,
    stage: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    elapsedTime: 1200,
    result: {
      siteId: id,
      editorUrl: `/editor/${id}`,
      previewUrl: `/preview/${id}`,
      metadata: {
        generationMethod: 'mock',
        lighthouse: 95,
        tokenSavings: 18500
      }
    }
  };

  return NextResponse.json(mockStatus);
}
