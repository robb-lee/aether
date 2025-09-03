import React, { createContext, useContext, useState, useCallback } from 'react';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { ComponentTreeNode } from '../types';

interface DragState {
  activeId: string | null;
  overId: string | null;
  isDragging: boolean;
  dragOverlay: React.ReactNode | null;
}

interface DragDropContextValue {
  dragState: DragState;
  updateComponentTree: (updates: ComponentTreeNode) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

interface DragDropProviderProps {
  children: React.ReactNode;
  componentTree?: ComponentTreeNode;
  onComponentTreeChange?: (tree: ComponentTreeNode) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  componentTree,
  onComponentTreeChange,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    isDragging: false,
    dragOverlay: null,
  });

  const updateComponentTree = useCallback((updates: ComponentTreeNode) => {
    onComponentTreeChange?.(updates);
  }, [onComponentTreeChange]);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDragState(prev => ({
      ...prev,
      activeId: active.id as string,
      isDragging: true,
    }));
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setDragState(prev => ({
      ...prev,
      overId: over?.id as string || null,
    }));
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !componentTree) {
      setDragState(prev => ({
        ...prev,
        activeId: null,
        overId: null,
        isDragging: false,
      }));
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      // Reorder logic - move component from activeId position to overId position
      const updatedTree = reorderComponentTree(componentTree, activeId, overId);
      updateComponentTree(updatedTree);
    }

    setDragState(prev => ({
      ...prev,
      activeId: null,
      overId: null,
      isDragging: false,
    }));
  }, [componentTree, updateComponentTree]);

  const value: DragDropContextValue = {
    dragState,
    updateComponentTree,
    onDragStart,
    onDragOver,
    onDragEnd,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};

// Helper function to reorder component tree
function reorderComponentTree(
  tree: ComponentTreeNode,
  activeId: string,
  overId: string
): ComponentTreeNode {
  // Clone the tree to avoid mutations
  const newTree = JSON.parse(JSON.stringify(tree));
  
  // Find and remove the active component
  const activeComponent = findAndRemoveComponent(newTree, activeId);
  if (!activeComponent) return tree;
  
  // Insert the active component at the new position
  insertComponentAtPosition(newTree, activeComponent, overId);
  
  return newTree;
}

function findAndRemoveComponent(
  tree: ComponentTreeNode,
  componentId: string
): ComponentTreeNode | null {
  if (tree.id === componentId) {
    return tree;
  }
  
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].id === componentId) {
        return tree.children.splice(i, 1)[0];
      }
      
      const found = findAndRemoveComponent(tree.children[i], componentId);
      if (found) return found;
    }
  }
  
  return null;
}

function insertComponentAtPosition(
  tree: ComponentTreeNode,
  component: ComponentTreeNode,
  targetId: string
): boolean {
  if (tree.id === targetId) {
    // Insert as first child
    if (!tree.children) tree.children = [];
    tree.children.unshift(component);
    return true;
  }
  
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].id === targetId) {
        // Insert after the target component
        tree.children.splice(i + 1, 0, component);
        return true;
      }
      
      if (insertComponentAtPosition(tree.children[i], component, targetId)) {
        return true;
      }
    }
  }
  
  return false;
}

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};