'use client'

import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Header } from '../components/navigation/header'

export default function HomePage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
        <div className="relative z-10 text-center space-y-8 p-24">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Welcome to{' '}
              <span className="ai-gradient-text">Aether</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              AI-powered website builder that creates professional websites in 30 seconds
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button variant="gradient" size="lg">
                Get Started
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={scrollToFeatures}>
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Choose <span className="ai-gradient-text">Aether</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of web development with AI-powered tools designed for speed, creativity, and professional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass p-8 rounded-xl space-y-4 hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-white">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">Generate complete websites in under 30 seconds with our advanced AI engine and optimized component system.</p>
            </div>
            <div className="glass p-8 rounded-xl space-y-4 hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold text-white">Visual Editor</h3>
              <p className="text-gray-300 leading-relaxed">Drag-and-drop interface for easy customization. No coding required - make changes visually and see results instantly.</p>
            </div>
            <div className="glass p-8 rounded-xl space-y-4 hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold text-white">Instant Deploy</h3>
              <p className="text-gray-300 leading-relaxed">One-click deployment to production with custom domains. Your website goes live in seconds, not hours.</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/generate">
              <Button variant="gradient" size="lg">
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}