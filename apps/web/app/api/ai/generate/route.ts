import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type = 'website' } = body

    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // TODO: Implement AI generation logic
    // This will be implemented in Task 2.1 and 2.2
    const mockResponse = {
      id: `site_${Date.now()}`,
      status: 'processing',
      prompt: prompt,
      type: type,
      createdAt: new Date().toISOString(),
      estimatedTime: 30, // seconds
      message: 'AI generation started. This will be fully implemented in Day 2 tasks.',
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Generation ID is required' },
      { status: 400 }
    )
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
}