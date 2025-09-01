import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRegistry, createComponent } from '../registry';
import { ComponentDefinition } from '../types/component';

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;
  let mockComponent: ComponentDefinition;

  beforeEach(() => {
    registry = new ComponentRegistry();
    
    // Create mock component for testing
    mockComponent = createComponent({
      id: 'test-hero',
      name: 'Test Hero',
      category: 'hero',
      component: () => null,
      defaultProps: { title: 'Test' },
      metadata: {
        description: 'Test component',
        tags: ['test', 'hero'],
        performance: {
          lighthouse: 95,
          bundleSize: 10,
          renderTime: 50,
          cls: 0.05,
          fcp: 1.0,
          lcp: 1.5
        },
        accessibility: {
          wcagLevel: 'AA',
          ariaCompliant: true,
          keyboardNavigable: true,
          screenReaderOptimized: true,
          colorContrast: 4.5,
          focusManagement: true
        },
        compatibility: {
          mobile: true,
          responsive: true,
          browsers: ['chrome'],
          frameworks: ['react'],
          serverComponents: true
        },
        usage: {
          totalUsage: 100,
          successRate: 0.9,
          industries: ['saas'],
          popularCombinations: [],
          averageProps: {}
        },
        aiHints: {
          industries: ['saas', 'tech'],
          useCases: ['landing page'],
          keywords: ['hero', 'saas'],
          avoidWhen: ['mobile-first']
        }
      }
    });
  });

  describe('Component Registration', () => {
    it('should register a component successfully', () => {
      expect(() => registry.register(mockComponent)).not.toThrow();
      expect(registry.getById('test-hero')).toBeDefined();
    });

    it('should prevent duplicate component IDs', () => {
      registry.register(mockComponent);
      expect(() => registry.register(mockComponent)).toThrow();
    });
  });

  describe('Component Retrieval', () => {
    beforeEach(() => {
      registry.register(mockComponent);
    });

    it('should retrieve component by ID', () => {
      const component = registry.getById('test-hero');
      expect(component).toBeDefined();
      expect(component?.name).toBe('Test Hero');
    });

    it('should retrieve components by category', () => {
      const heroComponents = registry.getByCategory('hero');
      expect(heroComponents).toHaveLength(1);
      expect(heroComponents[0].id).toBe('test-hero');
    });
  });

  describe('Component Search', () => {
    beforeEach(() => {
      registry.register(mockComponent);
    });

    it('should search by category', () => {
      const results = registry.search({ category: 'hero' });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('test-hero');
    });

    it('should search by industry', () => {
      const results = registry.search({ industry: 'saas' });
      expect(results).toHaveLength(1);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      registry.register(mockComponent);
    });

    it('should provide registry statistics', () => {
      const stats = registry.getStats();
      expect(stats.totalComponents).toBe(1);
      expect(stats.categoryCounts.hero).toBe(1);
    });
  });
});

describe('Helper Functions', () => {
  it('should create component with createComponent helper', () => {
    const component = createComponent({
      id: 'helper-test',
      name: 'Helper Test',
      category: 'hero',
      component: () => null,
      metadata: {
        description: 'Test component created with helper'
      }
    });
    
    expect(component.id).toBe('helper-test');
    expect(component.metadata.version).toBe('1.0.0');
    expect(component.metadata.performance.lighthouse).toBe(85);
  });
});