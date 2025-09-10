'use client'

import { useState, useEffect } from 'react'
import { PricingTable } from '@/app/preview/[id]/components/RegistryComponents'

export default function DebugPreviewPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Test data from the API response
  const testData = {
    plans: [
      {
        name: "Starter",
        price: "29",
        period: "month",
        ctaText: "Start Free Trial",
        features: ["5 users", "10GB storage", "Basic support"],
        description: "Perfect for small teams"
      },
      {
        name: "Professional",
        price: "99",
        period: "month",
        ctaText: "Get Started",
        features: ["25 users", "100GB storage", "Priority support", "Advanced features"],
        description: "Best for growing businesses",
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "299",
        period: "month",
        ctaText: "Contact Sales",
        features: ["Unlimited users", "1TB storage", "24/7 support", "All features"],
        description: "For large organizations"
      }
    ],
    title: "Choose Your Plan",
    currency: "$",
    subtitle: "Flexible pricing for teams of all sizes"
  }

  useEffect(() => {
    try {
      setLoading(false)
    } catch (err) {
      console.error('❌ Component import error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Testing component imports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-red-800">Component Import Error</h1>
          <p className="text-red-600 max-w-md">{error}</p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
            <pre className="text-xs mt-2 p-4 bg-gray-200 rounded overflow-auto">
              {error}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Component Debug</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Component Import:</strong> ✅ Success
            </div>
            <div>
              <strong>Props Data:</strong> ✅ Available
            </div>
            <div>
              <strong>Plans Count:</strong> {testData.plans.length}
            </div>
            <div>
              <strong>Title:</strong> {testData.title}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">PricingTable Component Test</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <PricingTable {...testData} />
          </div>
        </div>
      </div>
    </div>
  )
}