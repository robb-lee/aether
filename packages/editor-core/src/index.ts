// Canvas components
export { Canvas } from './canvas/Canvas';
export { Grid } from './canvas/Grid';
export { Rulers } from './canvas/Rulers';
export { ViewportManager, DEFAULT_VIEWPORT, ZOOM_LIMITS, GRID_SIZES } from './canvas/viewport';

// Drag and Drop components
export { DragDropProvider, useDragDrop } from './dnd/DragDropContext';
export { DndProvider } from './dnd/DndProvider';
export { Draggable } from './dnd/Draggable';
export { Droppable } from './dnd/Droppable';

// DnD Hooks
export { useDraggable } from './dnd/hooks/useDraggable';
export { useDroppable } from './dnd/hooks/useDroppable';
export { useSortable } from './dnd/hooks/useSortable';

// DnD Utilities
export { 
  flattenComponentTree,
  rebuildComponentTree,
  moveComponent,
  canDropInto
} from './dnd/utils/sortableHelpers';
export {
  generateDndId,
  extractComponentId,
  findComponent,
  findParentComponent,
  getSiblings,
  canMoveComponent,
  getDropZoneType,
  calculateDropPosition
} from './dnd/utils/dndHelpers';

// Selection components
export { SelectionManager } from './selection/SelectionManager';
export { SelectionBox } from './selection/SelectionBox';
export { ResizeHandles } from './selection/ResizeHandles';

// Selection hooks
export { useSelection } from './selection/hooks/useSelection';
export { useKeyboardNavigation } from './selection/hooks/useKeyboardNavigation';

// Types
export type {
  Viewport,
  GridSettings,
  RulerSettings,
  CanvasSettings,
  Point,
  BoundingBox,
  ComponentTreeNode,
  CanvasComponent
} from './types';
export type {
  SelectionState,
  SelectionBox as SelectionBoxType,
  SelectionManagerOptions,
  ResizeHandle,
  ResizeState,
  KeyboardShortcut
} from './selection/types';