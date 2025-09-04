import React, { useState, useEffect } from 'react'
import { ComponentRenderer } from './ComponentRenderer'

interface EditorComponentRendererProps {
  component: any
  onUpdateComponent: (componentId: string, updates: any) => void
  onElementSelect?: (elementId: string, elementType: string) => void
  selectedElementId?: string
}

export function EditorComponentRenderer({ 
  component, 
  onUpdateComponent, 
  onElementSelect,
  selectedElementId 
}: EditorComponentRendererProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const handleDoubleClick = (fieldName: string, currentValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingField(fieldName)
    setEditValue(currentValue || '')
  }

  const handleSave = () => {
    if (editingField && component) {
      onUpdateComponent(component.id, {
        props: {
          ...component.props,
          [editingField]: editValue
        }
      })
    }
    setEditingField(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingField(null)
    }
  }

  // Handle clicking outside to save
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingField) {
        const target = e.target as HTMLElement
        if (!target.closest('.inline-editor')) {
          handleSave()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingField, editValue])

  // For YouTube video component
  if (component.type === 'video-youtube') {
    const videoUrl = component.props?.videoUrl || ''
    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="mb-2">YouTube Video</p>
              <p className="text-sm">Enter YouTube URL in properties</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // For basic text components (heading, text-block, button)
  if (['heading', 'text-block', 'button', 'paragraph'].includes(component.type)) {
    const fieldName = component.type === 'button' ? 'text' : 
                     component.type === 'heading' ? 'text' :
                     component.type === 'text-block' ? 'content' :
                     'text'
    const currentValue = component.props?.[fieldName] || ''

    if (editingField === fieldName) {
      return (
        <div className="inline-editor p-2 bg-white border-2 border-blue-500 rounded">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full outline-none text-inherit"
            autoFocus
          />
        </div>
      )
    }

    // Render based on component type
    switch (component.type) {
      case 'heading':
        const HeadingTag = `h${component.props?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag 
            className="cursor-text hover:bg-blue-50 transition-colors px-1 -mx-1 rounded"
            onDoubleClick={(e) => handleDoubleClick(fieldName, currentValue, e)}
          >
            {currentValue || 'Double-click to edit'}
          </HeadingTag>
        )
      
      case 'text-block':
      case 'paragraph':
        return (
          <p 
            className="cursor-text hover:bg-blue-50 transition-colors px-1 -mx-1 rounded"
            onDoubleClick={(e) => handleDoubleClick(fieldName, currentValue, e)}
          >
            {currentValue || 'Double-click to edit text'}
          </p>
        )
      
      case 'button':
        return (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-text"
            onDoubleClick={(e) => handleDoubleClick(fieldName, currentValue, e)}
          >
            {currentValue || 'Button Text'}
          </button>
        )
      
      default:
        return <ComponentRenderer component={component} isEditor={true} />
    }
  }

  // For hero components - use the new granular selection system
  if (['hero-split', 'hero-centered', 'features-grid', 'cta-simple'].includes(component.type)) {
    return (
      <ComponentRenderer 
        component={component} 
        isEditor={true}
        onElementClick={onElementSelect}
        selectedElementId={selectedElementId}
      />
    )
  }

  // For complex components with editable children
  if (component.children && component.children.length > 0) {
    return (
      <div>
        {component.children.map((child: any, index: number) => (
          <EditorComponentRenderer
            key={child.id || index}
            component={child}
            onUpdateComponent={onUpdateComponent}
          />
        ))}
      </div>
    )
  }

  // Default to regular component renderer
  return <ComponentRenderer component={component} isEditor={true} />
}