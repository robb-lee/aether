import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/sites/[id] - Get a specific site
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Fetch site from database
    const mockSite = {
      id,
      name: 'My Business Site',
      domain: 'mybusiness.aether.ai',
      status: 'published',
      components: {
        root: {
          type: 'page',
          props: {},
          children: [],
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockSite)
  } catch (error) {
    console.error('Error fetching site:', error)
    return NextResponse.json(
      { error: 'Site not found' },
      { status: 404 }
    )
  }
}

// PUT /api/sites/[id] - Update a site
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // TODO: Update site in database
    const updatedSite = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedSite)
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    )
  }
}

// DELETE /api/sites/[id] - Delete a site
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Delete site from database
    return NextResponse.json(
      { message: `Site ${id} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting site:', error)
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    )
  }
}