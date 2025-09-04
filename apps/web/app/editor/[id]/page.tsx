'use client'

import { useState, useEffect, useCallback } from 'react'
import { Canvas, PropertyPanel, ComponentLibrary, LayerPanel } from '@aether/editor-core'
import type { ComponentTreeNode } from '@aether/editor-core'
import { Loader2 } from 'lucide-react'
import { EditorComponentRenderer } from '@/components/EditorComponentRenderer'

interface SiteData {
  id: string
  name: string
  components: any
  status: string
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const [selectedElement, setSelectedElement] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [componentTree, setComponentTree] = useState<ComponentTreeNode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [leftPanelTab, setLeftPanelTab] = useState<'components' | 'layers'>('components')

  // Fetch site data
  useEffect(() => {
    async function fetchSiteData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/sites/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch site data')
        }
        
        const data = await response.json()
        setSiteData(data)
        
        // Transform components to ComponentTreeNode format
        if (data.components && data.components.root) {
          const transformedTree = transformToComponentTree(data.components.root)
          setComponentTree(transformedTree)
        }
      } catch (err) {
        console.error('Error fetching site:', err)
        setError(err instanceof Error ? err.message : 'Failed to load site')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSiteData()
  }, [params.id])
  
  // Transform API data to ComponentTreeNode format
  const transformToComponentTree = (component: any): ComponentTreeNode => {
    const transformed: ComponentTreeNode = {
      id: component.id || `component-${Math.random().toString(36).substr(2, 9)}`,
      type: component.componentId || component.type || 'div',
      props: component.props || {},
      position: component.position,
      size: component.size,
      children: []
    }
    
    // Handle hero components - convert props to children
    if (component.type === 'hero' || component.componentId === 'hero-split' || component.componentId === 'hero-centered') {
      const heroChildren: ComponentTreeNode[] = []
      
      // Add title as heading component
      if (component.props?.title) {
        heroChildren.push({
          id: `${component.id}-title`,
          type: 'heading',
          props: { 
            text: component.props.title,
            level: 1,
            title: component.props.title
          },
          children: []
        })
      }
      
      // Add subtitle/description as text component
      if (component.props?.subtitle || component.props?.description) {
        heroChildren.push({
          id: `${component.id}-subtitle`,
          type: 'text-block',
          props: { 
            content: component.props.subtitle || component.props.description,
            title: 'Subtitle'
          },
          children: []
        })
      }
      
      // Add CTA button
      if (component.props?.ctaText) {
        heroChildren.push({
          id: `${component.id}-cta`,
          type: 'button',
          props: { 
            text: component.props.ctaText,
            variant: 'primary',
            title: component.props.ctaText
          },
          children: []
        })
      }
      
      // Add image placeholder
      if (component.props?.imagePrompt) {
        heroChildren.push({
          id: `${component.id}-image`,
          type: 'image',
          props: { 
            alt: 'Hero image',
            title: 'Hero Image',
            imagePrompt: component.props.imagePrompt
          },
          children: []
        })
      }
      
      transformed.children = heroChildren
    }
    
    // Handle features grid components - convert features array to children
    else if (component.type === 'features' || component.componentId === 'features-grid') {
      if (component.props?.features && Array.isArray(component.props.features)) {
        transformed.children = component.props.features.map((feature: any, index: number) => ({
          id: `${component.id}-feature-${index}`,
          type: 'card',
          props: {
            title: feature.title,
            description: feature.description,
            icon: feature.icon
          },
          children: []
        }))
      }
    }
    
    // Handle regular components with children
    else if (component.children && Array.isArray(component.children)) {
      transformed.children = component.children.map(transformToComponentTree)
    }
    
    return transformed
  }
  
  // Handle component selection
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedElement(selectedIds)
  }, [])
  
  // Handle component updates
  const handleComponentUpdate = useCallback((componentId: string, updates: any) => {
    // Special handling for adding new components via drag and drop
    if (componentId === '__ADD_COMPONENT__' && updates.type) {
      if (!componentTree) return
      
      const newComponent: ComponentTreeNode = {
        id: `${updates.type}-${Date.now()}`,
        type: updates.type,
        props: getDefaultPropsForComponent(updates.type),
        children: [],
        position: updates.position || { x: 100, y: 100 },
        size: { width: 300, height: 200 }
      }
      
      let updatedTree = { ...componentTree }
      
      // Special positioning logic for navigation components
      if (updates.type === 'header-nav') {
        // Always add nav at the top
        updatedTree.children = [newComponent, ...(componentTree.children || [])]
      } else if (updates.type === 'footer-simple') {
        // Always add footer at the bottom
        updatedTree.children = [...(componentTree.children || []), newComponent]
      } else if (updates.dropIndex !== undefined) {
        // Insert at specific position based on drop location
        const children = [...(componentTree.children || [])]
        children.splice(updates.dropIndex, 0, newComponent)
        updatedTree.children = children
      } else {
        // Default: add to end
        updatedTree.children = [...(componentTree.children || []), newComponent]
      }
      
      setComponentTree(updatedTree)
      
      // Auto-select the newly added component
      setTimeout(() => {
        setSelectedElement([newComponent.id])
      }, 100)
      
      return
    }
    
    // Update the component tree
    setComponentTree(prevTree => {
      if (!prevTree) return null
      return updateComponentInTree(prevTree, componentId, updates)
    })
  }, [componentTree])
  
  // Handle component tree changes (drag & drop)
  const handleComponentTreeChange = useCallback((newTree: ComponentTreeNode) => {
    setComponentTree(newTree)
  }, [])
  
  // Handle adding new components
  const handleAddComponent = useCallback((componentType: string) => {
    if (!componentTree) return
    
    const newComponent: ComponentTreeNode = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      props: getDefaultPropsForComponent(componentType),
      children: [],
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: { width: 300, height: 200 }
    }
    
    // Add to root for now - later we can add to selected parent
    const updatedTree = {
      ...componentTree,
      children: [...(componentTree.children || []), newComponent]
    }
    
    setComponentTree(updatedTree)
  }, [componentTree])
  
  // Get default props for component types
  const getDefaultPropsForComponent = (componentType: string) => {
    const defaults: Record<string, any> = {
      'hero-split': { title: 'Welcome to Our Site', subtitle: 'Build amazing websites', ctaText: 'Get Started' },
      'hero-centered': { title: 'Centered Hero', description: 'A beautiful centered hero section' },
      'features-grid': { title: 'Features', features: [] },
      'text-block': { content: 'Enter your text here' },
      'heading': { text: 'Heading', level: 2 },
      'paragraph': { text: 'Lorem ipsum dolor sit amet' },
      'image': { alt: 'Image placeholder', src: '' },
      'button': { text: 'Click me', variant: 'primary' },
      'video-youtube': { videoUrl: '', title: 'YouTube Video' }
    }
    return defaults[componentType] || {}
  }
  
  // Handle component deletion
  const handleDeleteComponent = useCallback((componentId: string) => {
    if (!componentTree) return
    
    const deleteFromTree = (node: ComponentTreeNode): ComponentTreeNode | null => {
      if (node.id === componentId) return null
      
      if (node.children) {
        const filteredChildren = node.children
          .map(child => deleteFromTree(child))
          .filter(Boolean) as ComponentTreeNode[]
        
        return { ...node, children: filteredChildren }
      }
      
      return node
    }
    
    const updatedTree = deleteFromTree(componentTree)
    if (updatedTree) {
      setComponentTree(updatedTree)
      setSelectedElement([])
    }
  }, [componentTree])
  
  // Helper function to find component by ID
  const findComponentById = (node: ComponentTreeNode, id: string): ComponentTreeNode | null => {
    if (node.id === id) return node
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const found = findComponentById(child, id)
        if (found) return found
      }
    }
    return null
  }
  
  // Get selected component
  const selectedComponent = componentTree && selectedElement.length > 0
    ? findComponentById(componentTree, selectedElement[0])
    : null
  
  
  // Setup keyboard shortcut handling with delete functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the target is an input, textarea, or contenteditable element
      const target = e.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'
      
      // Only handle delete/backspace if not in an input field
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputField) {
        e.preventDefault()
        if (selectedElement.length > 0) {
          selectedElement.forEach(id => handleDeleteComponent(id))
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement, handleDeleteComponent])
  
  // Helper function to update a component in the tree
  const updateComponentInTree = (node: ComponentTreeNode, id: string, updates: any): ComponentTreeNode => {
    if (node.id === id) {
      // Deep merge for props to preserve existing properties
      if (updates.props) {
        return { 
          ...node, 
          ...updates,
          props: {
            ...node.props,
            ...updates.props
          }
        }
      }
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
  
  // Handle save
  const handleSave = async () => {
    if (!componentTree) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/sites/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: {
            root: componentTree
          }
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save site')
      }
      
      // Show success message or notification
      console.log('Site saved successfully')
    } catch (err) {
      console.error('Error saving site:', err)
      // Show error message
    } finally {
      setIsSaving(false)
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Error Loading Site</h1>
          <p className="text-gray-600">{error}</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </a>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-lg font-semibold text-gray-900 dark:text-white">
              Aether
            </a>
            <span className="text-sm text-gray-500">{siteData?.name || 'Untitled Site'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={`/preview/${params.id}`}
              target="_blank"
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Preview
            </a>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm text-white hover:from-blue-700 hover:to-purple-700">
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Left Panel - Components & Layers */}
      <div className="w-64 lg:w-72 xl:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-12 flex flex-col">
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
      <div className="flex-1 pt-12 overflow-hidden">
        {componentTree ? (
          <Canvas
            componentTree={componentTree}
            onSelectionChange={handleSelectionChange}
            onComponentUpdate={handleComponentUpdate}
            onComponentTreeChange={handleComponentTreeChange}
            className="h-full w-full"
            renderComponent={(component) => (
              <EditorComponentRenderer 
                component={component} 
                onUpdateComponent={handleComponentUpdate}
              />
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
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">No components found</p>
              <p className="text-sm text-gray-400 mt-2">Start by generating content in the preview page</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Right Panel - Properties */}
      <div className="w-80 lg:w-96 xl:w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="pt-12 h-full">
          <PropertyPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleComponentUpdate}
          />
        </div>
      </div>
    </div>
  )
}
