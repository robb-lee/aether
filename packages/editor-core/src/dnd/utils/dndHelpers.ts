import { ComponentTreeNode } from '../../types';

/**
 * Generate unique identifiers for drag and drop operations
 */
export function generateDndId(componentId: string, type: 'drag' | 'drop'): string {
  return `${type}-${componentId}`;
}

/**
 * Extract component ID from DnD ID
 */
export function extractComponentId(dndId: string): string {
  return dndId.replace(/^(drag|drop)-/, '');
}

/**
 * Find component in tree by ID
 */
export function findComponent(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode | null {
  if (tree.id === componentId) {
    return tree;
  }
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findComponent(child, componentId);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Find parent component of a given component
 */
export function findParentComponent(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode | null {
  if (tree.children) {
    for (const child of tree.children) {
      if (child.id === componentId) {
        return tree;
      }
      
      const found = findParentComponent(child, componentId);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Get all sibling components
 */
export function getSiblings(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode[] {
  const parent = findParentComponent(tree, componentId);
  if (!parent || !parent.children) return [];
  
  return parent.children.filter(child => child.id !== componentId);
}

/**
 * Check if component can be moved to target position
 */
export function canMoveComponent(
  tree: ComponentTreeNode,
  sourceId: string,
  targetId: string
): boolean {
  // Prevent moving a component into itself or its descendants
  function isDescendant(ancestorId: string, descendantId: string): boolean {
    const ancestor = findComponent(tree, ancestorId);
    if (!ancestor || !ancestor.children) return false;
    
    return ancestor.children.some(child => 
      child.id === descendantId || isDescendant(child.id, descendantId)
    );
  }
  
  if (sourceId === targetId) return false;
  if (isDescendant(sourceId, targetId)) return false;
  
  return true;
}

/**
 * Get drop zone type based on component types
 */
export function getDropZoneType(
  sourceType: string,
  targetType: string
): 'container' | 'sibling' | 'invalid' {
  const containerTypes = ['section', 'div', 'article', 'main', 'aside'];
  const leafTypes = ['button', 'input', 'img', 'text', 'icon'];
  
  // Can always drop as sibling
  if (!leafTypes.includes(targetType)) {
    return 'container';
  }
  
  return 'sibling';
}

/**
 * Calculate drop position based on coordinates
 */
export interface DropPosition {
  position: 'before' | 'after' | 'inside';
  targetId: string;
  parentId?: string;
}

export function calculateDropPosition(
  event: { clientX: number; clientY: number },
  targetElement: HTMLElement,
  targetId: string
): DropPosition {
  const rect = targetElement.getBoundingClientRect();
  const relativeY = event.clientY - rect.top;
  const threshold = rect.height * 0.25;
  
  if (relativeY < threshold) {
    return { position: 'before', targetId };
  } else if (relativeY > rect.height - threshold) {
    return { position: 'after', targetId };
  } else {
    return { position: 'inside', targetId };
  }
}