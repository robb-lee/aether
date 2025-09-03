import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// GET /api/sites - List all sites
export async function GET(_request: NextRequest) {
  try {
    const supabase = createServiceClient()

    // Fetch all sites from database
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sites:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sites' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sites: sites || [] })
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
    const { name, template, prompt } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Create new site in database
    const newSite = {
      name,
      slug: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      description: prompt || '',
      status: 'draft' as const,
      components: { root: { type: 'page', props: {}, children: [] } },
      theme: {},
      seo_metadata: {},
      template_id: null,
      deployment_url: null,
      preview_url: null,
    }

    const { data: site, error } = await supabase
      .from('sites')
      .insert(newSite)
      .select()
      .single()

    if (error) {
      console.error('Error creating site:', error)
      return NextResponse.json(
        { error: 'Failed to create site' },
        { status: 500 }
      )
    }

    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
