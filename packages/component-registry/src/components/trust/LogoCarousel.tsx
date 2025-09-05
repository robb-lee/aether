'use client'

import React from 'react'
import { cn } from '@aether/ui/utils/cn'

interface Logo {
  name: string
  src: string
  alt?: string
  width?: number
  height?: number
  href?: string
}

interface LogoCarouselProps {
  title?: string
  logos: Logo[]
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  showTitle?: boolean
  variant?: 'default' | 'grayscale' | 'colored'
  spacing?: 'tight' | 'normal' | 'loose'
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

const defaultLogos: Logo[] = [
  { name: 'Hyperconnect', src: '/logos/hyperconnect.svg', alt: 'Hyperconnect' },
  { name: 'Kakao', src: '/logos/kakao.svg', alt: 'Kakao' },
  { name: 'Musinsa', src: '/logos/musinsa.svg', alt: 'Musinsa' },
  { name: 'Yanolja', src: '/logos/yanolja.svg', alt: 'Yanolja' },
  { name: 'Toss', src: '/logos/toss.svg', alt: 'Toss' },
  { name: 'Karrot', src: '/logos/karrot.svg', alt: 'Karrot' },
  { name: 'Kurly', src: '/logos/kurly.svg', alt: 'Kurly Pay' }
]

export function LogoCarousel({
  title = 'Trusted By Fastest-Growing IT Companies',
  logos = defaultLogos,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
  showTitle = true,
  variant = 'grayscale',
  spacing = 'normal',
  height = 'md',
  className
}: LogoCarouselProps) {
  
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos]

  const speedClasses = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast'
  }

  const spacingClasses = {
    tight: 'space-x-8',
    normal: 'space-x-12',
    loose: 'space-x-16'
  }

  const heightClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  }

  const variantClasses = {
    default: '',
    grayscale: 'grayscale hover:grayscale-0 opacity-70 hover:opacity-100',
    colored: 'opacity-80 hover:opacity-100'
  }

  const animationDirection = direction === 'right' ? 'animate-marquee-reverse' : speedClasses[speed]

  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-8">
            <h6 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </h6>
          </div>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className={cn(
              'flex items-center',
              spacingClasses[spacing],
              animationDirection,
              pauseOnHover && 'hover:[animation-play-state:paused]'
            )}
            style={{
              width: `${duplicatedLogos.length * 200}px`, // Approximate width for smooth scroll
            }}
          >
            {duplicatedLogos.map((logo, index) => {
              const LogoElement = (
                <div
                  key={`${logo.name}-${index}`}
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center transition-all duration-300',
                    heightClasses[height],
                    variantClasses[variant]
                  )}
                  style={{
                    width: logo.width || 'auto',
                    minWidth: '120px' // Minimum width to ensure proper spacing
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    className={cn(
                      'max-h-full w-auto object-contain',
                      heightClasses[height]
                    )}
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.textContent = logo.name
                      fallback.className = 'text-gray-400 text-sm font-medium px-4'
                      target.parentNode?.appendChild(fallback)
                    }}
                  />
                </div>
              )

              return logo.href ? (
                <a
                  key={`${logo.name}-${index}`}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {LogoElement}
                </a>
              ) : (
                LogoElement
              )
            })}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333333%);
          }
        }
        
        @keyframes marquee-reverse {
          from {
            transform: translateX(-33.333333%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee-slow {
          animation: marquee 45s linear infinite;
        }
        
        .animate-marquee-fast {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </section>
  )
}

// Alternative static grid version for fallback
export function LogoGrid({
  title = 'Trusted By Fastest-Growing IT Companies',
  logos = defaultLogos,
  showTitle = true,
  variant = 'grayscale',
  columns = 4,
  className
}: {
  title?: string
  logos?: Logo[]
  showTitle?: boolean
  variant?: 'default' | 'grayscale' | 'colored'
  columns?: number
  className?: string
}) {
  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6'
  }

  const variantClasses = {
    default: '',
    grayscale: 'grayscale hover:grayscale-0 opacity-70 hover:opacity-100',
    colored: 'opacity-80 hover:opacity-100'
  }

  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-8">
            <h6 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </h6>
          </div>
        )}

        <div className={cn('grid gap-8 items-center', gridCols[columns as keyof typeof gridCols] || 'grid-cols-4')}>
          {logos.map((logo, index) => {
            const LogoElement = (
              <div
                key={`${logo.name}-${index}`}
                className={cn(
                  'flex items-center justify-center h-12 transition-all duration-300',
                  variantClasses[variant]
                )}
              >
                <img
                  src={logo.src}
                  alt={logo.alt || logo.name}
                  className="max-h-full w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = document.createElement('div')
                    fallback.textContent = logo.name
                    fallback.className = 'text-gray-400 text-sm font-medium'
                    target.parentNode?.appendChild(fallback)
                  }}
                />
              </div>
            )

            return logo.href ? (
              <a
                key={`${logo.name}-${index}`}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {LogoElement}
              </a>
            ) : (
              LogoElement
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Export with display name for debugging
LogoCarousel.displayName = 'LogoCarousel'
LogoGrid.displayName = 'LogoGrid'