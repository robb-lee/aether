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
  
  // Panel collapse state management with localStorage persistence
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aether-editor-left-panel-collapsed') === 'true'
    }
    return false
  })
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aether-editor-right-panel-collapsed') === 'true'
    }
    return false
  })
  
  // Persist panel state to localStorage
  useEffect(() => {
    localStorage.setItem('aether-editor-left-panel-collapsed', leftPanelCollapsed.toString())
  }, [leftPanelCollapsed])
  
  useEffect(() => {
    localStorage.setItem('aether-editor-right-panel-collapsed', rightPanelCollapsed.toString())
  }, [rightPanelCollapsed])

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
          console.log('Raw site data:', data.components)
          const transformedTree = transformToComponentTree(data.components.root)
          console.log('Transformed tree:', transformedTree)
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
    
    console.log('Transforming component:', component)
    
    // Always process children for all components (including root)
    if (component.children && Array.isArray(component.children)) {
      transformed.children = component.children.map(transformToComponentTree)
      console.log(`Component ${component.id || 'unknown'} has ${transformed.children?.length || 0} children`)
    }
    
    return transformed
  }
  
  // Handle component selection
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    console.log('Selection changed to:', selectedIds)
    setSelectedElement(selectedIds)
    // Clear element-specific selections when selecting components directly
    setSelectedElementType(null)
    setSelectedElementComponent(null)
  }, [])

  // Handle element selection for granular editing
  const [selectedElementType, setSelectedElementType] = useState<string | null>(null)
  const [selectedElementComponent, setSelectedElementComponent] = useState<ComponentTreeNode | null>(null)
  const [elementStyles, setElementStyles] = useState<Record<string, React.CSSProperties>>({})
  
  // Helper function to find component containing an element
  const findComponentContainingElement = useCallback((elementId: string, tree: ComponentTreeNode): ComponentTreeNode | null => {
    // Check if this component contains the element
    const componentElementIds = getElementIdsForComponent(tree.type)
    if (componentElementIds.includes(elementId)) {
      return tree
    }
    
    // Search children recursively
    if (tree.children) {
      for (const child of tree.children) {
        const found = findComponentContainingElement(elementId, child)
        if (found) return found
      }
    }
    
    return null
  }, [])
  
  // Helper function to get element IDs for a component type
  const getElementIdsForComponent = useCallback((componentType: string): string[] => {
    const elementMap: Record<string, string[]> = {
      'hero-split': [
        'hero-section', 'hero-container', 'hero-content-wrapper', 'hero-subtitle',
        'hero-title', 'hero-description', 'hero-button-group', 'hero-primary-button',
        'hero-secondary-button', 'hero-demo-text', 'hero-image-wrapper', 'hero-image',
        'hero-demo-badge', 'hero-image-placeholder'
      ],
      'hero-centered': ['hero-section', 'hero-container', 'hero-content'],
      'features-grid': ['features-section', 'features-container', 'features-header', 'features-grid']
    }
    return elementMap[componentType] || []
  }, [])
  
  const handleElementSelect = useCallback((elementId: string, elementType: string) => {
    console.log('Element selected:', { elementId, elementType })
    setSelectedElement([elementId])
    setSelectedElementType(elementType)
    
    // Find the component containing this element
    if (componentTree) {
      const containingComponent = findComponentContainingElement(elementId, componentTree)
      console.log('Found containing component:', containingComponent)
      setSelectedElementComponent(containingComponent)
    }
  }, [componentTree, findComponentContainingElement])

  // Update selectedElementComponent whenever componentTree changes (for real-time editing)
  useEffect(() => {
    if (selectedElement[0] && selectedElementType && componentTree) {
      const updatedComponent = findComponentContainingElement(selectedElement[0], componentTree)
      if (updatedComponent) {
        console.log('Syncing selectedElementComponent with updated componentTree:', updatedComponent)
        setSelectedElementComponent(updatedComponent)
      }
    }
  }, [componentTree, selectedElement, selectedElementType, findComponentContainingElement])

  // Handle element style updates
  const handleElementStyleUpdate = useCallback((elementId: string, styleUpdates: React.CSSProperties) => {
    setElementStyles(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...styleUpdates
      }
    }))
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
  
  // Debug selected component
  useEffect(() => {
    console.log('Selected element IDs:', selectedElement)
    console.log('Selected component:', selectedComponent)
    console.log('Component tree structure:', componentTree)
  }, [selectedElement, selectedComponent, componentTree])
  
  // Panel toggle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.getAttribute('role') === 'textbox' ||
                          target.getAttribute('data-input-field') === 'true' ||
                          target.closest('input') ||
                          target.closest('textarea') ||
                          target.closest('[contenteditable]') ||
                          target.closest('[data-input-field="true"]') ||
                          target.closest('.property-panel')
      
      if (isInputField) return
      
      // Panel toggle shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setLeftPanelCollapsed(!leftPanelCollapsed)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        setRightPanelCollapsed(!rightPanelCollapsed)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown, { capture: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [leftPanelCollapsed, rightPanelCollapsed])
  
  
  // Setup keyboard shortcut handling with delete functionality - TEMPORARILY DISABLED FOR DEBUGGING
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     // Check if the target is an input, textarea, or contenteditable element
  //     const target = e.target as HTMLElement
  //     
  //     // More comprehensive input field detection
  //     const isInputField = target.tagName === 'INPUT' || 
  //                         target.tagName === 'TEXTAREA' || 
  //                         target.contentEditable === 'true' ||
  //                         target.getAttribute('role') === 'textbox' ||
  //                         target.closest('input') ||
  //                         target.closest('textarea') ||
  //                         target.closest('[contenteditable]') ||
  //                         target.closest('.property-panel') ||
  //                         // Check if we're in any form control
  //                         target.closest('form') ||
  //                         // Check if target has input-related classes
  //                         target.className?.includes('border') && target.className?.includes('rounded')
  //     
  //     // ONLY handle Delete/Backspace for component deletion, and ONLY if we're definitely NOT in an input
  //     if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputField && selectedElement.length > 0) {
  //       e.preventDefault()
  //       selectedElement.forEach(id => handleDeleteComponent(id))
  //       return
  //     }
  //     
  //     // For all other keys, if we're in an input field, don't interfere at all
  //     if (isInputField) {
  //       return // Let the input handle the event normally
  //     }
  //   }
  //   
  //   window.addEventListener('keydown', handleKeyDown, { capture: false })
  //   return () => window.removeEventListener('keydown', handleKeyDown)
  // }, [selectedElement, handleDeleteComponent])
  
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
      <div className={`${leftPanelCollapsed ? 'w-12' : 'w-64 lg:w-72 xl:w-80'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-12 flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Panel header with toggle button */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={leftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {leftPanelCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
          
          {!leftPanelCollapsed && (
            <>
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
            </>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {!leftPanelCollapsed && (
            leftPanelTab === 'components' ? (
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
            )
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
                component={{
                  ...component,
                  customStyles: elementStyles
                }}
                onUpdateComponent={handleComponentUpdate}
                onElementSelect={handleElementSelect}
                selectedElementId={selectedElement[0]}
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
      {!rightPanelCollapsed && (
        <div className="w-80 lg:w-96 xl:w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <div className="pt-12 h-full">
            {/* Panel header with toggle button */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Properties</h3>
              <button
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
                title="Collapse panel"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <PropertyPanel
              selectedComponent={selectedElementType ? selectedElementComponent : selectedComponent}
              onUpdateComponent={handleComponentUpdate}
              selectedElementId={selectedElement[0]}
              selectedElementType={selectedElementType || undefined}
              onElementStyleUpdate={handleElementStyleUpdate}
              elementStyles={elementStyles}
            />
          </div>
        </div>
      )}
      
      {/* Right panel collapsed toggle button */}
      {rightPanelCollapsed && (
        <div className="w-10 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 pt-12 transition-all duration-300 ease-in-out">
          <button
            onClick={() => setRightPanelCollapsed(false)}
            className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Expand properties panel"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
