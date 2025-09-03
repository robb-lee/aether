import { describe, it, expect } from 'vitest';
import { ComponentTreeNode } from '../types';
import {
  flattenComponentTree,
  rebuildComponentTree,
  moveComponent,
  canDropInto
} from './utils/sortableHelpers';
import {
  findComponent,
  findParentComponent,
  canMoveComponent,
  getDropZoneType,
  generateDndId,
  extractComponentId
} from './utils/dndHelpers';

describe('Drag and Drop System', () => {
  const mockTree: ComponentTreeNode = {
    id: 'root',
    type: 'page',
    props: {},
    children: [
      {
        id: 'section1',
        type: 'section',
        props: { title: 'Section 1' },
        children: [
          {
            id: 'text1',
            type: 'text',
            props: { content: 'Text 1' }
          },
          {
            id: 'button1',
            type: 'button',
            props: { text: 'Button 1' }
          }
        ]
      },
      {
        id: 'section2',
        type: 'section',
        props: { title: 'Section 2' },
        children: [
          {
            id: 'text2',
            type: 'text',
            props: { content: 'Text 2' }
          }
        ]
      }
    ]
  };

  describe('Tree Flattening and Rebuilding', () => {
    it('should flatten component tree correctly', () => {
      const flattened = flattenComponentTree(mockTree);
      
      expect(flattened).toHaveLength(6); // root + 2 sections + 3 components
      expect(flattened[0].id).toBe('root');
      expect(flattened[1].id).toBe('section1');
      expect(flattened[1].parentId).toBe('root');
      expect(flattened[2].id).toBe('text1');
      expect(flattened[2].parentId).toBe('section1');
    });

    it('should rebuild component tree correctly', () => {
      const flattened = flattenComponentTree(mockTree);
      const rebuilt = rebuildComponentTree(flattened);
      
      expect(rebuilt).toBeDefined();
      expect(rebuilt!.id).toBe('root');
      expect(rebuilt!.children).toHaveLength(2);
      expect(rebuilt!.children![0].id).toBe('section1');
      expect(rebuilt!.children![0].children).toHaveLength(2);
    });
  });

  describe('Component Movement', () => {
    it('should move component to new position', () => {
      const movedTree = moveComponent(mockTree, 'text1', 'section2', 'inside');
      const section2 = findComponent(movedTree, 'section2');
      
      expect(section2).toBeDefined();
      expect(section2!.children).toHaveLength(2); // text2 + moved text1
      
      const section1 = findComponent(movedTree, 'section1');
      expect(section1!.children).toHaveLength(1); // only button1 remains
    });

    it('should prevent moving component into itself', () => {
      expect(canMoveComponent(mockTree, 'section1', 'section1')).toBe(false);
    });

    it('should prevent moving component into its descendant', () => {
      expect(canMoveComponent(mockTree, 'section1', 'text1')).toBe(false);
    });
  });

  describe('Component Finding', () => {
    it('should find component by id', () => {
      const found = findComponent(mockTree, 'text1');
      expect(found).toBeDefined();
      expect(found!.id).toBe('text1');
      expect(found!.type).toBe('text');
    });

    it('should find parent component', () => {
      const parent = findParentComponent(mockTree, 'text1');
      expect(parent).toBeDefined();
      expect(parent!.id).toBe('section1');
    });

    it('should return null for non-existent component', () => {
      const found = findComponent(mockTree, 'nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('Drop Zone Logic', () => {
    it('should determine correct drop zone type', () => {
      expect(getDropZoneType('text', 'section')).toBe('container');
      expect(getDropZoneType('button', 'text')).toBe('sibling');
    });

    it('should validate drop acceptance', () => {
      expect(canDropInto('text', 'section')).toBe(true);
      expect(canDropInto('section', 'button')).toBe(true); // Default allows all
    });
  });

  describe('DnD ID Management', () => {
    it('should generate correct DnD IDs', () => {
      expect(generateDndId('comp1', 'drag')).toBe('drag-comp1');
      expect(generateDndId('comp2', 'drop')).toBe('drop-comp2');
    });

    it('should extract component ID from DnD ID', () => {
      expect(extractComponentId('drag-comp1')).toBe('comp1');
      expect(extractComponentId('drop-comp2')).toBe('comp2');
    });
  });
});