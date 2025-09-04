import React from 'react';

interface EditableElementProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  'data-editable-type'?: string;
}

/**
 * Editable wrapper component for individual elements in the visual editor
 * 
 * This component wraps any element that should be editable in the visual editor.
 * It provides:
 * - Click detection and event handling
 * - Visual feedback on hover and selection
 * - Element type identification for the PropertyPanel
 * - Dynamic wrapper element to prevent invalid HTML nesting
 */
export const EditableElement: React.FC<EditableElementProps> = ({ 
  id, 
  className = '', 
  children, 
  onClick,
  'data-editable-type': editableType
}) => {
  // Determine wrapper element based on content type to prevent invalid HTML nesting
  const isInlineElement = editableType === 'button' || editableType === 'text' || editableType === 'link';
  const WrapperElement = isInlineElement ? 'span' : 'div';
  
  // For section elements, don't add background hover effects that might interfere
  const isSection = editableType === 'section';
  const hoverClasses = isSection 
    ? 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'
    : 'hover:ring-2 hover:ring-blue-300 hover:bg-blue-50 hover:bg-opacity-30';
  
  const combinedClassName = `${className} cursor-pointer transition-all duration-200 ${hoverClasses} ${isInlineElement ? 'inline-block' : ''}`.trim();
  
  return React.createElement(
    WrapperElement,
    {
      id,
      className: combinedClassName,
      onClick,
      'data-editable-type': editableType,
      'data-element-id': id,
      title: `Click to edit ${editableType}`
    },
    children
  );
};

/**
 * Helper function to generate click handlers for editable elements
 */
export const createElementClickHandler = (
  elementId: string, 
  elementType: string,
  onElementClick?: (elementId: string, elementType: string) => void
) => (e: React.MouseEvent) => {
  e.stopPropagation();
  onElementClick?.(elementId, elementType);
};

/**
 * Helper function to apply selection styling to elements
 */
export const getElementClassName = (
  elementId: string, 
  baseClassName: string, 
  selectedElementId?: string
) => {
  const isSelected = selectedElementId === elementId;
  return `${baseClassName} ${isSelected ? 'ring-2 ring-green-400 ring-opacity-75 bg-green-50' : ''}`;
};

/**
 * Helper function to get custom styles for an element
 */
export const getElementStyle = (
  elementId: string, 
  customStyles: Record<string, React.CSSProperties> = {}
) => {
  return customStyles[elementId] || {};
};