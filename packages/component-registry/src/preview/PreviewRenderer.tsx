import React from 'react';
import { ComponentDefinition } from '../types/component';
import { getDefaultRegistry } from '../index';

/**
 * Component preview renderer for testing and showcasing
 */
export interface PreviewRendererProps {
  componentId: string;
  props?: Record<string, any>;
  variant?: string;
  showMetadata?: boolean;
  className?: string;
}

/**
 * Renders a component with given props for preview
 */
export function PreviewRenderer({
  componentId,
  props = {},
  variant,
  showMetadata = false,
  className = ''
}: PreviewRendererProps) {
  const [component, setComponent] = React.useState<ComponentDefinition | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadComponent() {
      try {
        const registry = await getDefaultRegistry();
        const comp = registry.getById(componentId);
        
        if (!comp) {
          setError(`Component ${componentId} not found in registry`);
          return;
        }
        
        setComponent(comp);
        setError(null);
      } catch (err) {
        setError(`Failed to load component: ${err}`);
      }
    }
    
    loadComponent();
  }, [componentId]);

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Preview Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Merge default props with provided props
  const mergedProps = {
    ...component.defaultProps,
    ...props,
    ...(variant && { variant })
  };

  // Validate props against schema
  try {
    component.propsSchema.parse(mergedProps);
  } catch (validationError) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">Props Validation Error</h3>
        <p className="text-yellow-600">Invalid props for {component.name}</p>
        <pre className="text-xs mt-2 text-yellow-700">
          {JSON.stringify(validationError, null, 2)}
        </pre>
      </div>
    );
  }

  const Component = component.component;

  return (
    <div className={`component-preview ${className}`}>
      {/* Render component */}
      <div className="component-container">
        <Component {...mergedProps} />
      </div>
      
      {/* Metadata display */}
      {showMetadata && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Component Metadata</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Basic Info</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>ID:</strong> {component.id}</li>
                <li><strong>Name:</strong> {component.name}</li>
                <li><strong>Category:</strong> {component.category}</li>
                <li><strong>Version:</strong> {component.metadata.version}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Performance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Lighthouse:</strong> {component.metadata.performance.lighthouse}/100</li>
                <li><strong>Bundle:</strong> {component.metadata.performance.bundleSize}KB</li>
                <li><strong>Render:</strong> {component.metadata.performance.renderTime}ms</li>
                <li><strong>WCAG:</strong> {component.metadata.accessibility.wcagLevel}</li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-700 mb-2">AI Hints</h4>
              <div className="text-sm text-gray-600">
                <p><strong>Industries:</strong> {component.metadata.aiHints?.industries.join(', ')}</p>
                <p><strong>Keywords:</strong> {component.metadata.aiHints?.keywords.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Gallery view for showcasing multiple components
 */
export interface ComponentGalleryProps {
  components: string[];
  showMetadata?: boolean;
  className?: string;
}

export function ComponentGallery({
  components,
  showMetadata = false,
  className = ''
}: ComponentGalleryProps) {
  return (
    <div className={`space-y-12 ${className}`}>
      {components.map(componentId => (
        <div key={componentId} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">{componentId}</h3>
          </div>
          <PreviewRenderer 
            componentId={componentId}
            showMetadata={showMetadata}
            className="p-0"
          />
        </div>
      ))}
    </div>
  );
}

export default PreviewRenderer;