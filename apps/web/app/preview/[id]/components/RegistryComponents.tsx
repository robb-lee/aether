'use client'

import React from 'react'

// Import the enhanced components from component registry
export { HeroSplit } from '@aether/component-registry/components/hero/HeroSplit'
export { HeroVideoBg } from '@aether/component-registry/components/hero/HeroVideoBg'
export { CTASimple } from '@aether/component-registry/components/cta/CTASimple'

// Import all the newly created components
export { TestimonialsSlider } from '@aether/component-registry/components/testimonials/TestimonialsSlider'
export { PricingTable } from '@aether/component-registry/components/pricing/PricingTable'
export { StatsSection } from '@aether/component-registry/components/stats/StatsSection'
export { ContactForm } from '@aether/component-registry/components/contact/ContactForm'
export { FAQSection } from '@aether/component-registry/components/faq/FAQSection'
export { TeamGrid } from '@aether/component-registry/components/team/TeamGrid'
export { PortfolioGallery } from '@aether/component-registry/components/gallery/PortfolioGallery'
export { BlogGrid } from '@aether/component-registry/components/blog/BlogGrid'
export { Timeline } from '@aether/component-registry/components/timeline/Timeline'

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