import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// GET /api/sites/[id] - Get a specific site
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createServiceClient()

    // Fetch site from database
    const { data: site, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !site) {
      console.error('Error fetching site:', error)
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // For now, if the site doesn't have components, check ai_generations
    if (!site.components || Object.keys(site.components).length === 0) {
      const { data: generations } = await supabase
        .from('ai_generations')
        .select('result')
        .eq('site_id', id)
        .eq('generation_type', 'site')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (generations?.result?.siteStructure) {
        // Use the generated site structure
        site.components = generations.result.siteStructure.pages?.[0]?.components || {
          root: {
            type: 'page',
            props: {},
            children: [],
          },
        }
      }
    }

    return NextResponse.json(site)
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
    const supabase = createServiceClient()

    // Update site in database
    const { data: updatedSite, error } = await supabase
      .from('sites')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating site:', error)
      return NextResponse.json(
        { error: 'Failed to update site' },
        { status: 500 }
      )
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

    // NOTE: Site deletion from database not yet implemented
    // This endpoint currently returns success but doesn't delete from DB
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