'use client';
import React, { useState, useEffect } from 'react';
import { designKits, getKitCSSVariables } from '@aether/component-registry/design-system';

// Simple inline components for visual showcase

// 1. Header Components
function HeaderSimpleDemo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900">Aether</div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium">Sign In</button>
            <button 
              className="text-white px-4 py-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--primary, #6366f1)',
                borderRadius: 'var(--radius, 0.5rem)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-700, #4f46e5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary, #6366f1)';
              }}
            >
              Get Started
            </button>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </div>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function NavMegaMenuDemo() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900">Enterprise</div>
          
          <div className="hidden lg:flex space-x-8">
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span>Products</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
                  <div className="grid grid-cols-2 gap-4 p-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Platform</h3>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Website Builder</a>
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">E-commerce</a>
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Analytics</a>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Tools</h3>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">API</a>
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Integrations</a>
                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Developer Tools</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Solutions</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Resources</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600">🔍</button>
            <button className="text-gray-700 hover:text-blue-600">🌐 EN</button>
            <button 
              className="text-white px-6 py-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--primary, #6366f1)',
                borderRadius: 'var(--radius, 0.5rem)'
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// 2. Additional Hero Components  
function HeroVideoBgDemo() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, color-mix(in oklab, var(--primary) 80%, black), color-mix(in oklab, var(--secondary) 80%, black))'
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative flex items-center justify-center min-h-screen px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'color-mix(in oklab, var(--primary) 70%, white)' }}
          >
            Revolutionary Platform
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Experience the Future
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Immerse yourself in next-generation technology that transforms the way you work and connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              className="px-8 py-4 font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background)';
              }}
            >
              Explore Now
            </button>
            <button 
              className="border-2 text-white px-8 py-4 font-semibold transition-colors"
              style={{
                borderColor: 'white',
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Learn More
            </button>
          </div>
          
          <div className="mt-12">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-sm opacity-75">Video Background Placeholder</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function HeroEnterpriseDemo() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-blue-300 font-medium text-sm uppercase tracking-wide mb-4">
              Built for Scale
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Enterprise-Grade Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Comprehensive platform designed for large organizations with advanced security, compliance, and integration capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
              className="text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--primary, #6366f1)',
                borderRadius: 'var(--radius, 0.5rem)'
              }}
            >
              Contact Sales
            </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                View Pricing
              </button>
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>SOC2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-semibold mb-2">Trusted by Leading Companies</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded p-3 text-center">
                  <div className="text-2xl">🏢</div>
                  <div className="text-xs mt-1">Microsoft</div>
                </div>
                <div className="bg-white/20 rounded p-3 text-center">
                  <div className="text-2xl">🔍</div>
                  <div className="text-xs mt-1">Google</div>
                </div>
                <div className="bg-white/20 rounded p-3 text-center">
                  <div className="text-2xl">📦</div>
                  <div className="text-xs mt-1">Amazon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCenteredDemo() {
  return (
    <section 
      className="relative min-h-screen text-white"
      style={{
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Websites in 30 Seconds
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Create professional websites instantly with AI. No coding required - just describe your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 font-semibold text-lg transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background)';
              }}
            >
              Start Building
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 font-semibold text-lg transition-colors"
              style={{
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSplitDemo() {
  return (
    <section 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-6">
            <div 
              className="font-medium text-sm uppercase tracking-wide"
              style={{ color: 'var(--primary)' }}
            >
              Next-Generation Solutions
            </div>
            <h1 
              className="text-5xl font-bold leading-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Transform Your Business with AI
            </h1>
            <p 
              className="text-xl leading-relaxed"
              style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
            >
              Leverage cutting-edge AI technology to streamline operations, boost productivity, and drive unprecedented growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="text-white px-8 py-4 font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--primary)',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-700, color-mix(in oklab, var(--primary) 85%, black))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
              >
                Get Started Free
              </button>
              <button 
                className="px-8 py-4 font-semibold transition-colors"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div 
              className="p-6 shadow-2xl"
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div 
                className="h-64 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                  borderRadius: 'var(--radius)'
                }}
              >
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg">Modern Dashboard Interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesGridDemo() {
  const features = [
    {
      title: "AI Generation",
      description: "Create stunning websites with advanced AI that understands your vision.",
      icon: "🤖"
    },
    {
      title: "Instant Deployment",
      description: "Go live immediately with our seamless deployment infrastructure.",
      icon: "🚀"
    },
    {
      title: "Visual Editor",
      description: "Fine-tune every detail with our intuitive drag-and-drop interface.",
      icon: "✏️"
    },
    {
      title: "Performance Optimized",
      description: "Lightning-fast websites with 90+ Lighthouse scores guaranteed.",
      icon: "⚡"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'var(--primary)' }}
          >
            Everything You Need
          </div>
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Powerful Features</h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >
            Comprehensive tools and capabilities to help you succeed.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 shadow-lg hover:shadow-xl transition-shadow"
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: 'var(--foreground)' }}
              >{feature.title}</h3>
              <p 
                className="leading-relaxed"
                style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
              >{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesCardsDemo() {
  const features = [
    {
      title: "AI-Powered Generation",
      description: "Create stunning websites with advanced AI that understands your vision and transforms ideas into reality.",
      icon: "🤖",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop&crop=center"
    },
    {
      title: "Lightning Fast Performance", 
      description: "Optimized for speed with 90+ Lighthouse scores and blazing-fast loading times across all devices.",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center"
    },
    {
      title: "Visual Drag & Drop Editor",
      description: "Intuitive visual editor that lets you customize every detail without writing a single line of code.",
      icon: "🎨",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=300&fit=crop&crop=center"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'var(--primary)' }}
          >
            Modern Solutions
          </div>
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Advanced Features</h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >
            Professional-grade tools designed for modern web development.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              style={{
                backgroundColor: 'var(--card-bg, var(--background))',
                borderRadius: 'var(--radius)'
              }}
            >
              {/* Feature Image with Overlay */}
              <div className="relative">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 100%), var(--primary)`,
                      mixBlendMode: 'multiply',
                      opacity: 0.55,
                    }}
                  />
                  {/* Title over image */}
                  <h3 className="absolute inset-x-0 bottom-0 px-6 pb-6 text-white text-xl sm:text-2xl font-semibold">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p 
                  className="leading-relaxed"
                  style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFormDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div 
              className="font-medium text-sm uppercase tracking-wide mb-4"
              style={{ color: 'var(--primary)' }}
            >
              We'd Love to Hear From You
            </div>
            <h2 
              className="text-4xl font-bold mb-6"
              style={{ color: 'var(--foreground)' }}
            >Get In Touch</h2>
            <p 
              className="text-xl"
              style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
            >
              Have questions? We're here to help. Send us a message and we'll respond within 24 hours.
            </p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 focus:ring-2 focus:border-transparent"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--primary)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 focus:ring-2 focus:border-transparent"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--primary)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 focus:ring-2 focus:border-transparent"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--primary)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                placeholder="Tell us about your project..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full text-white px-8 py-4 font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-700, color-mix(in oklab, var(--primary) 85%, black))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FAQDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How fast can I create a website?",
      answer: "With Aether, you can have a professional website ready in 30 seconds. Just describe what you want, and our AI handles the rest."
    },
    {
      question: "Can I customize the generated website?",
      answer: "Absolutely! Our visual editor lets you modify every element. You can change colors, text, images, and layout with simple drag-and-drop."
    },
    {
      question: "What about hosting and domains?",
      answer: "All plans include free hosting and SSL certificates. Custom domains are available on Professional and Enterprise plans."
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div 
              className="font-medium text-sm uppercase tracking-wide mb-4"
              style={{ color: 'var(--primary)' }}
            >
              Everything You Need to Know
            </div>
            <h2 
              className="text-4xl font-bold mb-6"
              style={{ color: 'var(--foreground)' }}
            >Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors"
                  style={{ 
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span 
                    className="font-semibold"
                    style={{ color: 'var(--foreground)' }}
                  >{faq.question}</span>
                  <span 
                    className="text-2xl"
                    style={{ color: 'color-mix(in oklab, var(--foreground) 50%, transparent)' }}
                  >
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p 
                      style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                    >{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsDemo() {
  const stats = [
    { value: "50,000+", label: "Websites Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "30sec", label: "Average Generation Time" },
    { value: "95+", label: "Average Lighthouse Score" }
  ];

  return (
    <section 
      className="py-20 text-white"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'color-mix(in oklab, var(--primary) 30%, white)' }}
          >
            Our Impact
          </div>
          <h2 className="text-4xl font-bold mb-6">Trusted by Thousands</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div 
              style={{ color: 'color-mix(in oklab, var(--primary) 30%, white)' }}
            >{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTADemo() {
  return (
    <section 
      className="py-20 text-white"
      style={{
        background: 'linear-gradient(to right, var(--secondary), var(--primary))'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who've already transformed their web presence with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 font-semibold text-lg transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background)';
              }}
            >
              Start Building Free
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 font-semibold text-lg transition-colors"
              style={{
                borderRadius: 'var(--radius)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Social Proof Components
function TestimonialsSliderDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      content: "Aether transformed our web presence in minutes. The AI understood exactly what we needed and delivered beyond our expectations.",
      name: "Sarah Johnson", 
      company: "TechStart",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      content: "Incredible speed and quality. We launched 5 client websites in a single day using this platform.",
      name: "Michael Chen",
      company: "DesignCo",
      avatar: "👨‍💻", 
      rating: 5
    },
    {
      content: "The visual editor is intuitive and powerful. Perfect for our design workflow and client presentations.",
      name: "Emily Rodriguez",
      company: "Pixel Perfect", 
      avatar: "👩‍🎨",
      rating: 5
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'var(--primary)' }}
          >
            Success Stories
          </div>
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >What Our Customers Say</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative shadow-xl p-8 md:p-12"
            style={{
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius)'
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">💬</div>
              
              <blockquote 
                className="text-xl md:text-2xl mb-8 leading-relaxed"
                style={{ color: 'color-mix(in oklab, var(--foreground) 80%, transparent)' }}
              >
                "{testimonials[currentSlide].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">{testimonials[currentSlide].avatar}</div>
                <div className="text-left">
                  <div 
                    className="font-semibold"
                    style={{ color: 'var(--foreground)' }}
                  >{testimonials[currentSlide].name}</div>
                  <div 
                    style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                  >{testimonials[currentSlide].company}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors`}
                style={{
                  backgroundColor: index === currentSlide ? 'var(--primary)' : 'var(--border)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCarouselDemo() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600">Join thousands of companies that trust our platform</p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-12 items-center">
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">🏢</div>
            </div>
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">🔍</div>
            </div>
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">📦</div>
            </div>
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">⚡</div>
            </div>
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">🎯</div>
            </div>
            <div className="flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-2xl">🚀</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoGridDemo() {
  const logos = [
    { name: "Microsoft", icon: "🏢" },
    { name: "Google", icon: "🔍" },
    { name: "Amazon", icon: "📦" },
    { name: "Tesla", icon: "⚡" },
    { name: "Apple", icon: "🍎" },
    { name: "Meta", icon: "📘" },
    { name: "Netflix", icon: "🎬" },
    { name: "Spotify", icon: "🎵" },
  ];

  return (
    <section 
      className="py-16"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >Trusted Partners</h2>
          <p 
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >Companies that power their websites with our platform</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div className="text-3xl mb-2">{logo.icon}</div>
              <div 
                className="text-sm font-medium"
                style={{ color: 'color-mix(in oklab, var(--foreground) 80%, transparent)' }}
              >{logo.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Business Components
function PricingTableDemo() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "month",
      description: "Perfect for individuals and small projects",
      features: ["5 websites", "AI generation", "Basic support", "SSL included"],
      highlighted: false,
      ctaText: "Start Free Trial"
    },
    {
      name: "Professional", 
      price: "$29",
      period: "month",
      description: "Ideal for growing businesses",
      features: ["25 websites", "Advanced AI", "Priority support", "Custom domains", "Analytics"],
      highlighted: true,
      ctaText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations", 
      features: ["Unlimited websites", "White-label", "24/7 support", "API access", "SLA guarantee"],
      highlighted: false,
      ctaText: "Contact Sales"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'var(--primary)' }}
          >
            Pricing That Scales
          </div>
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Choose Your Plan</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`shadow-lg p-8 relative ${
                plan.highlighted ? 'scale-105' : ''
              }`}
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)',
                border: plan.highlighted ? '2px solid var(--primary)' : '1px solid var(--border)'
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="text-white text-sm font-medium px-4 py-1"
                    style={{
                      backgroundColor: 'var(--primary)',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >{plan.name}</h3>
                <p 
                  className="text-sm mb-6"
                  style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                >{plan.description}</p>
                
                <div className="mb-6">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >{plan.price}</span>
                  {plan.period && <span 
                    style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                  >/{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span 
                        style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                      >{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="w-full py-3 px-6 font-semibold transition-colors"
                  style={{
                    backgroundColor: plan.highlighted ? 'var(--primary)' : 'var(--muted)',
                    color: plan.highlighted ? 'white' : 'var(--foreground)',
                    borderRadius: 'var(--radius)'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.highlighted) {
                      e.currentTarget.style.backgroundColor = 'var(--brand-700, color-mix(in oklab, var(--primary) 85%, black))';
                    } else {
                      e.currentTarget.style.backgroundColor = 'var(--border)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = plan.highlighted ? 'var(--primary)' : 'var(--muted)';
                  }}
                >
                  {plan.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamGridDemo() {
  const members = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO", 
      image: "👨‍💼",
      bio: "Former Google AI researcher with 10+ years in machine learning.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Maria Garcia",
      role: "CTO",
      image: "👩‍💻", 
      bio: "Full-stack architect specializing in scalable AI systems.",
      social: { linkedin: "#", github: "#" }
    },
    {
      name: "David Kim", 
      role: "Head of Design",
      image: "👨‍🎨",
      bio: "Design systems expert with experience at Airbnb and Figma.",
      social: { linkedin: "#", dribbble: "#" }
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="font-medium text-sm uppercase tracking-wide mb-4"
            style={{ color: 'var(--primary)' }}
          >
            The People Behind Aether
          </div>
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Meet Our Team</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {members.map((member, index) => (
            <div 
              key={index} 
              className="text-center p-6 hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: 'var(--foreground)' }}
              >{member.name}</h3>
              <div 
                className="font-medium mb-4"
                style={{ color: 'var(--primary)' }}
              >{member.role}</div>
              <p 
                className="text-sm mb-6"
                style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
              >{member.bio}</p>
              
              <div className="flex justify-center space-x-4">
                {Object.entries(member.social).map(([platform, url]) => (
                  <a key={platform} href={url} className="text-gray-400 hover:text-blue-600">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                      {platform[0].toUpperCase()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioGalleryDemo() {
  const portfolioItems = [
    { title: "E-commerce Store", category: "Web Design", image: "https://picsum.photos/600/400?random=10" },
    { title: "SaaS Dashboard", category: "UI/UX", image: "https://picsum.photos/600/400?random=11" },
    { title: "Mobile App", category: "App Design", image: "https://picsum.photos/600/400?random=12" },
    { title: "Brand Identity", category: "Branding", image: "https://picsum.photos/600/400?random=13" },
    { title: "Landing Page", category: "Web Design", image: "https://picsum.photos/600/400?random=14" },
    { title: "Blog Platform", category: "Content", image: "https://picsum.photos/600/400?random=15" }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Our Portfolio</h2>
          <p 
            className="text-xl"
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >Stunning projects created with our platform</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div 
                className="aspect-w-16 aspect-h-12 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in oklab, var(--primary) 20%, transparent), color-mix(in oklab, var(--secondary) 20%, transparent))'
                }}
              >
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div 
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--primary)' }}
                >{item.category}</div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >{item.title}</h3>
                <p 
                  className="text-sm"
                  style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                >Beautiful design crafted with attention to detail</p>
              </div>
              
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ backgroundColor: 'color-mix(in oklab, var(--primary) 80%, transparent)' }}
              >
                <button 
                  className="px-6 py-2 font-semibold"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. Content Components  
function BlogGridDemo() {
  const blogPosts = [
    {
      title: "The Future of AI in Web Design",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we create and design websites...",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "AI & Design",
      image: "https://picsum.photos/800/450?random=1"
    },
    {
      title: "10 Essential UX Principles for Modern Websites", 
      excerpt: "Learn the fundamental user experience principles that every modern website should implement...",
      date: "Dec 12, 2024", 
      readTime: "8 min read",
      category: "UX Design",
      image: "https://picsum.photos/800/450?random=2"
    },
    {
      title: "Building High-Performance Websites",
      excerpt: "Best practices and techniques to ensure your website loads fast and performs optimally...",
      date: "Dec 10, 2024",
      readTime: "6 min read", 
      category: "Performance",
      image: "https://picsum.photos/800/450?random=3"
    },
    {
      title: "SEO Guide for Modern Web Development",
      excerpt: "Complete guide to search engine optimization for contemporary web applications...",
      date: "Dec 8, 2024",
      readTime: "10 min read",
      category: "SEO",
      image: "https://picsum.photos/800/450?random=4"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Latest from Our Blog</h2>
          <p 
            className="text-xl"
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >Insights, tutorials, and industry trends</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post, index) => (
            <article 
              key={index} 
              className="shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius)'
              }}
            >
              <div 
                className="aspect-w-16 aspect-h-9 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in oklab, var(--primary) 20%, transparent), color-mix(in oklab, var(--secondary) 20%, transparent))'
                }}
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span 
                    className="px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius)'
                    }}
                  >
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 
                  className="text-xl font-bold mb-3 cursor-pointer transition-colors"
                  style={{ color: 'var(--foreground)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                >
                  {post.title}
                </h3>
                
                <p 
                  className="mb-4 leading-relaxed"
                  style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                >
                  {post.excerpt}
                </p>
                
                <a 
                  href="#" 
                  className="font-medium flex items-center space-x-1 transition-colors"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--brand-700, color-mix(in oklab, var(--primary) 85%, black))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineDemo() {
  const timelineEvents = [
    {
      year: "2024",
      title: "AI Revolution",
      description: "Launch of advanced AI website generation with 30-second creation time",
      icon: "🤖"
    },
    {
      year: "2023", 
      title: "Enterprise Expansion",
      description: "Introduced enterprise-grade features and security compliance",
      icon: "🏢"
    },
    {
      year: "2022",
      title: "Visual Editor Launch", 
      description: "Released intuitive drag-and-drop editor for post-generation customization",
      icon: "🎨"
    },
    {
      year: "2021",
      title: "Platform Genesis",
      description: "Founded with the vision to democratize professional web design",
      icon: "🚀"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--foreground)' }}
          >Our Journey</h2>
          <p 
            className="text-xl"
            style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
          >Milestones in our mission to revolutionize web creation</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full"
              style={{ backgroundColor: 'color-mix(in oklab, var(--primary) 30%, transparent)' }}
            ></div>
            
            {timelineEvents.map((event, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}>
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div 
                    className="shadow-md p-6 relative"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderRadius: 'var(--radius)'
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl">{event.icon}</div>
                      <div>
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: 'var(--primary)' }}
                        >{event.year}</div>
                        <h3 
                          className="text-lg font-semibold"
                          style={{ color: 'var(--foreground)' }}
                        >{event.title}</h3>
                      </div>
                    </div>
                    <p 
                      style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}
                    >{event.description}</p>
                  </div>
                </div>
                
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 shadow-md"
                  style={{
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--background)'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 6. Footer Component
function FooterEnterpriseDemo() {
  return (
    <footer 
      className="text-white py-16"
      style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 95%, transparent)' }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-6">Aether</div>
            <p 
              className="mb-6 leading-relaxed"
              style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
            >
              The world's most advanced AI website builder. Create professional websites in 30 seconds.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--foreground) 85%, transparent)',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 75%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 85%, transparent)';
                }}
              >
                📘
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--foreground) 85%, transparent)',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 75%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 85%, transparent)';
                }}
              >
                🐦
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--foreground) 85%, transparent)',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 75%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 85%, transparent)';
                }}
              >
                💼
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--foreground) 85%, transparent)',
                  borderRadius: 'var(--radius)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 75%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in oklab, var(--foreground) 85%, transparent)';
                }}
              >
                📷
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul 
              className="space-y-3"
              style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
            >
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Website Builder</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Templates</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Hosting</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Domains</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul 
              className="space-y-3"
              style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
            >
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >About Us</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Careers</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Press</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Partners</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul 
              className="space-y-3"
              style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
            >
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Help Center</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Documentation</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >API Reference</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >System Status</a></li>
              <li><a 
                href="#" 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
                }}
              >Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div 
            className="mb-4 md:mb-0"
            style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
          >
            © 2024 Aether. All rights reserved.
          </div>
          <div 
            className="flex space-x-6 text-sm"
            style={{ color: 'color-mix(in oklab, white 80%, transparent)' }}
          >
            <a 
              href="#" 
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
              }}
            >Privacy Policy</a>
            <a 
              href="#" 
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
              }}
            >Terms of Service</a>
            <a 
              href="#" 
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'color-mix(in oklab, white 80%, transparent)';
              }}
            >Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Theme Selector Component
