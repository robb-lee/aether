'use client'

import React from 'react'

// HeroSplit Component (adapted from Component Registry)
interface HeroSplitProps {
  title: string
  subtitle?: string
  description?: string
  ctaText: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  imageUrl?: string
  imageAlt?: string
  layout?: 'left-content' | 'right-content'
  style?: 'modern' | 'corporate' | 'playful'
  showDemo?: boolean
}

export function HeroSplit({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  imageUrl,
  imageAlt = 'Hero image',
  layout = 'left-content',
  style = 'modern',
  showDemo = false
}: HeroSplitProps) {
  const isRightLayout = layout === 'right-content'
  
  const styles = {
    modern: {
      bg: 'bg-gradient-to-br from-gray-50 to-white',
      text: 'text-gray-900',
      subtitle: 'text-blue-600',
      description: 'text-gray-600'
    },
    corporate: {
      bg: 'bg-white',
      text: 'text-gray-900',
      subtitle: 'text-indigo-600',
      description: 'text-gray-700'
    },
    playful: {
      bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
      text: 'text-gray-900',
      subtitle: 'text-purple-600',
      description: 'text-gray-600'
    }
  }

  const ContentSection = () => (
    <div className="flex-1">
      {subtitle && (
        <p className={`text-sm font-medium tracking-wide uppercase mb-4 ${styles[style].subtitle}`}>
          {subtitle}
        </p>
      )}
      
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${styles[style].text}`}>
        {title}
      </h1>
      
      {description && (
        <p className={`text-lg md:text-xl mb-8 leading-relaxed ${styles[style].description}`}>
          {description}
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={ctaHref}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
        >
          {ctaText}
        </a>
        
        {secondaryCtaText && (
          <a
            href={secondaryCtaHref}
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
          >
            {secondaryCtaText}
          </a>
        )}
      </div>
      
      {showDemo && (
        <p className="mt-6 text-sm text-gray-500">
          ⚡ Try it free - No credit card required
        </p>
      )}
    </div>
  )

  const ImageSection = () => (
    <div className="flex-1 relative">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
          {showDemo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl flex items-end p-6">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                Live Demo
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Hero Image Placeholder</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className={`${styles[style].bg} py-20 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col gap-12 items-center ${
          isRightLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}>
          <ContentSection />
          <ImageSection />
        </div>
      </div>
    </section>
  )
}

// HeroCentered Component (adapted from Component Registry)
interface HeroCenteredProps {
  title: string
  subtitle?: string
  description?: string
  ctaText: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  backgroundImage?: string
  style?: 'minimal' | 'gradient' | 'image'
}

export function HeroCentered({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  backgroundImage,
  style = 'minimal'
}: HeroCenteredProps) {
  const styles = {
    minimal: 'bg-white',
    gradient: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white',
    image: 'bg-gray-900 text-white relative'
  }

  return (
    <section className={`${styles[style]} py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {style === 'image' && backgroundImage && (
        <div className="absolute inset-0 bg-black/50">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {subtitle && (
          <p className={`text-sm font-medium tracking-wide uppercase mb-4 ${
            style === 'minimal' ? 'text-blue-600' : 'text-white/80'
          }`}>
            {subtitle}
          </p>
        )}
        
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight ${
          style === 'minimal' ? 'text-gray-900' : 'text-white'
        }`}>
          {title}
        </h1>
        
        {description && (
          <p className={`text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto ${
            style === 'minimal' ? 'text-gray-600' : 'text-white/90'
          }`}>
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaHref}
            className="px-10 py-5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            {ctaText}
          </a>
          
          {secondaryCtaText && (
            <a
              href={secondaryCtaHref}
              className={`px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                style === 'minimal'
                  ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// FeaturesGrid Component (adapted from Component Registry)
interface FeaturesGridProps {
  title: string
  description?: string
  features: Array<{
    title: string
    description: string
    icon?: string
  }>
  layout?: '2-col' | '3-col' | '4-col'
  style?: 'cards' | 'minimal' | 'bordered'
}

export function FeaturesGrid({
  title,
  description,
  features,
  layout = '3-col',
  style = 'cards'
}: FeaturesGridProps) {
  const gridCols = {
    '2-col': 'grid-cols-1 md:grid-cols-2',
    '3-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const cardStyles = {
    cards: 'p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white',
    minimal: 'p-6',
    bordered: 'p-6 border border-gray-300 rounded-lg'
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
        
        <div className={`grid ${gridCols[layout]} gap-8`}>
          {features.map((feature, index) => (
            <div key={index} className={cardStyles[style]}>
              {feature.icon && (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Header Navigation Component
interface HeaderNavProps {
  logo?: string
  logoText?: string
  navigation?: Array<{
    label: string
    href: string
  }>
  ctaText?: string
  ctaHref?: string
}

export function HeaderNav({
  logo,
  logoText = 'Logo',
  navigation = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' }
  ],
  ctaText = 'Get Started',
  ctaHref = '#'
}: HeaderNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo ? (
              <img src={logo} alt={logoText} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold text-gray-900">{logoText}</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <a
              href={ctaHref}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

// Footer Simple Component
interface FooterSimpleProps {
  companyName?: string
  description?: string
  links?: Array<{
    label: string
    href: string
  }>
  socialLinks?: Array<{
    platform: string
    href: string
    icon?: string
  }>
}

export function FooterSimple({
  companyName = 'Company',
  description = 'Making the world a better place through innovative solutions.',
  links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact', href: '/contact' }
  ],
  socialLinks = []
}: FooterSimpleProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
            <p className="text-gray-400 mb-6 max-w-md">{description}</p>
            
            {/* Links */}
            <div className="flex flex-wrap gap-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {social.icon || social.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}