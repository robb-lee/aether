'use client'

import { useState, useCallback } from 'react'
import { Canvas, PropertyPanel, ComponentLibrary, LayerPanel } from '@aether/editor-core'
import type { ComponentTreeNode } from '@aether/editor-core'

// Test component tree
const testComponentTree: ComponentTreeNode = {
  id: 'root',
  type: 'div',
  props: {
    className: 'min-h-screen bg-gray-50',
  },
  children: [
    {
      id: 'hero-1',
      type: 'hero-split',
      props: {
        title: 'Welcome to Aether',
        subtitle: 'Build amazing websites in seconds',
        ctaText: 'Get Started',
      },
      styles: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '80px 20px',
      },
      children: []
    },
    {
      id: 'features-1',
      type: 'features-grid',
      props: {
        title: 'Amazing Features',
        features: [
          { title: 'Fast', description: 'Lightning quick generation' },
          { title: 'Beautiful', description: 'Stunning designs' },
          { title: 'Simple', description: 'Easy to use' }
        ]
      },
      styles: {
        padding: '60px 20px',
        backgroundColor: '#f8fafc',
      },
      children: []
    }
  ]
}

export default function TestEditorPage() {
  const [selectedElement, setSelectedElement] = useState<string[]>([])
  const [componentTree, setComponentTree] = useState<ComponentTreeNode>(testComponentTree)
  const [leftPanelTab, setLeftPanelTab] = useState<'components' | 'layers'>('layers')
  
  // Handle component selection
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedElement(selectedIds)
  }, [])
  
  // Handle component updates
  const handleComponentUpdate = useCallback((componentId: string, updates: any) => {
    setComponentTree(prevTree => updateComponentInTree(prevTree, componentId, updates))
  }, [])
  
  // Handle component tree changes (drag & drop)
  const handleComponentTreeChange = useCallback((newTree: ComponentTreeNode) => {
    setComponentTree(newTree)
  }, [])
  
  // Handle adding new components
  const handleAddComponent = useCallback((componentType: string) => {
    const newComponent: ComponentTreeNode = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      props: {},
      children: []
    }
    
    const updatedTree = {
      ...componentTree,
      children: [...(componentTree.children || []), newComponent]
    }
    
    setComponentTree(updatedTree)
  }, [componentTree])
  
  // Helper function to update a component in the tree
  const updateComponentInTree = (node: ComponentTreeNode, id: string, updates: any): ComponentTreeNode => {
    if (node.id === id) {
      return { ...node, ...updates }
    }
    
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateComponentInTree(child, id, updates))
      }
    }
    
    return node
  }
  
  // Helper function to find component by ID
  const findComponentById = (node: ComponentTreeNode, id: string): ComponentTreeNode | null => {
    if (node.id === id) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findComponentById(child, id)
        if (found) return found
      }
    }
    return null
  }
  
  // Get selected component
  const selectedComponent = selectedElement.length > 0
    ? findComponentById(componentTree, selectedElement[0])
    : null
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-lg font-semibold text-gray-900 dark:text-white">
              Aether
            </a>
            <span className="text-sm text-gray-500">Test Editor - Property Panel Demo</span>
          </div>
        </div>
      </div>

      {/* Left Panel - Components & Layers */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-12 flex flex-col">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setLeftPanelTab('components')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              leftPanelTab === 'components'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setLeftPanelTab('layers')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              leftPanelTab === 'layers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Layers
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {leftPanelTab === 'components' ? (
            <ComponentLibrary onAddComponent={handleAddComponent} />
          ) : (
            <LayerPanel
              componentTree={componentTree}
              selectedIds={selectedElement}
              onSelectComponent={(id, multi) => {
                if (multi) {
                  setSelectedElement(prev => 
                    prev.includes(id) 
                      ? prev.filter(i => i !== id)
                      : [...prev, id]
                  )
                } else {
                  setSelectedElement([id])
                }
              }}
            />
          )}
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 pt-12">
        <Canvas
          componentTree={componentTree}
          onSelectionChange={handleSelectionChange}
          onComponentUpdate={handleComponentUpdate}
          onComponentTreeChange={handleComponentTreeChange}
          className="h-full"
          renderComponent={(component) => (
            <div className="p-4 border border-dashed border-gray-300 rounded">
              <div className="text-xs text-gray-500 mb-1">Component: {component.type}</div>
              <div className="text-sm">{component.props.title || component.id}</div>
            </div>
          )}
          settings={{
            viewport: {
              x: 0,
              y: 0,
              zoom: 1,
              width: 1200,
              height: 800
            },
            grid: {
              size: 20,
              visible: true,
              snapEnabled: true,
              color: '#e5e7eb'
            },
            rulers: {
              visible: true,
              units: 'px',
              color: '#6b7280'
            },
            backgroundColor: '#ffffff'
          }}
        />
      </div>
      
      {/* Right Panel - Properties */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 pt-12">
        <PropertyPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleComponentUpdate}
        />
        {selectedComponent && (
          <div className="px-4 py-2 bg-blue-50 border-t">
            <p className="text-xs text-blue-700">
              Selected: {selectedComponent.type} ({selectedComponent.id})
            </p>
          </div>
        )}
      </div>
    </div>
  )
}