function ThemeSelector({ 
  currentTheme, 
  onThemeChange 
}: { 
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const themeDisplayNames = {
    'modern-saas': 'Modern SaaS',
    'corporate': 'Corporate',  
    'creative-agency': 'Creative Agency',
    'e-commerce': 'E-commerce',
    'startup': 'Startup'
  };

  const themeColors = {
    'modern-saas': { primary: '#6366f1', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    'corporate': { primary: '#1e3a8a', bg: '#ffffff' },
    'creative-agency': { primary: '#ff006e', bg: 'linear-gradient(45deg, #ff006e 0%, #8338ec 50%, #ffbe0b 100%)' },
    'e-commerce': { primary: '#dc2626', bg: '#ffffff' },
    'startup': { primary: '#3b82f6', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">🎨 테마 선택</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: themeColors[currentTheme as keyof typeof themeColors]?.primary }}
              />
              <span className="text-sm font-medium">
                {themeDisplayNames[currentTheme as keyof typeof themeDisplayNames]}
              </span>
            </div>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {isOpen && (
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(designKits).map(([kitId, kit]) => (
              <button
                key={kitId}
                onClick={() => {
                  onThemeChange(kitId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  currentTheme === kitId ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeColors[kitId as keyof typeof themeColors]?.primary }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {themeDisplayNames[kitId as keyof typeof themeDisplayNames]}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {kit.targetIndustry.join(', ')}
                  </div>
                </div>
                {currentTheme === kitId && (
                  <div className="text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        
        <div className="p-3 bg-gray-50 text-xs text-gray-600 border-t border-gray-100">
          테마를 선택하면 모든 컴포넌트에 즉시 적용됩니다
        </div>
      </div>
    </div>
  );
}

export default function WorkingShowcasePage() {
  const [currentTheme, setCurrentTheme] = useState('modern-saas');
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('aether-theme');
    if (savedTheme && designKits[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  
  // Apply theme CSS variables when theme changes
  useEffect(() => {
    const cssVariables = getKitCSSVariables(currentTheme);
    const root = document.documentElement;
    
    // Apply all CSS variables to the root element
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Save theme to localStorage
    localStorage.setItem('aether-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-background" style={{ transition: 'all 0.3s ease-in-out' }}>
      {/* Theme Selector */}
      <ThemeSelector 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
      
      {/* Page Header */}
      <div className="py-16" style={{ 
        background: 'var(--primary, #6366f1)',
        color: 'white',
        transition: 'all 0.3s ease-in-out'
      }}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Aether Component Visual Showcase</h1>
          <p className="text-xl opacity-90 mb-4">
            실제 컴포넌트들을 눈으로 확인할 수 있는 페이지 - Working demo components
          </p>
          <div className="text-sm opacity-75 bg-white/10 backdrop-blur-sm inline-block px-4 py-2 rounded-lg">
            🎨 우측 상단에서 테마를 변경해보세요! · Change themes from top-right selector!
          </div>
        </div>
      </div>

      {/* Component Showcase */}
      <div className="space-y-24 py-16">
        
        {/* Navigation Components */}
        <ComponentSection 
          title="Navigation Components" 
          description="Headers and navigation menus - 헤더 및 네비게이션"
        >
          <div className="space-y-8">
            <ComponentDemo title="Header Simple" componentId="header-simple">
              <HeaderSimpleDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Navigation Mega Menu" componentId="nav-mega-menu">
              <NavMegaMenuDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>
        
        {/* Hero Components */}
        <ComponentSection 
          title="Hero Components" 
          description="Above-the-fold content sections - 메인 히어로 섹션들"
        >
          <div className="space-y-8">
            <ComponentDemo title="Hero Centered" componentId="hero-centered">
              <HeroCenteredDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Split" componentId="hero-split">
              <HeroSplitDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Video Background" componentId="hero-video-bg">
              <HeroVideoBgDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Enterprise" componentId="hero-enterprise">
              <HeroEnterpriseDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Feature Components */}
        <ComponentSection 
          title="Feature Components" 
          description="Showcase product features - 기능 소개 섹션들"
        >
          <div className="space-y-8">
            <ComponentDemo title="Features Grid" componentId="features-grid">
              <FeaturesGridDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Features Cards" componentId="features-cards">
              <FeaturesCardsDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Social Proof Components */}
        <ComponentSection 
          title="Social Proof Components" 
          description="Testimonials and trust signals - 고객 후기 및 신뢰 신호"
        >
          <div className="space-y-8">
            <ComponentDemo title="Testimonials Slider" componentId="testimonials-slider">
              <TestimonialsSliderDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Logo Carousel" componentId="logo-carousel">
              <LogoCarouselDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Logo Grid" componentId="logo-grid">
              <LogoGridDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Business Components */}
        <ComponentSection 
          title="Business Components" 
          description="Pricing, team, and portfolio sections - 가격, 팀, 포트폴리오"
        >
          <div className="space-y-8">
            <ComponentDemo title="Pricing Table" componentId="pricing-table">
              <PricingTableDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Team Grid" componentId="team-grid">
              <TeamGridDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Portfolio Gallery" componentId="portfolio-gallery">
              <PortfolioGalleryDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Contact Components */}
        <ComponentSection 
          title="Contact Components" 
          description="Contact forms - 연락처 폼 섹션들"
        >
          <ComponentDemo title="Contact Form" componentId="contact-form">
            <ContactFormDemo />
          </ComponentDemo>
        </ComponentSection>

        {/* Content Components */}
        <ComponentSection 
          title="Content Components" 
          description="FAQ, stats, blog, and timeline - FAQ, 통계, 블로그, 타임라인"
        >
          <div className="space-y-8">
            <ComponentDemo title="FAQ Section" componentId="faq-section">
              <FAQDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Stats Section" componentId="stats-section">
              <StatsDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Blog Grid" componentId="blog-grid">
              <BlogGridDemo />
            </ComponentDemo>
            
            <ComponentDemo title="Timeline" componentId="timeline">
              <TimelineDemo />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Call-to-Action Components */}
        <ComponentSection 
          title="Call-to-Action Components" 
          description="Conversion-focused sections - 행동 유도 섹션들"
        >
          <ComponentDemo title="CTA Simple" componentId="cta-simple">
            <CTADemo />
          </ComponentDemo>
        </ComponentSection>
        
        {/* Footer Components */}
        <ComponentSection 
          title="Footer Components" 
          description="Website footers - 웹사이트 푸터"
        >
          <ComponentDemo title="Footer Enterprise" componentId="footer-enterprise">
            <FooterEnterpriseDemo />
          </ComponentDemo>
        </ComponentSection>

      </div>

      {/* Footer Note */}
      <div className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>
            ✅ <strong>전체 21개 컴포넌트 완성!</strong> 이제 모든 컴포넌트의 시각적 모습과 상호작용을 확인할 수 있습니다.
            <br />
            <strong>Complete 21 Components Showcase!</strong> All components with visual preview and interactions.
          </p>
          <div className="mt-4 text-sm">
            <strong>Categories:</strong> Navigation (2) • Hero (4) • Features (2) • Social Proof (3) • Business (3) • Contact (1) • Content (4) • CTA (1) • Footer (1)
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ComponentSection({ 
  title, 
  description, 
  children 
}: { 
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ComponentDemo({ 
  title, 
  componentId, 
  children 
}: { 
  title: string;
  componentId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <code className="text-sm bg-white px-2 py-1 rounded text-gray-600 border">
            {componentId}
          </code>
        </div>
      </div>
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}