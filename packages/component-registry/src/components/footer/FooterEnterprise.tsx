'use client'

import React from 'react'
import { cn } from '@aether/ui/utils/cn'

interface SocialLink {
  platform: string
  href: string
  icon?: React.ReactNode
  ariaLabel: string
}

interface LegalLink {
  label: string
  href: string
}

interface OfficeLocation {
  name: string
  address: string
}

interface FooterEnterpriseProps {
  logo?: string
  logoText?: string
  companyName?: string
  copyrightText?: string
  socialLinks?: SocialLink[]
  legalLinks?: LegalLink[]
  offices?: OfficeLocation[]
  showSocialSection?: boolean
  className?: string
}

const defaultSocialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/company/aether',
    ariaLabel: 'Follow us on LinkedIn',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    platform: 'YouTube',
    href: 'https://www.youtube.com/@aether',
    ariaLabel: 'Subscribe to our YouTube channel',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h8a2 2 0 012 2v2.59l5.7-3.71A1 1 0 0120 5.5v9a1 1 0 01-1.3.948L14 12.41V15a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    platform: 'X',
    href: 'https://www.twitter.com/aether',
    ariaLabel: 'Follow us on X (Twitter)',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
      </svg>
    )
  }
]

const defaultLegalLinks: LegalLink[] = [
  { label: 'Cookie Preference', href: '/cookie-preference' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'EULA', href: '/eula' }
]

const defaultOffices: OfficeLocation[] = [
  {
    name: 'Headquarter',
    address: '123 Innovation Drive, Suite 100, San Francisco, CA 94105'
  },
  {
    name: 'European Office',
    address: 'Tech Square, 456 Innovation Blvd, London, UK SW1A 1AA'
  },
  {
    name: 'Asia Pacific Office',
    address: 'Marina Bay Financial Centre, 789 Fintech Ave, Singapore 018956'
  }
]

export function FooterEnterprise({
  logo,
  logoText = 'Aether',
  companyName = 'Aether',
  copyrightText,
  socialLinks = defaultSocialLinks,
  legalLinks = defaultLegalLinks,
  offices = defaultOffices,
  showSocialSection = true,
  className
}: FooterEnterpriseProps) {
  const currentYear = new Date().getFullYear()
  const defaultCopyrightText = copyrightText || `© 2024-${currentYear} ${companyName}, Inc. All rights reserved.`

  return (
    <footer className={cn('bg-gray-900 text-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        {showSocialSection && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              {/* Logo */}
              <div className="mb-6 sm:mb-0">
                <a href="/" className="flex items-center">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt={logoText} 
                      className="h-8 w-auto filter brightness-0 invert" 
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {logoText}
                    </span>
                  )}
                </a>
              </div>

              {/* Social Links */}
              <div className="flex space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.ariaLabel}
                  >
                    {social.icon || (
                      <span className="text-sm font-medium">
                        {social.platform}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 lg:order-1">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Company Information */}
            <div className="lg:order-2 lg:text-right">
              {/* Copyright */}
              <p className="text-sm text-gray-400 mb-4">
                {defaultCopyrightText}
              </p>

              {/* Office Locations */}
              {offices.length > 0 && (
                <div className="space-y-1">
                  {offices.map((office, index) => (
                    <p key={index} className="text-xs text-gray-500">
                      <span className="font-medium text-gray-400">
                        {office.name}:
                      </span>{' '}
                      {office.address}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Export with display name for debugging
FooterEnterprise.displayName = 'FooterEnterprise'