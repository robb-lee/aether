'use client'

import { ReactNode } from 'react'

interface DeviceFrameProps {
  device: 'desktop' | 'tablet' | 'mobile'
  zoom: number
  children: ReactNode
  className?: string
}

export function DeviceFrame({ device, zoom, children, className = '' }: DeviceFrameProps) {
  const getDeviceStyles = () => {
    const baseStyles = {
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top center',
      transition: 'all 0.3s ease-in-out'
    }

    switch (device) {
      case 'mobile':
        return {
          ...baseStyles,
          width: '375px',
          minHeight: '667px',
          maxWidth: '375px',
          border: '8px solid #1f2937',
          borderRadius: '24px',
          background: '#000',
          padding: '8px'
        }
      
      case 'tablet':
        return {
          ...baseStyles,
          width: '768px',
          minHeight: '1024px',
          maxWidth: '768px',
          border: '12px solid #374151',
          borderRadius: '16px',
          background: '#1f2937',
          padding: '12px'
        }
      
      case 'desktop':
        return {
          ...baseStyles,
          width: '100%',
          minHeight: '600px',
          border: '2px solid #4b5563',
          borderRadius: '8px',
          background: '#374151',
          padding: '2px'
        }
      
      default:
        return baseStyles
    }
  }

  // Create iframe URL for proper viewport simulation
  const getIframeUrl = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      // Create a clean iframe URL without device frame wrapper
      return `${currentUrl.origin}${currentUrl.pathname}?iframe=true&device=${device}`;
    }
    return '';
  }

  const getContentStyles = () => {
    const baseStyles = {
      width: '100%',
      background: '#fff',
      position: 'relative' as const,
      overflow: 'hidden'
    }

    switch (device) {
      case 'mobile':
        return {
          ...baseStyles,
          minHeight: '651px', // 667 - 16px padding
          borderRadius: '16px',
          // Mobile viewport simulation
          fontSize: '16px', // Prevent zoom on input focus
        }
      
      case 'tablet':
        return {
          ...baseStyles,
          minHeight: '1000px', // 1024 - 24px padding
          borderRadius: '8px',
        }
      
      case 'desktop':
        return {
          ...baseStyles,
          minHeight: '596px', // 600 - 4px padding
          borderRadius: '6px',
        }
      
      default:
        return {
          ...baseStyles,
          minHeight: '600px',
        }
    }
  }

  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <div style={getDeviceStyles()} className="relative mx-auto">
        {/* Device chrome/bezel */}
        {device === 'mobile' && (
          <>
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
            {/* Speaker */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-400 rounded-full"></div>
          </>
        )}
        
        {device === 'tablet' && (
          <>
            {/* Home button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-gray-500 rounded-full"></div>
          </>
        )}

        {/* Content area with simulated viewport */}
        <div 
          style={getContentStyles()}
          className={`viewport-simulator viewport-${device}`}
          data-device={device}
        >
          <div 
            className="w-full h-full overflow-auto" 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              // Force media query evaluation based on container width
              containerType: 'inline-size'
            }}
          >
            <div 
              className="responsive-container"
              style={{
                width: '100%',
                minHeight: '100%'
              }}
            >
              {children}
            </div>
          </div>
        </div>
        
        {/* Device info overlay */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur">
          {device.charAt(0).toUpperCase() + device.slice(1)} {zoom}%
        </div>
      </div>
    </div>
  )
}

export default DeviceFrame