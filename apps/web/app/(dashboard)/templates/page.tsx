'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'

interface Template {
  id: string
  name: string
  category: string
  preview: string
  description: string
  metadata?: {
    performance?: {
      lighthouse: number
    }
    usage?: {
      successRate: number
    }
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Component Registry based templates
  const componentTemplates: Template[] = [
    { 
      id: 'hero-centered', 
      name: 'Centered Hero', 
      category: 'Business', 
      preview: '🏢',
      description: 'Perfect for product showcases and focused messaging',
      metadata: { performance: { lighthouse: 95 }, usage: { successRate: 0.89 } }
    },
    { 
      id: 'hero-split', 
      name: 'Split Layout', 
      category: 'Tech', 
      preview: '🚀',
      description: 'Ideal for SaaS and tech products needing feature explanation',
      metadata: { performance: { lighthouse: 92 }, usage: { successRate: 0.94 } }
    },
    { 
      id: 'hero-video-bg', 
      name: 'Video Background', 
      category: 'Creative', 
      preview: '🎨',
      description: 'Immersive storytelling for entertainment and lifestyle brands',
      metadata: { performance: { lighthouse: 75 }, usage: { successRate: 0.72 } }
    },
    { 
      id: 'features-grid', 
      name: 'Features Grid', 
      category: 'Business', 
      preview: '📊',
      description: 'Showcase multiple features with equal importance',
      metadata: { performance: { lighthouse: 93 }, usage: { successRate: 0.91 } }
    },
    { 
      id: 'ecommerce', 
      name: 'E-Commerce Store', 
      category: 'E-Commerce', 
      preview: '🛍️',
      description: 'Online store with product catalog and checkout'
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio', 
      category: 'Creative', 
      preview: '🎨',
      description: 'Showcase your creative work and projects'
    },
  ]

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      setTemplates(componentTemplates)
      setLoading(false)
    }, 500)
  }, [])

  const categories = ['All', 'Business', 'Tech', 'Creative', 'E-Commerce']
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a template to start with or let AI create from scratch
        </p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try selecting a different category or create from scratch
              </p>
              <Link href="/generate">
                <Button variant="gradient">
                  Create from Scratch
                </Button>
              </Link>
            </div>
          ) : (
            /* Templates Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-700 dark:to-gray-800 relative">
                    <div className="flex h-full items-center justify-center text-6xl">
                      {template.preview}
                    </div>
                    {template.metadata?.performance && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {template.metadata.performance.lighthouse}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {template.description}
                        </p>
                      </div>
                      
                      {template.metadata?.usage && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>⭐ {Math.round(template.metadata.usage.successRate * 100)}% success</span>
                        </div>
                      )}
                      
                      <Link href={`/generate?template=${template.id}`}>
                        <Button variant="gradient" size="sm" className="w-full">
                          Use This Template
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}