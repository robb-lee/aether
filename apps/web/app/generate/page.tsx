'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '../../components/navigation/header'

interface Template {
  id: string
  name: string
  category: string
  preview: string
  description: string
}

const mockTemplates: Template[] = [
  { id: 'business', name: 'Business Landing', category: 'Business', preview: '🏢', description: 'Professional business website' },
  { id: 'ecommerce', name: 'E-Commerce Store', category: 'E-Commerce', preview: '🛍️', description: 'Online store with product catalog' },
  { id: 'portfolio', name: 'Portfolio', category: 'Creative', preview: '🎨', description: 'Showcase your creative work' },
  { id: 'saas', name: 'SaaS Product', category: 'Tech', preview: '🚀', description: 'Software as a Service landing' },
  { id: 'restaurant', name: 'Restaurant', category: 'Food', preview: '🍽️', description: 'Restaurant menu and booking' },
  { id: 'blog', name: 'Blog', category: 'Content', preview: '📝', description: 'Content publishing platform' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for template parameter from URL
  useEffect(() => {
    const templateParam = searchParams.get('template')
    if (templateParam) {
      setSelectedTemplate(templateParam)
    }
  }, [searchParams])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProgress(0)
    setStage('initializing')
    setError(null)

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Starting generation for prompt:', prompt.trim())
      }
      
      // Start generation
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          template: selectedTemplate,
          streaming: false
        })
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('📡 API response status:', response.status)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ API error:', errorData)
        }
        throw new Error(errorData.error || `API request failed: ${response.status}`)
      }

      const result = await response.json()
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Generation response:', result)
      }
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      if (result.id) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Starting progress polling for site:', result.id)
        }
        // Poll for progress
        const checkProgress = async () => {
          try {
            const statusResponse = await fetch(`/api/ai/generate?id=${result.id}`)
            if (!statusResponse.ok) {
              throw new Error(`Status check failed: ${statusResponse.status}`)
            }
            
            const status = await statusResponse.json()
            if (process.env.NODE_ENV === 'development') {
              console.log('📊 Progress update:', status)
            }
            
            setProgress(status.progress || 0)
            setStage(status.stage || 'processing')
            
            if (status.status === 'completed') {
              if (process.env.NODE_ENV === 'development') {
                console.log('🎉 Generation completed! Redirecting to preview...')
              }
              router.push(`/preview/${result.id}`)
            } else if (status.status === 'failed') {
              throw new Error('Site generation failed')
            } else {
              setTimeout(checkProgress, 1000)
            }
          } catch (statusError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ Status check error:', statusError)
            }
            throw statusError
          }
        }
        
        checkProgress()
      } else {
        throw new Error('No site ID returned from generation')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Generation error:', error)
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      setIsGenerating(false)
      setProgress(0)
      setStage('')
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl animate-pulse">🚀</div>
            <h1 className="text-3xl font-bold text-white">
              Creating Your Website
            </h1>
            <p className="text-gray-300">
              AI is generating your professional website...
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 capitalize">
              {stage.replace('_', ' ')} • {progress}%
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            This usually takes 15-30 seconds
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Create Your <span className="ai-gradient-text">Website</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Describe your website and let AI build it in 30 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prompt Input */}
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Describe Your Website
                </h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a modern SaaS landing page for TaskFlow, a project management tool that helps teams collaborate better. Include pricing, features, and testimonials."
                  className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={5000}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Be specific about your business and target audience</span>
                  <span>{prompt.length}/5000</span>
                </div>
              </div>

              <div className="glass p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Choose a Starting Point
                </h2>
                <p className="text-gray-300 text-sm">
                  Optional: Select a template to customize, or let AI create from scratch
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate === null
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-3xl mb-2">✨</div>
                    <div className="text-white font-medium">From Scratch</div>
                    <div className="text-gray-400 text-xs">AI creates everything</div>
                  </button>
                  
                  {mockTemplates.slice(0, 5).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-2xl mb-2">{template.preview}</div>
                      <div className="text-white font-medium text-sm">{template.name}</div>
                      <div className="text-gray-400 text-xs">{template.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview & Action */}
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  What You&apos;ll Get
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">✅</div>
                    <span className="text-gray-300">Professional design in 30 seconds</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">✅</div>
                    <span className="text-gray-300">Mobile-responsive layout</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">✅</div>
                    <span className="text-gray-300">SEO-optimized content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">✅</div>
                    <span className="text-gray-300">Visual editor for customization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">✅</div>
                    <span className="text-gray-300">One-click deployment</span>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Ready to Create?
                </h2>
                
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-400">❌</span>
                      <span className="text-red-300 font-medium">Generation Failed</span>
                    </div>
                    <p className="text-red-200 text-sm mt-2">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-300 hover:text-red-100 text-sm underline mt-2"
                    >
                      Try again
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || prompt.length < 10 || isGenerating}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isGenerating
                    ? '🔄 Generating...'
                    : prompt.length < 10 
                    ? `Add ${10 - prompt.length} more characters`
                    : '🚀 Generate My Website'
                  }
                </button>
                
                <div className="text-center text-xs text-gray-500">
                  Generation typically takes 15-30 seconds
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}