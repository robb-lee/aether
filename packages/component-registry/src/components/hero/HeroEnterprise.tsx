'use client'

import React from 'react'
import { cn } from '@aether/ui/utils/cn'

interface TrustBadge {
  text: string
  href?: string
  icon?: React.ReactNode
}

interface HeroEnterpriseProps {
  // Trust Badge (like Y Combinator)
  trustBadge?: TrustBadge

  // Main content
  title: string
  subtitle?: string
  description: string

  // CTAs
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }

  // Visual elements
  productImage?: string
  productImageAlt?: string
  showProductDiagram?: boolean
  
  // Background
  backgroundVariant?: 'white' | 'gradient' | 'dark'
  
  // Layout
  layout?: 'split' | 'centered'
  
  className?: string
}

export function HeroEnterprise({
  trustBadge,
  title,
  subtitle,
  description,
  primaryCta = { text: 'Try for FREE', href: '/plans' },
  secondaryCta,
  productImage,
  productImageAlt = 'Product Flow Diagram',
  showProductDiagram = true,
  backgroundVariant = 'white',
  layout = 'split',
  className
}: HeroEnterpriseProps) {

  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    dark: 'bg-gray-900 text-white'
  }

  const isCentered = layout === 'centered'

  return (
    <section className={cn(
      'relative py-20 lg:py-24 overflow-hidden',
      backgroundClasses[backgroundVariant],
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'grid gap-12 items-center',
          isCentered ? 'text-center' : 'lg:grid-cols-2 lg:gap-16'
        )}>
          
          {/* Content */}
          <div className={cn('space-y-8', isCentered && 'max-w-4xl mx-auto')}>
            
            {/* Trust Badge */}
            {trustBadge && (
              <div className={cn('flex', isCentered ? 'justify-center' : 'justify-start')}>
                {trustBadge.href ? (
                  <a
                    href={trustBadge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    {trustBadge.icon && (
                      <span className="mr-2">{trustBadge.icon}</span>
                    )}
                    {trustBadge.text}
                  </a>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {trustBadge.icon && (
                      <span className="mr-2">{trustBadge.icon}</span>
                    )}
                    {trustBadge.text}
                  </div>
                )}
              </div>
            )}

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
                backgroundVariant === 'dark' ? 'text-white' : 'text-gray-900',
                isCentered && 'max-w-4xl mx-auto'
              )}>
                {title.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < title.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <h2 className={cn(
                  'text-xl md:text-2xl font-medium',
                  backgroundVariant === 'dark' ? 'text-gray-200' : 'text-gray-700',
                  isCentered && 'max-w-3xl mx-auto'
                )}>
                  {subtitle}
                </h2>
              )}

              {/* Description */}
              <div className={cn(
                'text-lg md:text-xl leading-relaxed space-y-4',
                backgroundVariant === 'dark' ? 'text-gray-300' : 'text-gray-600',
                isCentered && 'max-w-3xl mx-auto'
              )}>
                {description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className={cn(
              'flex flex-col sm:flex-row gap-4',
              isCentered ? 'justify-center' : 'justify-start'
            )}>
              {/* Primary CTA */}
              <a
                href={primaryCta.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
              >
                {primaryCta.text}
              </a>

              {/* Secondary CTA */}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className={cn(
                    'inline-flex items-center justify-center px-8 py-4 font-semibold text-lg rounded-lg transition-all duration-200 transform hover:scale-105',
                    backgroundVariant === 'dark'
                      ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  )}
                >
                  {secondaryCta.text}
                </a>
              )}
            </div>
          </div>

          {/* Product Diagram/Image */}
          {(showProductDiagram || productImage) && !isCentered && (
            <div className="relative">
              {productImage ? (
                <div className="relative">
                  <img
                    src={productImage}
                    alt={productImageAlt}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                  
                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
                </div>
              ) : (
                // Default product flow diagram
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="text-2xl font-bold text-gray-800 mb-8">
                      {title.includes('Unified') ? 'Unified Platform Flow' : 'Product Architecture'}
                    </div>
                    
                    {/* Simplified flow diagram */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">AI</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">AI Engine</span>
                      </div>
                      
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">🔒</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Security</span>
                      </div>
                      
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">⚡</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Deploy</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                      End-to-end automation for modern infrastructure
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-15 animate-pulse delay-500"></div>
                </div>
              )}
            </div>
          )}
          
          {/* Centered layout image */}
          {(showProductDiagram || productImage) && isCentered && (
            <div className="mt-12">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productImageAlt}
                  className="mx-auto max-w-4xl w-full h-auto rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="mx-auto max-w-3xl bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 shadow-xl">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-8">Platform Overview</h3>
                    <div className="grid grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-blue-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                          <span className="text-white text-2xl font-bold">AI</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Intelligent Processing</span>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-purple-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                          <span className="text-white text-2xl">🔒</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Enterprise Security</span>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                          <span className="text-white text-2xl">⚡</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Instant Deployment</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Background decorative elements */}
      {backgroundVariant === 'gradient' && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-100 to-transparent rounded-full opacity-30 -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100 to-transparent rounded-full opacity-30 translate-y-48 -translate-x-48"></div>
        </>
      )}
    </section>
  )
}

// Export with display name for debugging
HeroEnterprise.displayName = 'HeroEnterprise'