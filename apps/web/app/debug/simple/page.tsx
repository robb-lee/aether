'use client'

import { useState, useEffect } from 'react'

// Simple inline component to test basic functionality
function SimplePricingTable({ plans, title }: { plans: any[], title: string }) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-lg border-2 p-6 ${
                plan.highlighted 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200'
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="flex items-baseline justify-center mb-6">
                <span className="text-4xl font-bold">$</span>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 ml-1">/{plan.period || 'month'}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.ctaText || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SimpleDebugPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 Fetching data from API...')
        
        const response = await fetch('/api/ai/generate?id=fe6c6ac4-5c6c-409d-b5c0-d798b187f860')
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()
        console.log('✅ API Response received:', result)
        
        setData(result)
        setLoading(false)
      } catch (err) {
        console.error('❌ Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading data from API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-red-800">API Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!data?.siteStructure?.pages?.[0]?.components?.root?.children) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-yellow-800">No Components Found</h1>
          <p className="text-yellow-600">Expected component structure not found in API response</p>
          <details className="text-left max-w-md">
            <summary className="cursor-pointer">Show API Response</summary>
            <pre className="text-xs mt-2 p-4 bg-gray-200 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  // Extract the pricing table component data
  const components = data.siteStructure.pages[0].components.root.children
  const pricingComponent = components.find((comp: any) => comp.componentId === 'pricing-table')

  if (!pricingComponent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-blue-800">No Pricing Component</h1>
          <p className="text-blue-600">Found {components.length} components but no pricing table</p>
          <div className="text-sm text-gray-600">
            Available: {components.map((c: any) => c.componentId || c.type).join(', ')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Simple Preview Test</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>API Status:</strong> ✅ Success</div>
            <div><strong>Components Found:</strong> {components.length}</div>
            <div><strong>Pricing Component:</strong> ✅ Found</div>
            <div><strong>Plans Count:</strong> {pricingComponent.props.plans?.length || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <SimplePricingTable 
            plans={pricingComponent.props.plans || []}
            title={pricingComponent.props.title || 'Pricing'}
          />
        </div>
      </div>
    </div>
  )
}