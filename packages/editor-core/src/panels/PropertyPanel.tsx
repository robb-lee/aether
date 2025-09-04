import React, { useState } from 'react';
import { ComponentTreeNode, ComponentStyles, ResponsiveSettings, AnimationSettings } from '../types';
import { ChevronDown, ChevronRight, Smartphone, Tablet, Monitor, Zap } from 'lucide-react';
import { ColorPicker, SpacingControl, TypographyControl } from '../controls';

interface PropertyPanelProps {
  selectedComponent: ComponentTreeNode | null;
  onUpdateComponent: (componentId: string, updates: any) => void;
  selectedElementId?: string;
  selectedElementType?: string;
  onElementStyleUpdate?: (elementId: string, styleUpdates: React.CSSProperties) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  selectedElementId,
  selectedElementType,
  onElementStyleUpdate
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general', 'props']));
  const [responsiveMode, setResponsiveMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Dynamic UI based on selected element type
  // Helper functions to map element IDs to component props
  const getButtonText = (elementId: string | undefined, component: ComponentTreeNode | null): string => {
    if (!elementId || !component) return '';
    
    switch (elementId) {
      // Primary buttons
      case 'hero-primary-button':
      case 'hero-centered-primary-button':
      case 'hero-video-primary-button':
      case 'cta-simple-button':
        return component.props?.ctaText || '';
      
      // Secondary buttons
      case 'hero-secondary-button':
      case 'hero-centered-secondary-button':
      case 'hero-video-secondary-button':
        return component.props?.secondaryCtaText || '';
      
      default:
        return component.props?.ctaText || '';
    }
  };
  
  const getButtonPropName = (elementId: string | undefined): string | null => {
    if (!elementId) return null;
    
    switch (elementId) {
      // Primary buttons
      case 'hero-primary-button':
      case 'hero-centered-primary-button':
      case 'hero-video-primary-button':
      case 'cta-simple-button':
        return 'ctaText';
      
      // Secondary buttons
      case 'hero-secondary-button':
      case 'hero-centered-secondary-button':
      case 'hero-video-secondary-button':
        return 'secondaryCtaText';
      
      default:
        return 'ctaText';
    }
  };
  
  const getTextContent = (elementId: string | undefined, component: ComponentTreeNode | null): string => {
    if (!elementId || !component) {
      console.log('getTextContent: No elementId or component', { elementId, component });
      return '';
    }
    
    console.log('getTextContent:', { elementId, componentProps: component.props });
    
    switch (elementId) {
      // Hero components
      case 'hero-title':
      case 'hero-centered-title':
      case 'hero-video-title':
        return component.props?.title || '';
      case 'hero-subtitle':
      case 'hero-centered-subtitle':
      case 'hero-video-subtitle':
        return component.props?.subtitle || '';
      case 'hero-description':
      case 'hero-centered-description':
      case 'hero-video-description':
        return component.props?.description || '';
      
      // Features components
      case 'features-grid-title':
      case 'features-cards-title':
        return component.props?.title || '';
      case 'features-grid-subtitle':
      case 'features-cards-subtitle':
        return component.props?.subtitle || '';
      case 'features-grid-description':
      case 'features-cards-description':
        return component.props?.description || '';
      
      // CTA components
      case 'cta-simple-title':
        return component.props?.title || '';
      case 'cta-simple-description':
        return component.props?.description || '';
      
      // Features grid/cards individual items
      default:
        if (elementId.includes('features-grid-title-')) {
          const index = parseInt(elementId.split('-').pop() || '0');
          return component.props?.features?.[index]?.title || '';
        }
        if (elementId.includes('features-grid-description-')) {
          const index = parseInt(elementId.split('-').pop() || '0');
          return component.props?.features?.[index]?.description || '';
        }
        if (elementId.includes('features-cards-item-title-')) {
          const index = parseInt(elementId.split('-').pop() || '0');
          return component.props?.features?.[index]?.title || '';
        }
        if (elementId.includes('features-cards-item-description-')) {
          const index = parseInt(elementId.split('-').pop() || '0');
          return component.props?.features?.[index]?.description || '';
        }
        if (elementId.includes('header-simple-nav-item-')) {
          const index = parseInt(elementId.split('-').pop() || '0');
          return component.props?.navigation?.[index]?.label || '';
        }
        
        console.log('getTextContent: Unknown elementId', elementId);
        return '';
    }
  };
  
  const getTextPropName = (elementId: string | undefined): string | null => {
    if (!elementId) return null;
    
    switch (elementId) {
      // Hero components
      case 'hero-title':
      case 'hero-centered-title':
      case 'hero-video-title':
      case 'features-grid-title':
      case 'features-cards-title':
      case 'cta-simple-title':
        return 'title';
      case 'hero-subtitle':
      case 'hero-centered-subtitle':
      case 'hero-video-subtitle':
      case 'features-grid-subtitle':
      case 'features-cards-subtitle':
        return 'subtitle';
      case 'hero-description':
      case 'hero-centered-description':
      case 'hero-video-description':
      case 'features-grid-description':
      case 'cta-simple-description':
        return 'description';
      
      // Dynamic features items
      default:
        if (elementId.includes('features-grid-title-') || elementId.includes('features-cards-item-title-')) {
          return 'features';
        }
        if (elementId.includes('features-grid-description-') || elementId.includes('features-cards-item-description-')) {
          return 'features';
        }
        if (elementId.includes('header-simple-nav-item-')) {
          return 'navigation';
        }
        return null;
    }
  };

  const renderElementSpecificProperties = () => {
    if (!selectedElementId || !selectedElementType) return null;

    switch (selectedElementType) {
      case 'text':
        return (
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('text-editing')}
            >
              <span className="text-sm font-medium">Text Properties</span>
              {expandedSections.has('text-editing') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('text-editing') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Text Content</label>
                  <textarea
                    className="w-full mt-1 px-2 py-1 text-sm border rounded resize-none"
                    rows={selectedElementId?.includes('description') ? 3 : 2}
                    value={getTextContent(selectedElementId, selectedComponent)}
                    onChange={(e) => {
                      console.log('Text onChange triggered:', { 
                        value: e.target.value, 
                        selectedElementId, 
                        selectedComponent: selectedComponent?.id,
                        propName: getTextPropName(selectedElementId)
                      });
                      
                      if (selectedComponent && onUpdateComponent) {
                        const propName = getTextPropName(selectedElementId);
                        if (propName) {
                          console.log('Calling onUpdateComponent with:', {
                            componentId: selectedComponent.id,
                            propName,
                            value: e.target.value
                          });
                          
                          onUpdateComponent(selectedComponent.id, {
                            props: {
                              ...selectedComponent.props,
                              [propName]: e.target.value
                            }
                          });
                        }
                      }
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder="Enter text content"
                    autoFocus={true}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Text Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 border rounded"
                    onChange={(e) => {
                      // Apply text color to selected element
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { color: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Font Size</label>
                  <select 
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { fontSize: e.target.value });
                      }
                    }}
                  >
                    <option value="text-sm">Small</option>
                    <option value="text-base">Base</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra Large</option>
                    <option value="text-2xl">2X Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Font Weight</label>
                  <select className="w-full mt-1 px-2 py-1 text-sm border rounded">
                    <option value="font-normal">Normal</option>
                    <option value="font-medium">Medium</option>
                    <option value="font-semibold">Semi Bold</option>
                    <option value="font-bold">Bold</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('button-editing')}
            >
              <span className="text-sm font-medium">Button Properties</span>
              {expandedSections.has('button-editing') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('button-editing') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Button Text</label>
                  <input
                    type="text"
                    placeholder="Enter button text"
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    value={getButtonText(selectedElementId, selectedComponent)}
                    onChange={(e) => {
                      if (selectedComponent && onUpdateComponent) {
                        const propName = getButtonPropName(selectedElementId);
                        if (propName) {
                          onUpdateComponent(selectedComponent.id, {
                            props: {
                              ...selectedComponent.props,
                              [propName]: e.target.value
                            }
                          });
                        }
                      }
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Background Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 border rounded"
                    defaultValue="#3B82F6"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { backgroundColor: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Text Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 border rounded"
                    defaultValue="#FFFFFF"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { color: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Border Radius</label>
                  <select 
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    defaultValue="rounded-lg"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { borderRadius: e.target.value });
                      }
                    }}
                  >
                    <option value="rounded-none">None</option>
                    <option value="rounded-sm">Small</option>
                    <option value="rounded">Base</option>
                    <option value="rounded-lg">Large</option>
                    <option value="rounded-xl">Extra Large</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 'container':
        return (
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('container-editing')}
            >
              <span className="text-sm font-medium">Container Properties</span>
              {expandedSections.has('container-editing') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('container-editing') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Background Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 border rounded"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { backgroundColor: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Padding</label>
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    <input type="number" placeholder="T" className="px-1 py-1 text-xs border rounded" />
                    <input type="number" placeholder="R" className="px-1 py-1 text-xs border rounded" />
                    <input type="number" placeholder="B" className="px-1 py-1 text-xs border rounded" />
                    <input type="number" placeholder="L" className="px-1 py-1 text-xs border rounded" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Border Radius</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('image-editing')}
            >
              <span className="text-sm font-medium">Image Properties</span>
              {expandedSections.has('image-editing') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('image-editing') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600 font-medium">Image URL</label>
                  <input
                    type="text"
                    value={selectedComponent?.props?.imageUrl || ''}
                    onChange={(e) => {
                      if (selectedComponent && onUpdateComponent) {
                        onUpdateComponent(selectedComponent.id, {
                          props: {
                            ...selectedComponent.props,
                            imageUrl: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="Enter image URL"
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-medium">Upload Image</label>
                  <div className="mt-1 space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && selectedComponent && onUpdateComponent) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              onUpdateComponent(selectedComponent.id, {
                                props: {
                                  ...selectedComponent.props,
                                  imageUrl: reader.result
                                }
                              });
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="upload-hero-image-element"
                      />
                      <label
                        htmlFor="upload-hero-image-element"
                        className="block w-full px-3 py-2 text-xs text-center bg-gray-100 hover:bg-gray-200 border rounded-md cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                    {selectedComponent?.props?.imageUrl && (
                      <img
                        src={selectedComponent.props.imageUrl}
                        alt="Current image"
                        className="w-full h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Alt Text</label>
                  <input
                    type="text"
                    value={selectedComponent?.props?.imageAlt || ''}
                    onChange={(e) => {
                      if (selectedComponent && onUpdateComponent) {
                        onUpdateComponent(selectedComponent.id, {
                          props: {
                            ...selectedComponent.props,
                            imageAlt: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="Describe the image"
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Border Radius</label>
                  <select 
                    className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { borderRadius: e.target.value });
                      }
                    }}
                  >
                    <option value="rounded-none">None</option>
                    <option value="rounded-sm">Small</option>
                    <option value="rounded">Base</option>
                    <option value="rounded-lg">Large</option>
                    <option value="rounded-xl">Extra Large</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 'section':
        return (
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('section-editing')}
            >
              <span className="text-sm font-medium">Section Properties</span>
              {expandedSections.has('section-editing') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('section-editing') && (
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Background Style</label>
                  <select className="w-full mt-1 px-2 py-1 text-sm border rounded">
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Background Image</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Background Color</label>
                  <input
                    type="color"
                    className="w-full mt-1 h-8 border rounded"
                    onChange={(e) => {
                      if (selectedElementId && onElementStyleUpdate) {
                        onElementStyleUpdate(selectedElementId, { backgroundColor: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Section Spacing</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Top"
                      className="px-2 py-1 text-sm border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Bottom"
                      className="px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };


  // If we have element selection, show element-specific properties first
  if (selectedElementId && selectedElementType) {
    console.log('PropertyPanel Debug:', { selectedElementId, selectedElementType, selectedComponent })
    return (
      <div className="h-full overflow-y-auto property-panel">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-gray-900">Element Properties</h3>
          <p className="text-xs text-gray-500 mt-1">
            {selectedElementType} ({selectedElementId})
          </p>
          {selectedComponent && (
            <p className="text-xs text-gray-400 mt-1">
              in {selectedComponent.type}
            </p>
          )}
        </div>
        {renderElementSpecificProperties()}
        
        {/* Show component-level properties in collapsed sections */}
        {selectedComponent && (
          <div className="border-t border-gray-200 mt-4">
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-medium text-xs text-gray-700 uppercase tracking-wide">
                Container Properties
              </h4>
            </div>
            {/* Component Props Section */}
            <div className="border-b">
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                onClick={() => toggleSection('component-props')}
              >
                <span className="text-sm font-medium">Component Props</span>
                {expandedSections.has('component-props') ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {expandedSections.has('component-props') && selectedComponent.props && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    {Object.entries(selectedComponent.props).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={value as string || ''}
                          onChange={(e) => handlePropChange(key, e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-sm border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // If no component and no element selection, show empty state
  if (!selectedComponent) {
    return (
      <div className="p-4 text-gray-500">
        <p className="text-sm">Select a component to view its properties</p>
      </div>
    );
  }


  const handlePropChange = (propName: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [propName]: value
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdateComponent(selectedComponent.id, {
      position: {
        ...selectedComponent.position,
        [axis]: value
      }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdateComponent(selectedComponent.id, {
      size: {
        ...selectedComponent.size,
        [dimension]: value
      }
    });
  };

  const handleStyleChange = (styleProp: keyof ComponentStyles, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        [styleProp]: value
      }
    });
  };

  const handleResponsiveStyleChange = (styleProp: keyof ComponentStyles, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      responsive: {
        ...selectedComponent.responsive,
        [responsiveMode]: {
          ...selectedComponent.responsive?.[responsiveMode],
          [styleProp]: value
        }
      }
    });
  };

  const handleAnimationChange = (prop: keyof AnimationSettings, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      animations: {
        ...selectedComponent.animations,
        [prop]: value
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-gray-900">Properties</h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedElementType ? `${selectedElementType} (${selectedElementId})` : selectedComponent?.type || 'No selection'}
        </p>
      </div>

      {/* Element-specific properties for granular editing */}
      {renderElementSpecificProperties()}

      {/* General Section */}
          <div className="border-b">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection('general')}
            >
              <span className="text-sm font-medium">General</span>
              {expandedSections.has('general') ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.has('general') && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">ID</label>
                    <input
                      type="text"
                      value={selectedComponent.id}
                      className="w-full mt-1 px-2 py-1 text-sm border rounded bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Type</label>
                    <input
                      type="text"
                      value={selectedComponent.type}
                      className="w-full mt-1 px-2 py-1 text-sm border rounded bg-gray-50"
                      disabled
                    />
                  </div>
                </div>
              </div>
        )}
      </div>

      {/* Position & Size Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('layout')}
        >
          <span className="text-sm font-medium">Layout</span>
          {expandedSections.has('layout') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('layout') && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">X</label>
                <input
                  type="number"
                  value={selectedComponent.position?.x || 0}
                  onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Y</label>
                <input
                  type="number"
                  value={selectedComponent.position?.y || 0}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Width</label>
                <input
                  type="number"
                  value={selectedComponent.size?.width || 'auto'}
                  onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Height</label>
                <input
                  type="number"
                  value={selectedComponent.size?.height || 'auto'}
                  onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Component Props Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('props')}
        >
          <span className="text-sm font-medium">Component Props</span>
          {expandedSections.has('props') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('props') && selectedComponent.props && (
          <div className="px-4 pb-4">
            {/* Special UI for Hero components */}
            {(selectedComponent.type === 'hero-split' || selectedComponent.type === 'hero-centered') ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 font-medium">Title</label>
                  <textarea
                    value={selectedComponent.props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md resize-none"
                    rows={2}
                    placeholder="Enter hero title"
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    autoFocus={true}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Subtitle</label>
                  <input
                    type="text"
                    value={selectedComponent.props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                    placeholder="Enter subtitle"
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Description</label>
                  <textarea
                    value={selectedComponent.props.description || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md resize-none"
                    rows={3}
                    placeholder="Enter description"
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Primary Button</label>
                    <input
                      type="text"
                      value={selectedComponent.props.ctaText || ''}
                      onChange={(e) => handlePropChange('ctaText', e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                      placeholder="Button text"
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {selectedComponent.props.secondaryCtaText !== undefined && (
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Secondary Button</label>
                      <input
                        type="text"
                        value={selectedComponent.props.secondaryCtaText || ''}
                        onChange={(e) => handlePropChange('secondaryCtaText', e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                        placeholder="Secondary button text"
                        onKeyDown={(e) => e.stopPropagation()}
                        onKeyUp={(e) => e.stopPropagation()}
                        onKeyPress={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Hero Image</label>
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={selectedComponent.props.imageUrl || ''}
                      onChange={(e) => handlePropChange('imageUrl', e.target.value)}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-2 text-sm border rounded-md"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              handlePropChange('imageUrl', reader.result)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="upload-hero-image"
                      />
                      <label
                        htmlFor="upload-hero-image"
                        className="block w-full px-3 py-2 text-xs text-center bg-gray-100 hover:bg-gray-200 border rounded-md cursor-pointer transition-colors"
                      >
                        Upload Image
                      </label>
                    </div>
                    {selectedComponent.props.imageUrl && (
                      <img
                        src={selectedComponent.props.imageUrl}
                        alt="Hero preview"
                        className="w-full h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : selectedComponent.type === 'features-grid' ? (
              /* Special UI for Features Grid component */
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 font-medium">Section Title</label>
                  <input
                    type="text"
                    value={selectedComponent.props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                    placeholder="Enter section title"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Subtitle</label>
                  <input
                    type="text"
                    value={selectedComponent.props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                    placeholder="Enter subtitle"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Description</label>
                  <textarea
                    value={selectedComponent.props.description || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border rounded-md resize-none"
                    rows={3}
                    placeholder="Enter section description"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 font-medium">Features</label>
                  <div className="mt-1 space-y-3">
                    {(selectedComponent.props.features || []).map((feature: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md bg-gray-50">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={feature.title || ''}
                            onChange={(e) => {
                              const updatedFeatures = [...(selectedComponent.props.features || [])];
                              updatedFeatures[index] = { ...feature, title: e.target.value };
                              handlePropChange('features', updatedFeatures);
                            }}
                            className="w-full px-2 py-1 text-sm border rounded"
                            placeholder="Feature title"
                          />
                          <textarea
                            value={feature.description || ''}
                            onChange={(e) => {
                              const updatedFeatures = [...(selectedComponent.props.features || [])];
                              updatedFeatures[index] = { ...feature, description: e.target.value };
                              handlePropChange('features', updatedFeatures);
                            }}
                            className="w-full px-2 py-1 text-sm border rounded resize-none"
                            rows={2}
                            placeholder="Feature description"
                          />
                          <button
                            onClick={() => {
                              const updatedFeatures = selectedComponent.props.features.filter((_: any, i: number) => i !== index);
                              handlePropChange('features', updatedFeatures);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove feature
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newFeature = { title: 'New Feature', description: 'Feature description' };
                        const updatedFeatures = [...(selectedComponent.props.features || []), newFeature];
                        handlePropChange('features', updatedFeatures);
                      }}
                      className="w-full px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-md transition-colors"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Default props UI for other components */
              <div className="space-y-3">
                {Object.entries(selectedComponent.props).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {key === 'src' || key === 'imageSrc' || key === 'imageUrl' ? (
                      <div className="mt-1 space-y-2">
                        <input
                          type="text"
                          value={value as string || ''}
                          onChange={(e) => handlePropChange(key, e.target.value)}
                          placeholder="Enter image URL"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // Convert to base64 for local preview
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  handlePropChange(key, reader.result)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                            id={`upload-${key}`}
                          />
                          <label
                            htmlFor={`upload-${key}`}
                            className="block w-full px-3 py-1 text-xs text-center bg-gray-100 hover:bg-gray-200 border rounded cursor-pointer transition-colors"
                          >
                            Upload Image
                          </label>
                        </div>
                        {value && (
                          <img
                            src={value as string}
                            alt="Preview"
                            className="w-full h-20 object-cover rounded border"
                          />
                        )}
                      </div>
                    ) : typeof value === 'string' && key !== 'imagePrompt' ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        className="w-full mt-1 px-2 py-1 text-sm border rounded"
                      />
                    ) : typeof value === 'boolean' ? (
                      <label className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handlePropChange(key, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{value ? 'Yes' : 'No'}</span>
                      </label>
                    ) : typeof value === 'object' && Array.isArray(value) ? (
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                        {value.length} items
                      </div>
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                        {JSON.stringify(value, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Styles Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('styles')}
        >
          <span className="text-sm font-medium">Styles</span>
          {expandedSections.has('styles') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('styles') && (
          <div className="px-4 pb-4">
            <div className="space-y-3">
              <ColorPicker
                label="Background Color"
                value={selectedComponent.styles?.backgroundColor || '#FFFFFF'}
                onChange={(color) => handleStyleChange('backgroundColor', color)}
              />
              <ColorPicker
                label="Text Color"
                value={selectedComponent.styles?.color || '#000000'}
                onChange={(color) => handleStyleChange('color', color)}
              />
              <SpacingControl
                label="Padding"
                type="padding"
                value={selectedComponent.styles?.padding || '0'}
                onChange={(value) => handleStyleChange('padding', value)}
              />
              <SpacingControl
                label="Margin"
                type="margin"
                value={selectedComponent.styles?.margin || '0'}
                onChange={(value) => handleStyleChange('margin', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Typography Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('typography')}
        >
          <span className="text-sm font-medium">Typography</span>
          {expandedSections.has('typography') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('typography') && (
          <div className="px-4 pb-4">
            <TypographyControl
              value={selectedComponent.styles?.typography || {}}
              onChange={(typography) => handleStyleChange('typography', typography)}
            />
          </div>
        )}
      </div>

      {/* Responsive Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('responsive')}
        >
          <span className="text-sm font-medium">Responsive</span>
          {expandedSections.has('responsive') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('responsive') && (
          <div className="px-4 pb-4">
            {/* Responsive Mode Selector */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setResponsiveMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  responsiveMode === 'mobile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setResponsiveMode('tablet')}
                className={`p-2 rounded transition-colors ${
                  responsiveMode === 'tablet' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setResponsiveMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  responsiveMode === 'desktop' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Editing {responsiveMode} view</p>
            <div className="space-y-3">
              <SpacingControl
                label="Padding"
                type="padding"
                value={selectedComponent.responsive?.[responsiveMode]?.padding || selectedComponent.styles?.padding || '0'}
                onChange={(value) => handleResponsiveStyleChange('padding', value)}
              />
              <SpacingControl
                label="Margin"
                type="margin"
                value={selectedComponent.responsive?.[responsiveMode]?.margin || selectedComponent.styles?.margin || '0'}
                onChange={(value) => handleResponsiveStyleChange('margin', value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animations Section */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => toggleSection('animations')}
        >
          <span className="text-sm font-medium">Animations</span>
          {expandedSections.has('animations') ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.has('animations') && (
          <div className="px-4 pb-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Animation Type</span>
                </label>
                <select
                  value={selectedComponent.animations?.type || 'none'}
                  onChange={(e) => handleAnimationChange('type', e.target.value)}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                >
                  <option value="none">None</option>
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide In</option>
                  <option value="scale">Scale In</option>
                  <option value="rotate">Rotate In</option>
                </select>
              </div>
              {selectedComponent.animations?.type && selectedComponent.animations.type !== 'none' && (
                <>
                  <div>
                    <label className="text-xs text-gray-600">Duration (ms)</label>
                    <input
                      type="number"
                      value={selectedComponent.animations?.duration || 300}
                      onChange={(e) => handleAnimationChange('duration', Number(e.target.value))}
                      className="w-full mt-1 px-2 py-1 text-sm border rounded"
                      min="0"
                      max="5000"
                      step="100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Delay (ms)</label>
                    <input
                      type="number"
                      value={selectedComponent.animations?.delay || 0}
                      onChange={(e) => handleAnimationChange('delay', Number(e.target.value))}
                      className="w-full mt-1 px-2 py-1 text-sm border rounded"
                      min="0"
                      max="5000"
                      step="100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Easing</label>
                    <select
                      value={selectedComponent.animations?.easing || 'ease'}
                      onChange={(e) => handleAnimationChange('easing', e.target.value)}
                      className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    >
                      <option value="ease">Ease</option>
                      <option value="ease-in">Ease In</option>
                      <option value="ease-out">Ease Out</option>
                      <option value="ease-in-out">Ease In Out</option>
                      <option value="linear">Linear</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};