import { ComponentTreeNode, BoundingBox, Point } from '../types';

export interface SelectionState {
  selectedIds: Set<string>;
  lastSelectedId: string | null;
  selectionBox: SelectionBox | null;
  isMultiSelect: boolean;
}

export interface SelectionBox {
  startPoint: Point;
  currentPoint: Point;
  boundingBox: BoundingBox;
}

export interface SelectionManagerOptions {
  onSelectionChange?: (selectedIds: string[]) => void;
  onComponentUpdate?: (componentId: string, updates: any) => void;
  snapToGrid?: boolean;
  gridSize?: number;
  // Called when user requests deletion (Delete/Backspace)
  onDeleteSelected?: (selectedIds: string[]) => void;
}

export interface ResizeHandle {
  position: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  x: number;
  y: number;
  cursor: string;
}

export interface ResizeState {
  isResizing: boolean;
  handle: ResizeHandle | null;
  originalBounds: BoundingBox;
  startPoint: Point;
}

export type KeyboardShortcut = 
  | 'select-all'
  | 'deselect-all' 
  | 'delete-selected'
  | 'move-up'
  | 'move-down'
  | 'move-left'
  | 'move-right'
  | 'extend-up'
  | 'extend-down'
  | 'extend-left'
  | 'extend-right';
