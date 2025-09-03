'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { HeroSplit, FeaturesGrid, HeroCentered, HeaderNav, FooterSimple } from './components/RegistryComponents'
import { PreviewHeader } from './components/PreviewHeader'
import { DeviceFrame } from './components/DeviceFrame'
import { PreviewControls } from './components/PreviewControls'

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
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [zoomLevel, setZoomLevel] = useState<50 | 75 | 100 | 125>(100)

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
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Preview Header */}
      <PreviewHeader siteData={siteData} siteId={params.id} />

      {/* Main Preview Area */}
      <div className="relative">
        <DeviceFrame device={selectedDevice} zoom={zoomLevel}>
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
        </DeviceFrame>

        {/* Floating Preview Controls */}
        <PreviewControls
          siteId={params.id}
          onDeviceChange={setSelectedDevice}
          onZoomChange={setZoomLevel}
          selectedDevice={selectedDevice}
          zoomLevel={zoomLevel}
        />
      </div>
    </div>
  )
}

// Site renderer for Component Registry components
function SiteRenderer({ components }: { components: any }) {
  if (!components || !components.root) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-600">No components to render</p>
      </div>
    )
  }

  // If root component has children, render them directly
  if (components.root.children && Array.isArray(components.root.children)) {
    return (
      <div className="min-h-screen">
        {components.root.children.map((child: any, index: number) => (
          <ComponentRenderer key={child.id || index} component={child} />
        ))}
      </div>
    )
  }

  // Otherwise render the root component itself
  return (
    <div className="min-h-screen">
      <ComponentRenderer component={components.root} />
    </div>
  )
}

// Direct component renderer using imported components
function ComponentRenderer({ component }: { component: any }) {
  if (!component) return null

  const { componentId, props = {} } = component

  // Map componentId to actual imported components
  const componentMap = {
    'hero-split': HeroSplit,
    'hero-centered': HeroCentered, 
    'features-grid': FeaturesGrid,
    'header-nav': HeaderNav,
    'footer-simple': FooterSimple
  }

  const Component = componentMap[componentId as keyof typeof componentMap]

  if (!Component) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">Component Unavailable</h3>
        <p className="text-yellow-700 mb-4">Component "{componentId}" not found</p>
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Component ID:</strong> {componentId || 'Unknown'}
          </p>
          <details className="mt-2">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Show Props
            </summary>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(props, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  // Render the component with error boundary
  try {
    return <Component {...props} />
  } catch (renderError) {
    console.error('Component render error:', renderError)
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Render Error</h3>
        <p className="text-red-700">Failed to render {componentId}</p>
        <details className="mt-2">
          <summary className="text-sm font-medium text-red-700 cursor-pointer">
            Error Details
          </summary>
          <pre className="text-xs mt-2 p-2 bg-white rounded overflow-auto">
            {String(renderError)}
          </pre>
        </details>
      </div>
    )
  }
}