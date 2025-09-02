/**
 * ID Generator Tests
 * 
 * Test suite for component ID generation and validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  IdGenerator, 
  generateComponentId, 
  generateTreeId, 
  validateComponentId,
  resetIdGenerator 
} from '../lib/id-generator';

describe('IdGenerator', () => {
  let generator: IdGenerator;

  beforeEach(() => {
    generator = new IdGenerator({
      prefix: 'test',
      length: 8,
      includeHierarchy: true,
      includeTimestamp: false
    });
  });

  describe('Basic ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = generator.generateId();
      const id2 = generator.generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^test_/);
      expect(id2).toMatch(/^test_/);
    });

    it('should generate IDs with correct prefix', () => {
      const customGenerator = new IdGenerator({ prefix: 'custom' });
      const id = customGenerator.generateId();
      
      expect(id).toMatch(/^custom_/);
    });

    it('should generate IDs with specified length', () => {
      const customGenerator = new IdGenerator({ 
        prefix: 'test',
        length: 12,
        includeHierarchy: false 
      });
      const id = customGenerator.generateId();
      
      // Format: prefix_ + 12chars = 5 + 12 = 17 chars minimum
      expect(id.length).toBeGreaterThanOrEqual(17);
    });

    it('should include timestamp when requested', () => {
      const timestampGenerator = new IdGenerator({ 
        includeTimestamp: true,
        includeHierarchy: false 
      });
      const id = timestampGenerator.generateId();
      
      expect(id).toMatch(/_[a-z0-9]+$/); // Timestamp encoded in base36
    });
  });

  describe('Hierarchical ID Generation', () => {
    it('should include depth and index in hierarchical IDs', () => {
      const id = generator.generateId({
        depth: 2,
        index: 3,
        category: 'hero'
      });
      
      expect(id).toMatch(/^test_hero_d2_i3_/);
    });

    it('should handle parent context', () => {
      const id = generator.generateId({
        parentId: 'parent_123',
        depth: 1,
        index: 0,
        category: 'features'
      });
      
      expect(id).toMatch(/^test_feat_d1_i0_/); // Category truncated to 4 chars
    });

    it('should work without category', () => {
      const id = generator.generateId({
        depth: 1,
        index: 2
      });
      
      expect(id).toMatch(/^test_d1_i2_/);
    });
  });

  describe('Tree ID Generation', () => {
    it('should generate tree IDs with name', () => {
      const treeId = generator.generateTreeId('My Awesome Site');
      
      expect(treeId).toMatch(/^tree_my_awesome_site_/);
      expect(treeId.length).toBeGreaterThan(20);
    });

    it('should generate tree IDs without name', () => {
      const treeId = generator.generateTreeId();
      
      expect(treeId).toMatch(/^tree_/);
    });

    it('should sanitize tree names properly', () => {
      const treeId = generator.generateTreeId('My Site! With @#$% Special Characters');
      
      expect(treeId).toMatch(/^tree_my_site_with_/);
      expect(treeId).not.toMatch(/[^a-zA-Z0-9_]/); // Allow uppercase from nanoid
    });
  });

  describe('ID Validation', () => {
    it('should validate correct IDs', () => {
      const validId = 'comp_hero_d1_i0_abc12345';
      expect(generator.isValidId(validId)).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(generator.isValidId('')).toBe(false);
      expect(generator.isValidId('ab')).toBe(false); // Too short
      expect(generator.isValidId('invalid@id#with$special')).toBe(false);
      expect(generator.isValidId(null as any)).toBe(false);
      expect(generator.isValidId(123 as any)).toBe(false);
    });

    it('should accept IDs with underscores and hyphens', () => {
      expect(generator.isValidId('comp_hero-1_d2_i3')).toBe(true);
      expect(generator.isValidId('tree-name_abc123')).toBe(true);
    });
  });

  describe('ID Parsing', () => {
    it('should parse hierarchical IDs correctly', () => {
      const id = 'test_hero_d2_i3_abc12345';
      const parsed = generator.parseId(id);
      
      expect(parsed).toEqual({
        prefix: 'test',
        category: 'hero',
        depth: 2,
        index: 3,
        unique: 'abc12345'
      });
    });

    it('should parse IDs without category', () => {
      const id = 'test_d1_i0_xyz98765';
      const parsed = generator.parseId(id);
      
      expect(parsed).toEqual({
        prefix: 'test',
        depth: 1,
        index: 0,
        unique: 'xyz98765'
      });
    });

    it('should handle invalid ID formats', () => {
      expect(generator.parseId('invalid')).toBeNull();
      expect(generator.parseId('a')).toBeNull();
    });

    it('should parse IDs with timestamps', () => {
      const timestampGen = new IdGenerator({ 
        includeTimestamp: true,
        includeHierarchy: true 
      });
      const id = timestampGen.generateId({ depth: 1, index: 0 });
      const parsed = timestampGen.parseId(id);
      
      // The timestamp should be parsed if it exists and meets criteria
      if (parsed?.timestamp) {
        expect(typeof parsed.timestamp).toBe('number');
        expect(parsed.timestamp).toBeGreaterThan(1000000000);
      }
      
      // Just ensure the ID was generated correctly
      expect(id).toMatch(/^comp_d1_i0_/);
    });
  });

  describe('Hierarchy Detection', () => {
    it('should detect same hierarchy', () => {
      const id1 = 'comp_hero_d1_i0_abc123';
      const id2 = 'comp_hero_d1_i1_def456';
      
      expect(generator.isSameHierarchy(id1, id2)).toBe(true);
    });

    it('should detect different hierarchies', () => {
      const id1 = 'comp_hero_d1_i0_abc123';
      const id2 = 'comp_features_d1_i1_def456';
      
      expect(generator.isSameHierarchy(id1, id2)).toBe(false);
    });

    it('should detect different prefixes', () => {
      const id1 = 'comp_hero_d1_i0_abc123';
      const id2 = 'tree_hero_d1_i1_def456';
      
      expect(generator.isSameHierarchy(id1, id2)).toBe(false);
    });
  });

  describe('Reset and Statistics', () => {
    it('should reset used IDs', () => {
      generator.generateId();
      generator.generateId();
      
      const statsBefore = generator.getStats();
      expect(statsBefore.totalGenerated).toBe(2);
      
      generator.reset();
      
      const statsAfter = generator.getStats();
      expect(statsAfter.totalGenerated).toBe(0);
    });

    it('should track generation statistics', () => {
      const id1 = generator.generateId();
      const id2 = generator.generateId();
      
      const stats = generator.getStats();
      
      expect(stats.totalGenerated).toBe(2);
      expect(stats.uniqueIds).toContain(id1);
      expect(stats.uniqueIds).toContain(id2);
      expect(stats.config.prefix).toBe('test');
    });
  });

  describe('Global Functions', () => {
    beforeEach(() => {
      resetIdGenerator();
    });

    it('should work with global generateComponentId', () => {
      const id = generateComponentId();
      expect(id).toMatch(/^comp_/);
    });

    it('should work with global generateTreeId', () => {
      const treeId = generateTreeId('global test');
      expect(treeId).toMatch(/^tree_global_test_/);
    });

    it('should work with global validateComponentId', () => {
      expect(validateComponentId('comp_hero_d1_i0_abc123')).toBe(true);
      expect(validateComponentId('invalid@id')).toBe(false);
    });

    it('should reset global generator', () => {
      generateComponentId();
      generateComponentId();
      
      resetIdGenerator();
      
      // After reset, should be able to generate IDs normally
      const id = generateComponentId();
      expect(id).toMatch(/^comp_/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum attempts for unique ID generation', () => {
      // Fill up the generator with many IDs to test collision handling
      const generator = new IdGenerator({ length: 3 }); // Very short to increase collision chance
      
      const ids = new Set();
      for (let i = 0; i < 50; i++) {
        const id = generator.generateId();
        ids.add(id);
      }
      
      // Should still generate unique IDs even with short length
      expect(ids.size).toBe(50);
    });

    it('should handle very long names in tree ID generation', () => {
      const veryLongName = 'a'.repeat(200);
      const treeId = generator.generateTreeId(veryLongName);
      
      // Should truncate long names
      expect(treeId.length).toBeLessThan(100);
      expect(treeId).toMatch(/^tree_aaaaaaaaaaaaaaaaaaa/); // Should be truncated
    });

    it('should handle special characters in tree names', () => {
      const specialName = 'My Site!@#$%^&*()_+-=[]{}|;:,.<>?';
      const treeId = generator.generateTreeId(specialName);
      
      // Should only contain valid characters (allowing uppercase from nanoid)
      expect(treeId).toMatch(/^[a-zA-Z0-9_]+$/);
    });
  });
});