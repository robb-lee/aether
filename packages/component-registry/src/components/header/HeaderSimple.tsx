import React from 'react';
import { z } from 'zod';

const NavigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional()
});

export const HeaderSimplePropsSchema = z.object({
  logo: z.string().optional(),
  logoText: z.string(),
  navigation: z.array(NavigationItemSchema),
  style: z.enum(['minimal', 'professional', 'modern']).default('minimal'),
  transparent: z.boolean().default(false),
  className: z.string().optional()
});

export type HeaderSimpleProps = z.infer<typeof HeaderSimplePropsSchema>;

export function HeaderSimple({
  logo,
  logoText,
  navigation,
  style = 'minimal',
  transparent = false,
  className = ''
}: HeaderSimpleProps) {
  const styles = {
    minimal: 'bg-white border-b border-gray-200',
    professional: 'bg-white shadow-sm',
    modern: 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
  };

  return (
    <header className={`sticky top-0 z-50 ${transparent ? 'bg-transparent' : styles[style]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
                className={`text-sm font-medium transition-colors duration-200 ${
                  item.active 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderSimple;