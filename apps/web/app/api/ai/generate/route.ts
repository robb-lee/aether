import { NextRequest, NextResponse } from 'next/server'
import { handleAPIError } from '@aether/ai-engine/lib/error-handler'
import { ValidationError } from '@aether/ai-engine/lib/errors'

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