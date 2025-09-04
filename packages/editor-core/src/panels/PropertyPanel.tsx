import React, { useState } from 'react';
import { ComponentTreeNode, ComponentStyles, ResponsiveSettings, AnimationSettings } from '../types';
import { ChevronDown, ChevronRight, Smartphone, Tablet, Monitor, Zap } from 'lucide-react';
import { ColorPicker, SpacingControl, TypographyControl } from '../controls';

interface PropertyPanelProps {
  selectedComponent: ComponentTreeNode | null;
  onUpdateComponent: (componentId: string, updates: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent
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
        <p className="text-xs text-gray-500 mt-1">{selectedComponent.type}</p>
      </div>

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