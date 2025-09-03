import { ComponentTreeNode } from '../../types';

export interface SortableItem {
  id: string;
  component: ComponentTreeNode;
  parentId?: string;
  index: number;
}

/**
 * Convert component tree to flat sortable items array
 */
export function flattenComponentTree(
  tree: ComponentTreeNode,
  parentId?: string
): SortableItem[] {
  const items: SortableItem[] = [];
  
  function traverse(node: ComponentTreeNode, parent?: string, index = 0) {
    items.push({
      id: node.id,
      component: node,
      parentId: parent,
      index,
    });
    
    if (node.children) {
      node.children.forEach((child, childIndex) => {
        traverse(child, node.id, childIndex);
      });
    }
  }
  
  traverse(tree, parentId);
  return items;
}

/**
 * Rebuild component tree from sortable items
 */
export function rebuildComponentTree(
  items: SortableItem[]
): ComponentTreeNode | null {
  if (items.length === 0) return null;
  
  const nodeMap = new Map<string, ComponentTreeNode>();
  const childrenMap = new Map<string, ComponentTreeNode[]>();
  
  // Create nodes and group children
  items.forEach(item => {
    const node: ComponentTreeNode = {
      ...item.component,
      children: [],
    };
    nodeMap.set(item.id, node);
    
    if (item.parentId) {
      if (!childrenMap.has(item.parentId)) {
        childrenMap.set(item.parentId, []);
      }
      childrenMap.get(item.parentId)!.push(node);
    }
  });
  
  // Assign children to their parents
  childrenMap.forEach((children, parentId) => {
    const parent = nodeMap.get(parentId);
    if (parent) {
      parent.children = children.sort((a, b) => {
        const aItem = items.find(item => item.id === a.id);
        const bItem = items.find(item => item.id === b.id);
        return (aItem?.index || 0) - (bItem?.index || 0);
      });
    }
  });
  
  // Find root node (node without parent)
  const rootItem = items.find(item => !item.parentId);
  return rootItem ? nodeMap.get(rootItem.id) || null : null;
}

/**
 * Move component to new position in tree
 */
export function moveComponent(
  tree: ComponentTreeNode,
  sourceId: string,
  targetId: string,
  position: 'before' | 'after' | 'inside' = 'inside'
): ComponentTreeNode {
  // Clone the tree to avoid mutations
  const newTree = JSON.parse(JSON.stringify(tree)) as ComponentTreeNode;
  
  // Find and remove the source component
  const sourceComponent = findAndRemoveComponent(newTree, sourceId);
  if (!sourceComponent) return tree;
  
  // Find target component and add source component
  if (position === 'inside') {
    const targetComponent = findComponentInTree(newTree, targetId);
    if (targetComponent) {
      if (!targetComponent.children) {
        targetComponent.children = [];
      }
      targetComponent.children.push(sourceComponent);
    }
  } else {
    // For 'before' and 'after', we need to insert as sibling
    insertAsSibling(newTree, sourceComponent, targetId, position);
  }
  
  return newTree;
}

/**
 * Find and remove component from tree, returning the removed component
 */
function findAndRemoveComponent(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode | null {
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].id === componentId) {
        // Found the component, remove and return it
        return tree.children.splice(i, 1)[0];
      }
      
      // Recursively search in children
      const found = findAndRemoveComponent(tree.children[i], componentId);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Find component in tree (helper function)
 */
function findComponentInTree(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode | null {
  if (tree.id === componentId) {
    return tree;
  }
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findComponentInTree(child, componentId);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Insert component as sibling
 */
function insertAsSibling(
  tree: ComponentTreeNode,
  component: ComponentTreeNode,
  targetId: string,
  position: 'before' | 'after'
): boolean {
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].id === targetId) {
        const insertIndex = position === 'before' ? i : i + 1;
        tree.children.splice(insertIndex, 0, component);
        return true;
      }
      
      if (insertAsSibling(tree.children[i], component, targetId, position)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Update indices for all items with same parent
 */
function updateIndices(items: SortableItem[]): void {
  const parentGroups = new Map<string | undefined, SortableItem[]>();
  
  items.forEach(item => {
    const parentId = item.parentId;
    if (!parentGroups.has(parentId)) {
      parentGroups.set(parentId, []);
    }
    parentGroups.get(parentId)!.push(item);
  });
  
  parentGroups.forEach(siblings => {
    siblings.forEach((item, index) => {
      item.index = index;
    });
  });
}

/**
 * Check if component can be dropped into target
 */
export function canDropInto(
  sourceType: string,
  targetType: string,
  acceptMap: Record<string, string[]> = {}
): boolean {
  const accepts = acceptMap[targetType];
  if (!accepts) return true; // Allow all if no restrictions
  
  return accepts.includes(sourceType) || accepts.includes('*');
}

/**
 * Get drop position based on mouse coordinates
 */
export function getDropPosition(
  rect: DOMRect,
  clientY: number
): 'before' | 'after' | 'inside' {
  const relativeY = clientY - rect.top;
  const threshold = rect.height * 0.3;
  
  if (relativeY < threshold) {
    return 'before';
  } else if (relativeY > rect.height - threshold) {
    return 'after';
  } else {
    return 'inside';
  }
}