'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'

interface SiteData {
  id: string
  name: string
  siteStructure: any
  metadata: any
}

interface PageProps {
  params: { id: string }
}

export default function PreviewPage({ params }: PageProps) {
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSiteData() {
      try {
        console.log('🔍 Fetching site data for:', params.id)
        
        // For now, since we're not storing in database, 
        // we need to fetch from the generation status endpoint
        const response = await fetch(`/api/ai/generate?id=${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Site not found')
            return
          }
          throw new Error(`Failed to fetch site: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Site data loaded:', data)
        
        setSiteData(data)
      } catch (err) {
        console.error('❌ Failed to load site:', err)
        setError(err instanceof Error ? err.message : 'Failed to load site')
      } finally {
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading site preview...</p>
        </div>
      </div>
    )
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">Site Not Found</h1>
          <p className="text-gray-600">{error || 'The requested site could not be found.'}</p>
          <a 
            href="/generate" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate New Site
          </a>
        </div>
      </div>
    )
  }

  // Simple preview rendering for generated sites
  const siteStructure = siteData.siteStructure
  const components = siteStructure?.pages?.[0]?.components

  return (
    <div className="min-h-screen">
      {/* Preview Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">{siteData.name || 'Generated Site'}</h1>
            <p className="text-sm text-gray-300">Preview Mode • Site ID: {params.id}</p>
          </div>
          <div className="flex space-x-3">
            <a 
              href={`/editor/${params.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Edit Site
            </a>
            <a 
              href="/generate"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Generate New
            </a>
          </div>
        </div>
      </div>

      {/* Site Content */}
      <div className="bg-white">
        {components ? (
          <SiteRenderer components={components} />
        ) : (
          <div className="max-w-4xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {siteStructure?.name || 'Generated Site'}
            </h2>
            <p className="text-gray-600 mb-8">
              Site generated successfully, but preview rendering is not yet implemented.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <pre className="text-left text-sm overflow-auto">
                {JSON.stringify(siteStructure, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple site renderer for Component Registry components
function SiteRenderer({ components }: { components: any }) {
  if (!components || !components.root) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-600">No components to render</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ComponentRenderer component={components.root} />
    </div>
  )
}

// Component renderer for individual components
function ComponentRenderer({ component }: { component: any }) {
  if (!component) return null

  const { componentId, type, props, children } = component

  // Render based on componentId from Component Registry
  switch (componentId) {
    case 'hero-split':
    case 'hero-centered':
      return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {props?.title || 'Welcome'}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {props?.subtitle || 'AI-generated website'}
            </p>
            {props?.ctaText && (
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {props.ctaText}
              </button>
            )}
          </div>
        </section>
      )

    case 'features-grid':
      return (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {props?.title || 'Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {props?.features?.map((feature: any, index: number) => (
                <div key={index} className="p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    default:
      // Render children if it's a container
      if (children && Array.isArray(children)) {
        return (
          <div>
            {children.map((child: any, index: number) => (
              <ComponentRenderer key={index} component={child} />
            ))}
          </div>
        )
      }
      
      return (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-gray-600">
            Component: {componentId || type || 'Unknown'}
          </p>
          {props && (
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(props, null, 2)}
            </pre>
          )}
        </div>
      )
  }
}