import { ComponentTreeNode, BoundingBox, Point } from '../types';
import { SelectionState, SelectionBox, SelectionManagerOptions, KeyboardShortcut } from './types';

export class SelectionManager {
  private state: SelectionState = {
    selectedIds: new Set(),
    lastSelectedId: null,
    selectionBox: null,
    isMultiSelect: false
  };

  private options: SelectionManagerOptions;
  private componentTree: ComponentTreeNode | null = null;
  private componentBounds = new Map<string, BoundingBox>();

  constructor(options: SelectionManagerOptions = {}) {
    this.options = {
      snapToGrid: true,
      gridSize: 24,
      ...options
    };
  }

  // Component tree management
  setComponentTree(tree: ComponentTreeNode | null) {
    this.componentTree = tree;
    this.updateComponentBounds();
  }

  private updateComponentBounds() {
    this.componentBounds.clear();
    if (!this.componentTree) return;

    const traverse = (node: ComponentTreeNode, depth = 0) => {
      // Only track components with explicit position and size
      if (node.position && node.size) {
        const bounds: BoundingBox = {
          x: node.position.x,
          y: node.position.y,
          width: node.size.width,
          height: node.size.height
        };
        this.componentBounds.set(node.id, bounds);
      }

      node.children?.forEach(child => traverse(child, depth + 1));
    };

    traverse(this.componentTree);
  }

  // Selection operations
  select(componentId: string, multiSelect = false) {
    const newSelection = new Set(this.state.selectedIds);

    if (multiSelect) {
      if (newSelection.has(componentId)) {
        newSelection.delete(componentId);
      } else {
        newSelection.add(componentId);
      }
    } else {
      newSelection.clear();
      newSelection.add(componentId);
    }

    this.updateSelection(newSelection, componentId);
  }

  selectMultiple(componentIds: string[]) {
    const newSelection = new Set(componentIds);
    this.updateSelection(newSelection, componentIds[componentIds.length - 1] || null);
  }

  selectAll() {
    if (!this.componentTree) return;
    
    const allIds = this.getAllComponentIds();
    this.updateSelection(new Set(allIds), allIds[0] || null);
  }

  clearSelection() {
    this.updateSelection(new Set(), null);
  }

  private updateSelection(selectedIds: Set<string>, lastSelectedId: string | null) {
    this.state.selectedIds = selectedIds;
    this.state.lastSelectedId = lastSelectedId;
    this.options.onSelectionChange?.(Array.from(selectedIds));
  }

  // Selection box operations
  startSelectionBox(startPoint: Point) {
    this.state.selectionBox = {
      startPoint,
      currentPoint: startPoint,
      boundingBox: { ...startPoint, width: 0, height: 0 }
    };
  }

  updateSelectionBox(currentPoint: Point) {
    if (!this.state.selectionBox) return;

    const { startPoint } = this.state.selectionBox;
    const boundingBox: BoundingBox = {
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y)
    };

    this.state.selectionBox = {
      ...this.state.selectionBox,
      currentPoint,
      boundingBox
    };

    // Find components within selection box
    const intersectingIds = this.getComponentsInBox(boundingBox);
    this.updateSelection(new Set(intersectingIds), intersectingIds[0] || null);
  }

  endSelectionBox() {
    this.state.selectionBox = null;
  }

  private getComponentsInBox(selectionBox: BoundingBox): string[] {
    const intersectingIds: string[] = [];

    for (const [id, bounds] of this.componentBounds) {
      if (this.boxIntersects(selectionBox, bounds)) {
        intersectingIds.push(id);
      }
    }

    return intersectingIds;
  }

  private boxIntersects(box1: BoundingBox, box2: BoundingBox): boolean {
    return !(
      box1.x + box1.width < box2.x ||
      box2.x + box2.width < box1.x ||
      box1.y + box1.height < box2.y ||
      box2.y + box2.height < box1.y
    );
  }

  // Keyboard navigation
  handleKeyboardShortcut(shortcut: KeyboardShortcut) {
    switch (shortcut) {
      case 'select-all':
        this.selectAll();
        break;
      case 'deselect-all':
        this.clearSelection();
        break;
      case 'delete-selected':
        this.deleteSelected();
        break;
      case 'move-up':
        this.moveSelection(0, -this.options.gridSize!);
        break;
      case 'move-down':
        this.moveSelection(0, this.options.gridSize!);
        break;
      case 'move-left':
        this.moveSelection(-this.options.gridSize!, 0);
        break;
      case 'move-right':
        this.moveSelection(this.options.gridSize!, 0);
        break;
      // NOTE: Extend selection shortcuts (Shift+Arrow) not yet implemented
    }
  }

  private moveSelection(deltaX: number, deltaY: number) {
    const selectedIds = Array.from(this.state.selectedIds);
    selectedIds.forEach(id => {
      const bounds = this.componentBounds.get(id);
      if (bounds) {
        const newX = bounds.x + deltaX;
        const newY = bounds.y + deltaY;
        
        // Snap to grid if enabled
        const finalX = this.options.snapToGrid 
          ? Math.round(newX / this.options.gridSize!) * this.options.gridSize!
          : newX;
        const finalY = this.options.snapToGrid
          ? Math.round(newY / this.options.gridSize!) * this.options.gridSize!
          : newY;

        this.options.onComponentUpdate?.(id, {
          position: { x: finalX, y: finalY }
        });
      }
    });
  }

  private deleteSelected() {
    // Notify consumer so it can remove nodes from the tree
    const ids = Array.from(this.state.selectedIds);
    if (ids.length > 0) {
      this.options.onDeleteSelected?.(ids);
    }
    // Clear selection regardless
    this.clearSelection();
  }

  // Utility methods
  private getAllComponentIds(): string[] {
    return Array.from(this.componentBounds.keys());
  }

  // Getters
  getSelectedIds(): string[] {
    return Array.from(this.state.selectedIds);
  }

  getSelectionBox(): SelectionBox | null {
    return this.state.selectionBox;
  }

  isSelected(componentId: string): boolean {
    return this.state.selectedIds.has(componentId);
  }

  getSelectionCount(): number {
    return this.state.selectedIds.size;
  }

  getComponentBounds(componentId: string): BoundingBox | undefined {
    return this.componentBounds.get(componentId);
  }
}
