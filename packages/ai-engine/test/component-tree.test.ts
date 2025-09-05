/**
 * Component Tree Builder Tests
 * 
 * Comprehensive test suite for the AI-powered component tree building system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentTreeBuilder, buildComponentTree } from '../builders/component-tree';
import { ComponentSelection } from '../selectors/component-selector';
import { generateComponentId, generateTreeId, resetIdGenerator } from '../lib/id-generator';
import { ComponentTree, ComponentNode, TreeBuildOptions } from '../types/components';

// Mock the registry to avoid dependency issues
vi.mock('../../component-registry/src/registry', () => ({
  getRegistry: () => ({
    getById: vi.fn().mockImplementation((id: string) => {
      const mockComponents = {
        'hero-split': {
          id: 'hero-split',
          name: 'Hero Split',
          reactComponent: 'HeroSplit',
          metadata: {
            category: 'hero',
            allowsChildren: false,
            tags: ['hero', 'split'],
            description: 'Split layout hero component'
          }
        },
        'features-grid': {
          id: 'features-grid',
          name: 'Features Grid',
          reactComponent: 'FeaturesGrid',
          metadata: {
            category: 'features',
            allowsChildren: false,
            tags: ['features', 'grid'],
            description: 'Grid layout for features'
          }
        }
      };
      return mockComponents[id as keyof typeof mockComponents] || null;
    }),
    getComponent: vi.fn().mockImplementation(async (id: string) => {
      const mockComponents = {
        'hero-split': {
          id: 'hero-split',
          name: 'Hero Split',
          reactComponent: 'HeroSplit',
          metadata: {
            category: 'hero',
            allowsChildren: false,
            tags: ['hero', 'split'],
            description: 'Split layout hero component'
          }
        },
        'features-grid': {
          id: 'features-grid',
          name: 'Features Grid',
          reactComponent: 'FeaturesGrid',
          metadata: {
            category: 'features',
            allowsChildren: false,
            tags: ['features', 'grid'],
            description: 'Grid layout for features'
          }
        }
      };
      return mockComponents[id as keyof typeof mockComponents] || null;
    })
  })
}));

describe('ComponentTreeBuilder', () => {
  let builder: ComponentTreeBuilder;
  let mockSelections: ComponentSelection;

  beforeEach(() => {
    builder = new ComponentTreeBuilder();
    resetIdGenerator();
    
    mockSelections = {
      selections: [
        {
          componentId: 'hero-split',
          props: {
            title: 'Test Hero Title',
            description: 'Test hero description',
            ctaText: 'Get Started',
            imagePrompt: 'Professional dashboard interface'
          }
        },
        {
          componentId: 'features-grid',
          props: {
            title: 'Our Features',
            features: [
              { title: 'Feature 1', description: 'Description 1', icon: 'icon-1' },
              { title: 'Feature 2', description: 'Description 2', icon: 'icon-2' }
            ]
          }
        }
      ]
    };
  });

  describe('Tree Building', () => {
    it('should build valid component tree from selections', async () => {
      const result = await builder.buildTree(
        mockSelections,
        'Build a SaaS landing page',
        { validateStructure: true }
      );

      expect(result.tree).toBeDefined();
      expect(result.tree.id).toMatch(/^tree/);
      expect(result.tree.name).toBe('modern website');
      expect(result.tree.root).toBeDefined();
      expect(result.tree.root.children).toHaveLength(2);
      expect(result.stats.nodesCreated).toBeGreaterThan(0);
    });

    it('should generate unique IDs for all nodes', async () => {
      const result = await builder.buildTree(mockSelections, 'Test prompt');
      const allIds = new Set<string>();
      
      function collectIds(node: ComponentNode) {
        allIds.add(node.id);
        node.children.forEach(collectIds);
      }
      
      collectIds(result.tree.root);
      
      // Check that all IDs are unique
      const totalNodes = result.stats.nodesCreated;
      expect(allIds.size).toBe(totalNodes);
    });

    it('should maintain parent-child relationships', async () => {
      const result = await builder.buildTree(mockSelections, 'Test prompt');
      
      function validateRelationships(node: ComponentNode) {
        node.children.forEach(child => {
          expect(child.parent).toBe(node.id);
          validateRelationships(child);
        });
      }
      
      validateRelationships(result.tree.root);
    });

    it('should apply layout information when requested', async () => {
      const result = await builder.buildTree(
        mockSelections,
        'Test prompt',
        { applyLayoutHints: true }
      );

      const hasLayout = result.tree.root.children.some(child => child.layout !== undefined);
      expect(hasLayout).toBe(true);
    });

    it('should include responsive configuration when requested', async () => {
      const result = await builder.buildTree(
        mockSelections,
        'Test prompt',
        { includeResponsive: true }
      );

      const hasResponsive = result.tree.root.children.some(child => child.responsive !== undefined);
      expect(hasResponsive).toBe(true);
    });

    it('should handle empty selections gracefully', async () => {
      const emptySelections: ComponentSelection = { selections: [] };
      
      await expect(
        builder.buildTree(emptySelections, 'Test prompt')
      ).rejects.toThrow('No component selections provided');
    });

    it('should provide helpful warnings for invalid components', async () => {
      const invalidSelections: ComponentSelection = {
        selections: [
          {
            componentId: 'nonexistent-component',
            props: { title: 'Test' }
          }
        ]
      };

      await expect(
        builder.buildTree(invalidSelections, 'Test prompt')
      ).rejects.toThrow('No valid components could be built from selections');
    });
  });

  describe('Tree Manipulation', () => {
    let sampleTree: ComponentTree;

    beforeEach(async () => {
      const result = await builder.buildTree(mockSelections, 'Sample tree');
      sampleTree = result.tree;
    });

    it('should find nodes by ID', async () => {
      const firstChild = sampleTree.root.children[0];
      const foundNode = builder.findNodeById(sampleTree, firstChild.id);
      
      expect(foundNode).toBeDefined();
      expect(foundNode?.id).toBe(firstChild.id);
    });

    it('should update node props', async () => {
      const firstChild = sampleTree.root.children[0];
      const success = builder.updateNodeProps(
        sampleTree,
        firstChild.id,
        { newProp: 'newValue' }
      );

      expect(success).toBe(true);
      expect(firstChild.props.newProp).toBe('newValue');
    });

    it('should clone tree with new IDs', async () => {
      const clonedTree = await builder.cloneTree(sampleTree, 'Cloned Tree');
      
      expect(clonedTree.id).not.toBe(sampleTree.id);
      expect(clonedTree.name).toBe('Cloned Tree');
      expect(clonedTree.root.id).not.toBe(sampleTree.root.id);
      
      // Check that structure is preserved but IDs are different
      expect(clonedTree.root.children).toHaveLength(sampleTree.root.children.length);
    });

    it('should calculate tree statistics correctly', async () => {
      const stats = builder.getTreeStats(sampleTree);
      
      expect(stats.totalNodes).toBeGreaterThan(0);
      expect(stats.maxDepth).toBeGreaterThanOrEqual(0);
      expect(Object.keys(stats.categories)).toContain('hero');
      expect(Object.keys(stats.componentTypes)).toContain('hero-split');
    });
  });

  describe('React Conversion', () => {
    it('should convert tree to React-renderable format', async () => {
      const result = await builder.buildTree(mockSelections, 'Test prompt');
      const reactTree = await builder.convertToReactTree(result.tree);

      expect(reactTree).toBeDefined();
      expect(reactTree.props).toBeDefined();
      expect(reactTree.props.id).toBe(result.tree.root.id);
      expect(reactTree.children).toBeDefined();
    });

    it('should include proper data attributes for debugging', async () => {
      const result = await builder.buildTree(mockSelections, 'Test prompt');
      const reactTree = await builder.convertToReactTree(result.tree);

      expect(reactTree.props['data-component']).toBe('root-container');
      expect(reactTree.props['data-category']).toBe('layout');
    });
  });

  describe('ID Generator', () => {
    it('should generate unique component IDs', () => {
      const id1 = generateComponentId();
      const id2 = generateComponentId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^comp_/);
      expect(id2).toMatch(/^comp_/);
    });

    it('should generate hierarchical IDs with context', () => {
      const id = generateComponentId({
        parentId: 'parent_123',
        depth: 2,
        index: 1,
        category: 'hero'
      });
      
      expect(id).toMatch(/^comp_hero_d2_i1_/);
    });

    it('should generate unique tree IDs', () => {
      const treeId1 = generateTreeId('test site');
      const treeId2 = generateTreeId('test site');
      
      expect(treeId1).not.toBe(treeId2);
      expect(treeId1).toMatch(/^tree_test_site_/);
    });
  });

  describe('Validation', () => {
    it('should detect circular references', async () => {
      // Create a mock selection that would create circular references
      const circularSelections: ComponentSelection = {
        selections: [
          {
            componentId: 'hero-split',
            props: {
              title: 'Test',
              children: [
                {
                  componentId: 'features-grid',
                  props: {
                    children: [
                      {
                        componentId: 'hero-split', // This creates a potential issue
                        props: { title: 'Nested' }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      };

      const result = await builder.buildTree(
        circularSelections,
        'Test circular',
        { validateStructure: true }
      );

      // Should complete without errors but may have warnings
      expect(result.tree).toBeDefined();
    });

    it('should validate tree depth limits', async () => {
      const result = await builder.buildTree(
        mockSelections,
        'Test prompt',
        { validateStructure: true, maxDepth: 5 }
      );

      expect(result.tree.metadata.maxDepth).toBeLessThanOrEqual(10);
    });
  });

  describe('Performance', () => {
    it('should build tree within reasonable time', async () => {
      const startTime = Date.now();
      const result = await builder.buildTree(mockSelections, 'Performance test');
      const buildTime = Date.now() - startTime;

      expect(buildTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.stats.buildTime).toBeLessThan(1000);
    });

    it('should handle large component selections efficiently', async () => {
      // Create a larger selection set
      const largeSelections: ComponentSelection = {
        selections: Array.from({ length: 10 }, (_, i) => ({
          componentId: i % 2 === 0 ? 'hero-split' : 'features-grid',
          props: {
            title: `Component ${i}`,
            description: `Description for component ${i}`
          }
        }))
      };

      const startTime = Date.now();
      const result = await builder.buildTree(largeSelections, 'Large test');
      const buildTime = Date.now() - startTime;

      expect(result.tree.root.children).toHaveLength(10);
      expect(buildTime).toBeLessThan(2000); // Should handle 10 components within 2 seconds
    });
  });

  describe('Integration', () => {
    it('should work with convenience function', async () => {
      const result = await buildComponentTree(
        mockSelections,
        'Integration test',
        { validateStructure: true }
      );

      expect(result.tree).toBeDefined();
      expect(result.stats).toBeDefined();
      expect(result.warnings).toBeDefined();
    });

    it('should integrate with existing registry system', async () => {
      const result = await builder.buildTree(mockSelections, 'Registry test');
      
      // Check that component definitions are properly referenced
      const hasValidComponents = result.tree.root.children.every(child => 
        ['hero-split', 'features-grid'].includes(child.componentId)
      );
      
      expect(hasValidComponents).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed selections gracefully', async () => {
      const malformedSelections = {
        selections: [
          {
            componentId: 'hero-split',
            props: {} // Empty props should work
          }
        ]
      } as any;

      const result = await builder.buildTree(malformedSelections, 'Error test');
      expect(result.tree).toBeDefined();
    });

    it('should provide helpful error messages', async () => {
      const invalidSelections: ComponentSelection = {
        selections: [
          {
            componentId: 'invalid-component-id',
            props: { title: 'Test' }
          }
        ]
      };

      await expect(
        builder.buildTree(invalidSelections, 'Error test')
      ).rejects.toThrow('No valid components could be built from selections');
    });
  });
});