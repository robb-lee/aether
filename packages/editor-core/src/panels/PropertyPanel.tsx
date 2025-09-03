import React, { useState } from 'react';
import { ComponentTreeNode } from '../types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PropertyPanelProps {
  selectedComponent: ComponentTreeNode | null;
  onUpdateComponent: (componentId: string, updates: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general', 'props']));

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
                  {typeof value === 'string' && key !== 'imagePrompt' ? (
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
    </div>
  );
};