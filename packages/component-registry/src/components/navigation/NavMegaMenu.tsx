'use client'

import React, { useState } from 'react'
// Temporary cn utility - replace with @aether/ui when available
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
import { ChevronDownIcon, MagnifyingGlassIcon, GlobeAltIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface MenuItem {
  id: string
  label: string
  href: string
  description?: string
  icon?: React.ReactNode
  external?: boolean
}

interface MegaMenuSection {
  title: string
  items: MenuItem[]
}

interface MegaMenuConfig {
  [key: string]: MegaMenuSection[]
}

interface NavMegaMenuProps {
  logo?: string
  logoText?: string
  megaMenuConfig?: MegaMenuConfig
  ctaButtons?: Array<{
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }>
  showLanguageSelector?: boolean
  showSearch?: boolean
  showBanner?: boolean
  bannerContent?: React.ReactNode
  className?: string
}

const defaultMegaMenuConfig: MegaMenuConfig = {
  Platform: [
    {
      title: 'AI',
      items: [
        {
          id: 'ai-hub',
          label: 'AI Hub',
          href: '/platform/ai/aihub',
          description: 'Artificial Intelligence Hub for automated workflows'
        }
      ]
    },
    {
      title: 'Security',
      items: [
        {
          id: 'database-controller',
          label: 'Database Access Controller',
          href: '/platform/security/database-access-controller',
          description: 'Secure database access management'
        },
        {
          id: 'system-controller',
          label: 'System Access Controller',
          href: '/platform/security/system-access-controller',
          description: 'System-wide access control'
        },
        {
          id: 'kubernetes-controller',
          label: 'Kubernetes Access Controller',
          href: '/platform/security/kubernetes-access-controller',
          description: 'K8s cluster access management'
        },
        {
          id: 'web-controller',
          label: 'Web Access Controller',
          href: '/platform/security/web-access-controller',
          description: 'Web application access control'
        }
      ]
    }
  ],
  Resources: [
    {
      title: 'Discover',
      items: [
        {
          id: 'white-paper',
          label: 'White Paper',
          href: '/resources/discover/white-paper',
          description: 'In-depth technical insights'
        },
        {
          id: 'webinars',
          label: 'Webinars',
          href: '/resources/discover/webinars',
          description: 'Live and recorded sessions'
        },
        {
          id: 'blog',
          label: 'Blog',
          href: '/resources/discover/blog',
          description: 'Latest news and updates'
        },
        {
          id: 'integrations',
          label: 'Integrations',
          href: '/resources/discover/integrations',
          description: 'Connect with your tools'
        }
      ]
    },
    {
      title: 'Learn',
      items: [
        {
          id: 'documentation',
          label: 'Documentation',
          href: '/resources/learn/documentation',
          description: 'Complete guides and API docs'
        },
        {
          id: 'tutorials',
          label: 'Tutorials',
          href: '/resources/learn/tutorials',
          description: 'Step-by-step walkthroughs'
        },
        {
          id: 'demo',
          label: 'Demo',
          href: '/resources/learn/demo',
          description: 'Interactive product demo'
        }
      ]
    }
  ],
  Community: [
    {
      title: 'Customers',
      items: [
        {
          id: 'customers',
          label: 'Customers',
          href: '/customers/customers',
          description: 'Our customer community'
        },
        {
          id: 'success-stories',
          label: 'Customer Success Stories',
          href: '/customers/customer-success-cases',
          description: 'Real-world case studies'
        },
        {
          id: 'schedule-demo',
          label: 'Schedule a Demo',
          href: '/company/contact-us',
          description: 'Book a personalized demo'
        },
        {
          id: 'customer-portal',
          label: 'Customer Portal',
          href: 'https://help.support.querypie.com',
          description: 'Support and resources',
          external: true
        }
      ]
    },
    {
      title: 'Partners',
      items: [
        {
          id: 'become-partner',
          label: 'Become a Partner',
          href: '/partners/become-a-partner',
          description: 'Join our partner network'
        },
        {
          id: 'partner-portal',
          label: 'Partner Portal',
          href: 'https://querypie.my.site.com/partners/s/',
          description: 'Partner resources and tools',
          external: true
        }
      ]
    }
  ]
}

export function NavMegaMenu({
  logo,
  logoText = 'Aether',
  megaMenuConfig = defaultMegaMenuConfig,
  ctaButtons = [
    { label: 'Contact Us', href: '/contact', variant: 'secondary' },
    { label: 'Try for FREE', href: '/plans', variant: 'primary' }
  ],
  showLanguageSelector = true,
  showSearch = true,
  showBanner = true,
  bannerContent,
  className
}: NavMegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showBannerState, setShowBannerState] = useState(showBanner)

  const handleMenuEnter = (menuKey: string) => {
    setActiveMenu(menuKey)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

  const closeBanner = () => {
    setShowBannerState(false)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Top Banner */}
      {showBannerState && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-sm relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
            {bannerContent || (
              <>
                <span className="font-medium">Aether Community Edition is live 🎉 Get it now for free</span>
                <a href="/plans" className="ml-2 underline hover:no-underline">
                  Download today!
                </a>
              </>
            )}
          </div>
          <button
            onClick={closeBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                {logo ? (
                  <img src={logo} alt={logoText} className="h-8 w-auto" />
                ) : (
                  <span className="text-xl font-bold text-gray-900">{logoText}</span>
                )}
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {Object.entries(megaMenuConfig).map(([key, sections]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(key)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                    {key}
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeMenu === key && (
                    <div className="absolute top-full left-0 w-screen max-w-4xl bg-white border border-gray-200 shadow-xl rounded-lg mt-1 z-50">
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-8">
                          {sections.map((section) => (
                            <div key={section.title}>
                              <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                {section.title}
                              </h6>
                              <ul className="space-y-3">
                                {section.items.map((item) => (
                                  <li key={item.id}>
                                    <a
                                      href={item.href}
                                      target={item.external ? '_blank' : undefined}
                                      rel={item.external ? 'noopener noreferrer' : undefined}
                                      className="block hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                                    >
                                      <div className="flex items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">
                                              {item.label}
                                            </span>
                                            {item.external && (
                                              <svg className="ml-1 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                              </svg>
                                            )}
                                          </div>
                                          {item.description && (
                                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Direct Link */}
              <a
                href="/plans"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Plans
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              {showLanguageSelector && (
                <div className="hidden md:flex items-center">
                  <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <select className="text-sm text-gray-700 bg-transparent border-none focus:outline-none">
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              )}

              {/* Search */}
              {showSearch && (
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              )}

              {/* CTA Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {ctaButtons.map((button, index) => (
                  <a
                    key={index}
                    href={button.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      button.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-700 hover:text-blue-600'
                    )}
                  >
                    {button.label}
                  </a>
                ))}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              {Object.entries(megaMenuConfig).map(([key, sections]) => (
                <div key={key}>
                  <button className="flex items-center justify-between w-full text-left text-gray-700 py-2 text-sm font-medium">
                    {key}
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <a href="/plans" className="block text-gray-700 py-2 text-sm font-medium">
                Plans
              </a>
              <div className="pt-3 border-t border-gray-200">
                {ctaButtons.map((button, index) => (
                  <a
                    key={index}
                    href={button.href}
                    className={cn(
                      'block px-4 py-2 text-sm font-medium rounded-lg mb-2 text-center',
                      button.variant === 'primary'
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700'
                    )}
                  >
                    {button.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}