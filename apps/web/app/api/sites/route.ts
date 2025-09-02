import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/sites - List all sites for a user
export async function GET(_request: NextRequest) {
  try {
    // TODO: Implement authentication and fetch user's sites from database
    const mockSites = [
      {
        id: 'site_1',
        name: 'My Business Site',
        domain: 'mybusiness.aether.ai',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ sites: mockSites })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

// POST /api/sites - Create a new site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, template, prompt: _prompt } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      )
    }

    // TODO: Implement site creation logic
    const newSite = {
      id: `site_${Date.now()}`,
      name,
      template: template || 'blank',
      domain: `${name.toLowerCase().replace(/\s+/g, '-')}.aether.ai`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newSite, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
