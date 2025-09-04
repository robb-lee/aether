import React from 'react'
// Import all available components from preview components
import { 
  HeroSplit, 
  HeroCentered, 
  FeaturesGrid, 
  HeaderNav, 
  FooterSimple,
  CTASimple
} from '@/app/preview/[id]/components/RegistryComponents'

interface ComponentRendererProps {
  component: any
  isEditor?: boolean
  onElementClick?: (elementId: string, elementType: string) => void
  selectedElementId?: string
}

// Map componentId to actual imported components
const componentMap = {
  'hero-split': HeroSplit,
  'hero-centered': HeroCentered, 
  'features-grid': FeaturesGrid,
  'header-nav': HeaderNav,
  'footer-simple': FooterSimple,
  'cta-simple': CTASimple
}

export function ComponentRenderer({ 
  component, 
  isEditor = false,
  onElementClick,
  selectedElementId 
}: ComponentRendererProps) {
  if (!component) return null

  const { componentId, type, props = {}, children = [] } = component

  // Use componentId if available, fallback to type
  const componentKey = componentId || type
  const Component = componentMap[componentKey as keyof typeof componentMap]

  // For editor mode, show placeholder if component not found
  if (!Component && isEditor) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded">
        <div className="text-sm font-medium text-gray-600 mb-1">
          {componentKey || 'Unknown Component'}
        </div>
        {props.title && (
          <div className="text-lg font-bold text-gray-800">{props.title}</div>
        )}
        {props.subtitle && (
          <div className="text-gray-600">{props.subtitle}</div>
        )}
        {props.content && (
          <div className="text-gray-600 mt-2">{props.content}</div>
        )}
        {children.length > 0 && (
          <div className="mt-4 space-y-2">
            {children.map((child: any, index: number) => (
              <ComponentRenderer 
                key={child.id || index} 
                component={child} 
                isEditor={isEditor}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // For production mode, show error if component not found
  if (!Component) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">Component Unavailable</h3>
        <p className="text-yellow-700 mb-4">Component "{componentKey}" not found</p>
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Component ID:</strong> {componentKey || 'Unknown'}
          </p>
          <details className="mt-2">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Show Props
            </summary>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(props, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  // Render the component with error boundary
  try {
    // For components with children, we need to render them recursively
    if (children && children.length > 0) {
      const renderedChildren = children.map((child: any, index: number) => (
        <ComponentRenderer 
          key={child.id || index} 
          component={child} 
          isEditor={isEditor}
        />
      ))
      
      return (
        <Component 
          {...props}
          onElementClick={onElementClick}
          selectedElementId={selectedElementId}
          customStyles={component.customStyles}
          isEditor={isEditor}
        >
          {renderedChildren}
        </Component>
      )
    }
    
    return (
      <Component 
        {...props}
        onElementClick={onElementClick}
        selectedElementId={selectedElementId}
        customStyles={component.customStyles}
        isEditor={isEditor}
      />
    )
  } catch (renderError) {
    console.error('Component render error:', renderError)
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Render Error</h3>
        <p className="text-red-700">Failed to render {componentKey}</p>
        <details className="mt-2">
          <summary className="text-sm font-medium text-red-700 cursor-pointer">
            Error Details
          </summary>
          <pre className="text-xs mt-2 p-2 bg-white rounded overflow-auto">
            {String(renderError)}
          </pre>
        </details>
      </div>
    )
  }
}