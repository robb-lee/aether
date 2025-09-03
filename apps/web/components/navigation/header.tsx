'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

export function Header() {
  const pathname = usePathname()
  
  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="ai-gradient-text">Aether</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`px-3 whitespace-nowrap text-sm font-medium transition-colors ${
                isActivePath('/dashboard') 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/templates" 
              className={`px-3 whitespace-nowrap text-sm font-medium transition-colors ${
                isActivePath('/templates') 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Templates
            </Link>
            <Link 
              href="/usage" 
              className={`px-3 whitespace-nowrap text-sm font-medium transition-colors ${
                isActivePath('/usage') 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Usage
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            {/* Show Create Site button only when not logged in and not on generate page */}
            {!isActivePath('/generate') && !isActivePath('/dashboard') && (
              <Link href="/generate">
                <Button variant="gradient" size="sm">
                  Create Site
                </Button>
              </Link>
            )}
            
            {/* Show User Menu only when on dashboard pages */}
            {isActivePath('/dashboard') && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}