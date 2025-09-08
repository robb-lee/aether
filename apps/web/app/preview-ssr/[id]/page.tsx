import { notFound } from 'next/navigation'
import { ComponentRenderer } from '@/components/ComponentRenderer'
import { DesignKitProvider } from '@/app/preview/[id]/components/DesignKitProvider'

interface PageProps {
  params: { id: string }
  searchParams?: { iframe?: string; device?: string }
}

async function fetchSiteData(id: string) {
  try {
    // For server-side rendering, we need to make a server-side request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/ai/generate?id=${id}`, {
      cache: 'no-store' // Always fetch fresh data for preview
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch site: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch site data:', error)
    return null
  }
}

export default async function ServerSidePreviewPage({ params, searchParams }: PageProps) {
  const siteData = await fetchSiteData(params.id)
  
  if (!siteData) {
    notFound()
  }

  // Extract components using the same logic as client version
  const siteStructure = siteData.siteStructure
  const components = siteStructure?.pages?.[0]?.components || siteStructure
  const designKit = siteData.designKit || 'modern-saas'

  const isIframeMode = searchParams?.iframe === 'true'
  const deviceFromParams = searchParams?.device as 'desktop' | 'tablet' | 'mobile' | undefined

  if (!components || !components.root) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-yellow-800">No Components Found</h1>
          <p className="text-yellow-600">Site data loaded but no components structure found</p>
          <details className="text-left">
            <summary className="cursor-pointer">Show Site Data</summary>
            <pre className="text-xs mt-2 p-4 bg-gray-200 rounded overflow-auto max-h-64">
              {JSON.stringify(siteStructure, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  // Simple iframe rendering
  if (isIframeMode) {
    const deviceClasses = deviceFromParams ? {
      mobile: 'max-w-sm mx-auto',
      tablet: 'max-w-3xl mx-auto', 
      desktop: 'w-full'
    }[deviceFromParams] || 'w-full' : 'w-full'

    return (
      <div className="w-full min-h-screen">
        <DesignKitProvider kitId={designKit}>
          <div 
            className={`${deviceClasses} min-h-screen kit-${designKit}`} 
            data-design-kit={designKit}
            data-device={deviceFromParams}
          >
            {components.root.children && Array.isArray(components.root.children) ? (
              components.root.children.map((child: any, index: number) => (
                <ComponentRenderer 
                  key={child.id || index} 
                  component={child}
                  designKit={designKit}
                />
              ))
            ) : (
              <ComponentRenderer 
                component={components.root} 
                designKit={designKit}
              />
            )}
          </div>
        </DesignKitProvider>
      </div>
    )
  }

  // Full preview page rendering
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Site Preview</h1>
            <p className="text-sm text-gray-600">ID: {params.id}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">✅ Loaded successfully</span>
            <a 
              href="/generate" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate New
            </a>
          </div>
        </div>
      </div>

      <DesignKitProvider kitId={designKit}>
        <div className="relative">
          <div className="max-w-6xl mx-auto bg-white shadow-sm border-l border-r min-h-screen">
            {components.root.children && Array.isArray(components.root.children) ? (
              components.root.children.map((child: any, index: number) => (
                <ComponentRenderer 
                  key={child.id || index} 
                  component={child}
                  designKit={designKit}
                />
              ))
            ) : (
              <ComponentRenderer 
                component={components.root} 
                designKit={designKit}
              />
            )}
          </div>
        </div>
      </DesignKitProvider>
    </div>
  )
}