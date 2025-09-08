'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveContainers } from '../../utils/responsive-utils';

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

export type HeaderSimpleProps = z.infer<typeof HeaderSimplePropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function HeaderSimple({
  logo,
  logoText,
  navigation,
  style = 'minimal',
  transparent = false,
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: HeaderSimpleProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const styles = {
    minimal: 'bg-white border-b border-gray-200',
    professional: 'bg-white shadow-sm',
    modern: 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
  };

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <EditableElement
      id="header-simple-wrapper"
      onClick={handleElementClick('header-simple-wrapper', 'section')}
      data-editable-type="section"
    >
      <header 
        className={getElementClassName('header-simple-wrapper', `sticky top-0 z-50 ${transparent ? 'bg-transparent' : styles[style]} ${className}`, selectedElementId)}
        style={getElementStyle('header-simple-wrapper', customStyles)}
      >
        <EditableElement
          id="header-simple-container"
          onClick={handleElementClick('header-simple-container', 'container')}
          data-editable-type="container"
        >
          <div className={`${responsiveContainers.wide} mx-auto ${responsiveSpacing.container.px}`}>
            <EditableElement
              id="header-simple-nav"
              onClick={handleElementClick('header-simple-nav', 'container')}
              data-editable-type="container"
            >
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <EditableElement
                  id="header-simple-logo"
                  onClick={handleElementClick('header-simple-logo', logo ? 'image' : 'text')}
                  data-editable-type={logo ? 'image' : 'text'}
                >
                  <div className="flex items-center">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt={logoText} 
                        className={getElementClassName('header-simple-logo', 'h-8 w-auto', selectedElementId)}
                        style={getElementStyle('header-simple-logo', customStyles)}
                      />
                    ) : (
                      <span 
                        className={getElementClassName('header-simple-logo', 'text-lg sm:text-xl font-bold text-gray-900', selectedElementId)}
                        style={getElementStyle('header-simple-logo', customStyles)}
                      >
                        {logoText}
                      </span>
                    )}
                  </div>
                </EditableElement>
                
                {/* Navigation */}
                <EditableElement
                  id="header-simple-navigation"
                  onClick={handleElementClick('header-simple-navigation', 'container')}
                  data-editable-type="container"
                >
                  <nav className="hidden md:flex space-x-6 lg:space-x-8">
                    {navigation.map((item, index) => (
                      <EditableElement
                        key={index}
                        id={`header-simple-nav-item-${index}`}
                        onClick={handleElementClick(`header-simple-nav-item-${index}`, 'text')}
                        data-editable-type="text"
                      >
                        <a
                          href={item.href}
                          className={getElementClassName(`header-simple-nav-item-${index}`, `text-sm font-medium transition-colors duration-200 ${
                            item.active 
                              ? 'text-blue-600 border-b-2 border-blue-600' 
                              : 'text-gray-700 hover:text-blue-600'
                          }`, selectedElementId)}
                          style={getElementStyle(`header-simple-nav-item-${index}`, customStyles)}
                        >
                          {item.label}
                        </a>
                      </EditableElement>
                    ))}
                  </nav>
                </EditableElement>
                
                {/* Mobile menu button */}
                <EditableElement
                  id="header-simple-mobile-menu"
                  onClick={handleElementClick('header-simple-mobile-menu', 'button')}
                  data-editable-type="button"
                >
                  <button 
                    onClick={toggleMobileMenu}
                    className={getElementClassName('header-simple-mobile-menu', 'md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors', selectedElementId)}
                    style={getElementStyle('header-simple-mobile-menu', customStyles)}
                    aria-label="Toggle mobile menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </EditableElement>
              </div>
            </EditableElement>
          </div>
        </EditableElement>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <EditableElement
            id="header-simple-mobile-nav"
            onClick={handleElementClick('header-simple-mobile-nav', 'container')}
            data-editable-type="container"
          >
            <div className={`md:hidden ${transparent ? 'bg-white/95 backdrop-blur-md' : 'bg-white'} border-t border-gray-200`}>
              <div className={`${responsiveContainers.wide} mx-auto ${responsiveSpacing.container.px} py-4`}>
                <nav className="flex flex-col space-y-3">
                  {navigation.map((item, index) => (
                    <EditableElement
                      key={index}
                      id={`header-simple-mobile-nav-item-${index}`}
                      onClick={handleElementClick(`header-simple-mobile-nav-item-${index}`, 'text')}
                      data-editable-type="text"
                    >
                      <a
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={getElementClassName(`header-simple-mobile-nav-item-${index}`, `block py-2 text-base font-medium transition-colors duration-200 ${
                          item.active 
                            ? 'text-blue-600 bg-blue-50 px-3 rounded-md' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 rounded-md'
                        }`, selectedElementId)}
                        style={getElementStyle(`header-simple-mobile-nav-item-${index}`, customStyles)}
                      >
                        {item.label}
                      </a>
                    </EditableElement>
                  ))}
                </nav>
              </div>
            </div>
          </EditableElement>
        )}
      </header>
    </EditableElement>
  );
}

export default HeaderSimple;