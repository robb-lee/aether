import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectionManager } from './SelectionManager';
import { ComponentTreeNode } from '../types';

const mockComponentTree: ComponentTreeNode = {
  id: 'root',
  type: 'page',
  props: {},
  children: [
    {
      id: 'hero-1',
      type: 'hero',
      props: { title: 'Hero' },
      position: { x: 100, y: 100 },
      size: { width: 400, height: 200 }
    },
    {
      id: 'features-1', 
      type: 'features',
      props: { title: 'Features' },
      position: { x: 100, y: 350 },
      size: { width: 500, height: 300 }
    },
    {
      id: 'footer-1',
      type: 'footer',
      props: { text: 'Footer' },
      position: { x: 100, y: 700 },
      size: { width: 600, height: 100 }
    }
  ]
};

describe('SelectionManager', () => {
  let selectionManager: SelectionManager;
  let onSelectionChange: ReturnType<typeof vi.fn>;
  let onComponentUpdate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSelectionChange = vi.fn();
    onComponentUpdate = vi.fn();
    
    selectionManager = new SelectionManager({
      onSelectionChange,
      onComponentUpdate,
      snapToGrid: true,
      gridSize: 24
    });
    
    selectionManager.setComponentTree(mockComponentTree);
  });

  describe('Single Selection', () => {
    it('should select a single component', () => {
      selectionManager.select('hero-1');
      
      expect(selectionManager.getSelectedIds()).toEqual(['hero-1']);
      expect(selectionManager.isSelected('hero-1')).toBe(true);
      expect(onSelectionChange).toHaveBeenCalledWith(['hero-1']);
    });

    it('should replace selection when selecting without multi-select', () => {
      selectionManager.select('hero-1');
      selectionManager.select('features-1');
      
      expect(selectionManager.getSelectedIds()).toEqual(['features-1']);
      expect(selectionManager.isSelected('hero-1')).toBe(false);
      expect(selectionManager.isSelected('features-1')).toBe(true);
    });
  });

  describe('Multi Selection', () => {
    it('should add to selection with multi-select', () => {
      selectionManager.select('hero-1');
      selectionManager.select('features-1', true);
      
      expect(selectionManager.getSelectedIds()).toContain('hero-1');
      expect(selectionManager.getSelectedIds()).toContain('features-1');
      expect(selectionManager.getSelectionCount()).toBe(2);
    });

    it('should remove from selection when clicking selected item with multi-select', () => {
      selectionManager.select('hero-1');
      selectionManager.select('features-1', true);
      selectionManager.select('hero-1', true); // Should remove
      
      expect(selectionManager.getSelectedIds()).toEqual(['features-1']);
      expect(selectionManager.isSelected('hero-1')).toBe(false);
    });

    it('should select multiple components at once', () => {
      selectionManager.selectMultiple(['hero-1', 'features-1']);
      
      expect(selectionManager.getSelectionCount()).toBe(2);
      expect(selectionManager.isSelected('hero-1')).toBe(true);
      expect(selectionManager.isSelected('features-1')).toBe(true);
    });
  });

  describe('Selection Box', () => {
    it('should start a selection box', () => {
      const startPoint = { x: 50, y: 50 };
      selectionManager.startSelectionBox(startPoint);
      
      const selectionBox = selectionManager.getSelectionBox();
      expect(selectionBox).toBeTruthy();
      expect(selectionBox?.startPoint).toEqual(startPoint);
    });

    it('should update selection box and select intersecting components', () => {
      // Start selection at point that will intersect with hero-1
      selectionManager.startSelectionBox({ x: 50, y: 50 });
      selectionManager.updateSelectionBox({ x: 250, y: 200 });
      
      // Should select hero-1 (position: 100,100 size: 400,200)
      expect(selectionManager.isSelected('hero-1')).toBe(true);
    });

    it('should end selection box', () => {
      selectionManager.startSelectionBox({ x: 50, y: 50 });
      selectionManager.endSelectionBox();
      
      expect(selectionManager.getSelectionBox()).toBeNull();
    });
  });

  describe('Selection Operations', () => {
    it('should select all components', () => {
      selectionManager.selectAll();
      
      expect(selectionManager.getSelectionCount()).toBe(3); // only positioned components
      expect(selectionManager.isSelected('hero-1')).toBe(true);
      expect(selectionManager.isSelected('features-1')).toBe(true);
      expect(selectionManager.isSelected('footer-1')).toBe(true);
    });

    it('should clear all selections', () => {
      selectionManager.selectAll();
      selectionManager.clearSelection();
      
      expect(selectionManager.getSelectionCount()).toBe(0);
      expect(selectionManager.getSelectedIds()).toEqual([]);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle select all shortcut', () => {
      selectionManager.handleKeyboardShortcut('select-all');
      
      expect(selectionManager.getSelectionCount()).toBeGreaterThan(0);
    });

    it('should handle deselect all shortcut', () => {
      selectionManager.select('hero-1');
      selectionManager.handleKeyboardShortcut('deselect-all');
      
      expect(selectionManager.getSelectionCount()).toBe(0);
    });

    it('should handle move shortcuts', () => {
      selectionManager.select('hero-1');
      selectionManager.handleKeyboardShortcut('move-right');
      
      expect(onComponentUpdate).toHaveBeenCalledWith('hero-1', {
        position: { x: 120, y: 96 } // snapped to grid (24px intervals)
      });
    });
  });

  describe('Component Bounds', () => {
    it('should track component bounds', () => {
      const bounds = selectionManager.getComponentBounds('hero-1');
      
      expect(bounds).toEqual({
        x: 100,
        y: 100,
        width: 400,
        height: 200
      });
    });

    it('should return undefined for non-existent components', () => {
      const bounds = selectionManager.getComponentBounds('non-existent');
      
      expect(bounds).toBeUndefined();
    });
  });

  describe('Box Intersection', () => {
    it('should detect intersecting components correctly', () => {
      // Create selection box that intersects with hero-1
      selectionManager.startSelectionBox({ x: 90, y: 90 });
      selectionManager.updateSelectionBox({ x: 110, y: 110 });
      
      expect(selectionManager.isSelected('hero-1')).toBe(true);
    });

    it('should not select non-intersecting components', () => {
      // Create selection box that doesn't intersect with any component
      selectionManager.startSelectionBox({ x: 10, y: 10 });
      selectionManager.updateSelectionBox({ x: 50, y: 50 });
      
      // Should not select the positioned components (hero-1 at 100,100; features-1 at 100,350; footer-1 at 100,700)
      expect(selectionManager.isSelected('hero-1')).toBe(false);
      expect(selectionManager.isSelected('features-1')).toBe(false);
      expect(selectionManager.isSelected('footer-1')).toBe(false);
    });
  });
});