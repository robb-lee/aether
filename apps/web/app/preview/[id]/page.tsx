'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { ComponentRenderer } from '@/components/ComponentRenderer'
import { PreviewHeader } from './components/PreviewHeader'
import { DeviceFrame } from './components/DeviceFrame'
import { PreviewControls } from './components/PreviewControls'
import { DesignKitProvider } from './components/DesignKitProvider'

interface SiteData {
  id: string
  name: string
  siteStructure: any
  metadata: any
  designKit?: string  // Design kit applied to this site
}

interface PageProps {
  params: { id: string }
  searchParams?: { iframe?: string; device?: string }
}

export default function PreviewPage({ params, searchParams }: PageProps) {
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [zoomLevel, setZoomLevel] = useState<50 | 75 | 100 | 125>(100)
  
  // Check if this is iframe mode
  const isIframeMode = searchParams?.iframe === 'true'
  const deviceFromParams = searchParams?.device as 'desktop' | 'tablet' | 'mobile' | undefined

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
  const components = siteStructure?.pages?.[0]?.components || siteStructure
  const designKit = siteData.designKit || 'modern-saas'  // Default kit

  // If iframe mode, render directly without frame wrapper
  if (isIframeMode) {
    return (
      <div className="w-full min-h-screen">
        <DesignKitProvider kitId={designKit}>
          {components ? (
            <SiteRenderer components={components} designKit={designKit} isIframe={true} device={deviceFromParams} />
          ) : (
            <div className="w-full p-4 text-center">
              <p className="text-gray-600">No components to render</p>
            </div>
          )}
        </DesignKitProvider>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Preview Header */}
      <PreviewHeader siteData={siteData} siteId={params.id} />

      {/* Main Preview Area with Design Kit */}
      <DesignKitProvider kitId={designKit}>
        <div className="relative">
          <DeviceFrame device={selectedDevice} zoom={zoomLevel}>
            {components ? (
              <SiteRenderer components={components} designKit={designKit} />
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
      </DesignKitProvider>
    </div>
  )
}

// Site renderer for Component Registry components with Design Kit support
function SiteRenderer({ 
  components, 
  designKit, 
  isIframe = false, 
  device 
}: { 
  components: any; 
  designKit: string; 
  isIframe?: boolean; 
  device?: string 
}) {
  if (!components || !components.root) {
    return (
      <div className="w-full p-4 sm:p-8 text-center">
        <p className="text-gray-600">No components to render</p>
      </div>
    )
  }

  // Add device-specific viewport simulation for iframe mode
  const deviceClasses = device ? {
    mobile: 'max-w-sm mx-auto',
    tablet: 'max-w-3xl mx-auto', 
    desktop: 'w-full'
  }[device] || 'w-full' : 'w-full';

  // If root component has children, render them directly
  if (components.root.children && Array.isArray(components.root.children)) {
    return (
      <div 
        className={`${deviceClasses} min-h-screen kit-${designKit}`} 
        data-design-kit={designKit}
        data-device={device}
        style={isIframe ? { 
          fontSize: device === 'mobile' ? '14px' : '16px',
          width: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%'
        } : {}}
      >
        {components.root.children.map((child: any, index: number) => (
          <ComponentRenderer 
            key={child.id || index} 
            component={child}
            designKit={designKit}
          />
        ))}
      </div>
    )
  }

  // Otherwise render the root component itself
  return (
    <div 
      className={`${deviceClasses} min-h-screen kit-${designKit}`} 
      data-design-kit={designKit}
      data-device={device}
      style={isIframe ? { 
        fontSize: device === 'mobile' ? '14px' : '16px',
        width: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%'
      } : {}}
    >
      <ComponentRenderer 
        component={components.root} 
        designKit={designKit}
      />
    </div>
  )
}