import { useRef, useCallback, useState, useEffect } from 'react';
import { SelectionManager } from '../SelectionManager';
import { ComponentTreeNode } from '../../types';
import { SelectionManagerOptions } from '../types';

export const useSelection = (
  componentTree: ComponentTreeNode | null,
  options: SelectionManagerOptions = {}
) => {
  const selectionManagerRef = useRef<SelectionManager>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<any>(null);

  // Initialize selection manager
  useEffect(() => {
    if (!selectionManagerRef.current) {
      selectionManagerRef.current = new SelectionManager({
        ...options,
        onSelectionChange: (ids) => {
          setSelectedIds(ids);
          options.onSelectionChange?.(ids);
        }
      });
    }
  }, []);

  // Update component tree
  useEffect(() => {
    if (selectionManagerRef.current && componentTree) {
      selectionManagerRef.current.setComponentTree(componentTree);
    }
  }, [componentTree]);

  // Selection operations
  const select = useCallback((componentId: string, multiSelect = false) => {
    selectionManagerRef.current?.select(componentId, multiSelect);
  }, []);

  const selectMultiple = useCallback((componentIds: string[]) => {
    selectionManagerRef.current?.selectMultiple(componentIds);
  }, []);

  const selectAll = useCallback(() => {
    selectionManagerRef.current?.selectAll();
  }, []);

  const clearSelection = useCallback(() => {
    selectionManagerRef.current?.clearSelection();
  }, []);

  const isSelected = useCallback((componentId: string) => {
    return selectionManagerRef.current?.isSelected(componentId) || false;
  }, []);

  // Selection box operations
  const startSelectionBox = useCallback((startPoint: { x: number; y: number }) => {
    selectionManagerRef.current?.startSelectionBox(startPoint);
  }, []);

  const updateSelectionBox = useCallback((currentPoint: { x: number; y: number }) => {
    selectionManagerRef.current?.updateSelectionBox(currentPoint);
    setSelectionBox(selectionManagerRef.current?.getSelectionBox());
  }, []);

  const endSelectionBox = useCallback(() => {
    selectionManagerRef.current?.endSelectionBox();
    setSelectionBox(null);
  }, []);

  // Keyboard shortcuts
  const handleKeyboardShortcut = useCallback((shortcut: any) => {
    selectionManagerRef.current?.handleKeyboardShortcut(shortcut);
  }, []);

  return {
    selectedIds,
    selectionBox,
    select,
    selectMultiple,
    selectAll,
    clearSelection,
    isSelected,
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox,
    handleKeyboardShortcut,
    selectionManager: selectionManagerRef.current
  };
};