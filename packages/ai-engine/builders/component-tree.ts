/**
 * Component Tree Builder
 * 
 * Converts AI-generated component selections into hierarchical React-renderable trees
 * Integrates with Component Registry for efficient component-based generation
 */

import { ComponentSelection } from '../selectors/component-selector';
import { 
  ComponentTree, 
  ComponentNode, 
  TreeBuildOptions, 
  TreeBuildResult,
  LayoutInfo,
  ResponsiveConfig
} from '../types/components';
import { 
  generateComponentId, 
  generateTreeId, 
  resetIdGenerator, 
  IdGenerator 
} from '../lib/id-generator';
import { getRegistry } from '../../component-registry/src/registry';
import { ComponentDefinition } from '../../component-registry/src/types/component';

/**
 * Main component tree builder class
 */
export class ComponentTreeBuilder {
  private registry = getRegistry();
  private idGenerator: IdGenerator;

  constructor(options: { prefix?: string } = {}) {
    this.idGenerator = new IdGenerator({
      prefix: options.prefix || 'comp',
      length: 8,
      includeHierarchy: true,
      includeTimestamp: false
    });
  }

  /**
   * Build component tree from AI selections
   */
  async buildTree(
    selections: ComponentSelection,
    userPrompt: string,
    options: TreeBuildOptions = {}
  ): Promise<TreeBuildResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    // Reset ID generator for clean tree
    this.idGenerator.reset();

    // Validate selections
    if (!selections.selections || selections.selections.length === 0) {
      throw new Error('No component selections provided');
    }

    // Build tree structure
    const treeId = generateTreeId();
    const rootNodes: ComponentNode[] = [];
    const allCategories = new Set<string>();
    let totalNodes = 0;
    let maxDepth = 0;

    // Process each selection and build nodes
    for (let i = 0; i < selections.selections.length; i++) {
      const selection = selections.selections[i];
      
      try {
        const componentDef = await this.registry.getById(selection.componentId);
        if (!componentDef) {
          warnings.push(`Component "${selection.componentId}" not found in registry`);
          continue;
        }

        const node = await this.buildComponentNode(
          selection,
          componentDef,
          { depth: 0, index: i, category: componentDef.metadata.category },
          options
        );

        rootNodes.push(node);
        allCategories.add(componentDef.metadata.category);
        totalNodes += this.countNodes(node);
        maxDepth = Math.max(maxDepth, this.calculateDepth(node));

      } catch (error) {
        warnings.push(`Failed to build component "${selection.componentId}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (rootNodes.length === 0) {
      throw new Error('No valid components could be built from selections');
    }

    // Create root container node
    const rootNode = await this.createRootContainer(rootNodes, options);
    totalNodes += 1;
    maxDepth += 1;

    // Build final tree
    const tree: ComponentTree = {
      id: treeId,
      name: this.generateTreeName(userPrompt),
      root: rootNode,
      metadata: {
        totalNodes,
        maxDepth,
        categories: Array.from(allCategories),
        generatedFrom: userPrompt,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      designTokens: options.designTokens
    };

    // Validate if requested
    if (options.validateStructure) {
      await this.validateTree(tree, warnings);
    }

    const buildTime = Date.now() - startTime;

    return {
      tree,
      warnings,
      stats: {
        nodesCreated: totalNodes,
        maxDepth,
        categories: Array.from(allCategories),
        buildTime
      }
    };
  }

  /**
   * Build individual component node
   */
  private async buildComponentNode(
    selection: { componentId: string; props: Record<string, any>; reasoning?: string },
    componentDef: ComponentDefinition,
    context: { depth: number; index: number; category: string },
    options: TreeBuildOptions,
    parentId?: string
  ): Promise<ComponentNode> {
    const nodeId = this.idGenerator.generateId({
      parentId,
      depth: context.depth,
      index: context.index,
      category: context.category
    });

    // Apply layout hints if enabled
    const layout = options.applyLayoutHints 
      ? this.generateLayoutInfo(componentDef, context)
      : undefined;

    // Apply responsive configuration if enabled
    const responsive = options.includeResponsive 
      ? this.generateResponsiveConfig(componentDef, selection.props)
      : undefined;

    // Build child nodes if component supports children
    const children: ComponentNode[] = [];
    if (selection.props.children) {
      // Process child components (recursive)
      for (let i = 0; i < selection.props.children.length; i++) {
        const childSelection = selection.props.children[i];
        const childDef = await this.registry.getById(childSelection.componentId);
        
        if (childDef) {
          const childNode = await this.buildComponentNode(
            childSelection,
            childDef,
            { depth: context.depth + 1, index: i, category: childDef.metadata.category },
            options,
            nodeId
          );
          children.push(childNode);
        }
      }
    }

    return {
      id: nodeId,
      componentId: selection.componentId,
      name: componentDef.name,
      props: this.sanitizeProps(selection.props),
      children,
      parent: parentId,
      layout,
      responsive,
      metadata: {
        depth: context.depth,
        index: context.index,
        category: context.category,
        tags: componentDef.metadata.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  /**
   * Create root container node that wraps all components
   */
  private async createRootContainer(
    children: ComponentNode[],
    options: TreeBuildOptions
  ): Promise<ComponentNode> {
    const rootId = this.idGenerator.generateId({
      depth: 0,
      index: 0,
      category: 'layout'
    });

    // Set parent references for root children
    children.forEach(child => {
      child.parent = rootId;
    });

    return {
      id: rootId,
      componentId: 'root-container',
      name: 'Site Root',
      props: {
        className: 'min-h-screen bg-background',
        role: 'main'
      },
      children,
      layout: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh'
      },
      metadata: {
        depth: 0,
        index: 0,
        category: 'layout',
        tags: ['root', 'container'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  /**
   * Generate layout information based on component definition
   */
  private generateLayoutInfo(
    componentDef: ComponentDefinition,
    context: { depth: number; index: number; category: string }
  ): LayoutInfo {
    const layout: LayoutInfo = {
      order: context.index,
      display: 'block'
    };

    // Apply category-specific layout defaults
    switch (context.category) {
      case 'hero':
        layout.display = 'flex';
        layout.flexDirection = 'column';
        layout.width = '100%';
        layout.padding = '4rem 0';
        break;
      
      case 'features':
        layout.display = 'grid';
        layout.gridTemplate = {
          columns: 'repeat(auto-fit, minmax(300px, 1fr))',
          rows: 'auto'
        };
        layout.gap = '2rem';
        layout.padding = '3rem 0';
        break;
      
      case 'header':
        layout.display = 'flex';
        layout.justifyContent = 'between';
        layout.alignItems = 'center';
        layout.width = '100%';
        layout.padding = '1rem 2rem';
        break;
      
      case 'footer':
        layout.display = 'flex';
        layout.flexDirection = 'column';
        layout.width = '100%';
        layout.padding = '3rem 2rem';
        layout.margin = 'auto 0 0 0';
        break;
      
      default:
        layout.width = '100%';
        layout.padding = '2rem 0';
    }

    return layout;
  }

  /**
   * Generate responsive configuration
   */
  private generateResponsiveConfig(
    componentDef: ComponentDefinition,
    props: Record<string, any>
  ): ResponsiveConfig {
    return {
      mobile: {
        padding: '1rem',
        fontSize: '0.9rem',
        gap: '1rem'
      },
      tablet: {
        padding: '2rem',
        fontSize: '1rem',
        gap: '1.5rem'
      },
      desktop: {
        padding: '3rem',
        fontSize: '1.1rem',
        gap: '2rem'
      },
      wide: {
        padding: '4rem',
        fontSize: '1.2rem',
        gap: '2.5rem'
      }
    };
  }

  /**
   * Sanitize and validate component props
   */
  private sanitizeProps(props: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      // Skip children as they're handled separately
      if (key === 'children') continue;
      
      // Sanitize strings
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } 
      // Handle arrays
      else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? item.trim() : item
        );
      } 
      // Handle objects
      else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeProps(value);
      } 
      // Keep primitives as-is
      else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Count total nodes in tree
   */
  private countNodes(node: ComponentNode): number {
    return 1 + node.children.reduce((sum, child) => sum + this.countNodes(child), 0);
  }

  /**
   * Calculate maximum depth of tree
   */
  private calculateDepth(node: ComponentNode): number {
    if (node.children.length === 0) return 0;
    return 1 + Math.max(...node.children.map(child => this.calculateDepth(child)));
  }

  /**
   * Generate descriptive tree name from user prompt
   */
  private generateTreeName(prompt: string): string {
    // Extract key business terms
    const businessTerms = prompt.match(/\b(restaurant|cafe|shop|store|agency|company|business|service|app|platform|website|site)\b/gi);
    const adjectives = prompt.match(/\b(modern|professional|creative|elegant|minimal|bold|clean|sleek)\b/gi);
    
    const businessTerm = businessTerms?.[0] || 'website';
    const adjective = adjectives?.[0] || 'modern';
    
    return `${adjective} ${businessTerm}`.toLowerCase();
  }

  /**
   * Validate tree structure
   */
  private async validateTree(tree: ComponentTree, warnings: string[]): Promise<void> {
    // Check for circular references
    this.validateNoCircularReferences(tree.root, new Set(), warnings);
    
    // Validate component IDs exist in registry
    await this.validateComponentReferences(tree.root, warnings);
    
    // Check for orphaned nodes
    this.validateParentChildConsistency(tree.root, warnings);
    
    // Validate depth limits
    if (tree.metadata.maxDepth > 10) {
      warnings.push(`Tree depth (${tree.metadata.maxDepth}) exceeds recommended limit of 10`);
    }
  }

  /**
   * Check for circular references in tree
   */
  private validateNoCircularReferences(
    node: ComponentNode, 
    visited: Set<string>, 
    warnings: string[]
  ): void {
    if (visited.has(node.id)) {
      warnings.push(`Circular reference detected: ${node.id}`);
      return;
    }

    visited.add(node.id);
    node.children.forEach(child => {
      this.validateNoCircularReferences(child, new Set(visited), warnings);
    });
  }

  /**
   * Validate all component IDs exist in registry
   */
  private async validateComponentReferences(
    node: ComponentNode,
    warnings: string[]
  ): Promise<void> {
    if (node.componentId !== 'root-container') {
      const componentDef = await this.registry.getById(node.componentId);
      if (!componentDef) {
        warnings.push(`Component "${node.componentId}" not found in registry`);
      }
    }

    // Validate children recursively
    for (const child of node.children) {
      await this.validateComponentReferences(child, warnings);
    }
  }

  /**
   * Validate parent-child relationship consistency
   */
  private validateParentChildConsistency(
    node: ComponentNode,
    warnings: string[]
  ): void {
    node.children.forEach(child => {
      if (child.parent !== node.id) {
        warnings.push(`Inconsistent parent reference: ${child.id} parent should be ${node.id} but is ${child.parent}`);
      }
      this.validateParentChildConsistency(child, warnings);
    });
  }

  /**
   * Convert tree to React-renderable format
   */
  async convertToReactTree(tree: ComponentTree): Promise<any> {
    return await this.convertNodeToReact(tree.root);
  }

  /**
   * Convert individual node to React format
   */
  private async convertNodeToReact(node: ComponentNode): Promise<any> {
    const componentDef = node.componentId === 'root-container' 
      ? null 
      : await this.registry.getById(node.componentId);

    const children = await Promise.all(
      node.children.map(child => this.convertNodeToReact(child))
    );

    return {
      type: componentDef?.component || 'div',
      props: {
        ...node.props,
        id: node.id,
        'data-component': node.componentId,
        'data-category': node.metadata.category,
        style: this.generateInlineStyles(node.layout, node.responsive),
      },
      children: children.length > 0 ? children : undefined
    };
  }

  /**
   * Generate inline styles from layout and responsive config
   */
  private generateInlineStyles(
    layout?: LayoutInfo,
    responsive?: ResponsiveConfig
  ): Record<string, any> {
    const styles: Record<string, any> = {};

    if (layout) {
      if (layout.display) styles.display = layout.display;
      if (layout.position) styles.position = layout.position;
      if (layout.width) styles.width = layout.width;
      if (layout.height) styles.height = layout.height;
      if (layout.margin) styles.margin = layout.margin;
      if (layout.padding) styles.padding = layout.padding;
      if (layout.gap) styles.gap = layout.gap;
      if (layout.flexDirection) styles.flexDirection = layout.flexDirection;
      if (layout.justifyContent) styles.justifyContent = layout.justifyContent;
      if (layout.alignItems) styles.alignItems = layout.alignItems;
      
      if (layout.gridTemplate) {
        if (layout.gridTemplate.columns) styles.gridTemplateColumns = layout.gridTemplate.columns;
        if (layout.gridTemplate.rows) styles.gridTemplateRows = layout.gridTemplate.rows;
        if (layout.gridTemplate.areas) styles.gridTemplateAreas = layout.gridTemplate.areas;
      }
    }

    return styles;
  }

  /**
   * Clone tree with new IDs (useful for templates)
   */
  async cloneTree(tree: ComponentTree, newName?: string): Promise<ComponentTree> {
    this.idGenerator.reset();
    
    const clonedRoot = await this.cloneNode(tree.root);
    
    return {
      ...tree,
      id: generateTreeId(),
      name: newName || `${tree.name} (copy)`,
      root: clonedRoot,
      metadata: {
        ...tree.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  /**
   * Clone individual node with new ID
   */
  private async cloneNode(node: ComponentNode, parentId?: string): Promise<ComponentNode> {
    const newId = this.idGenerator.generateId({
      parentId,
      depth: node.metadata.depth,
      index: node.metadata.index,
      category: node.metadata.category
    });

    const clonedChildren = await Promise.all(
      node.children.map(child => this.cloneNode(child, newId))
    );

    return {
      ...node,
      id: newId,
      parent: parentId,
      children: clonedChildren,
      metadata: {
        ...node.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }

  /**
   * Find node by ID in tree
   */
  findNodeById(tree: ComponentTree, nodeId: string): ComponentNode | null {
    return this.searchNode(tree.root, nodeId);
  }

  /**
   * Search for node recursively
   */
  private searchNode(node: ComponentNode, targetId: string): ComponentNode | null {
    if (node.id === targetId) return node;
    
    for (const child of node.children) {
      const found = this.searchNode(child, targetId);
      if (found) return found;
    }
    
    return null;
  }

  /**
   * Update node props in tree
   */
  updateNodeProps(
    tree: ComponentTree, 
    nodeId: string, 
    newProps: Record<string, any>
  ): boolean {
    const node = this.findNodeById(tree, nodeId);
    if (!node) return false;

    node.props = { ...node.props, ...newProps };
    node.metadata.updatedAt = new Date();
    tree.metadata.updatedAt = new Date();
    
    return true;
  }

  /**
   * Get tree statistics
   */
  getTreeStats(tree: ComponentTree): {
    totalNodes: number;
    maxDepth: number;
    categories: Record<string, number>;
    componentTypes: Record<string, number>;
  } {
    const stats = {
      totalNodes: 0,
      maxDepth: 0,
      categories: {} as Record<string, number>,
      componentTypes: {} as Record<string, number>
    };

    this.collectStats(tree.root, stats);
    stats.maxDepth = this.calculateDepth(tree.root);

    return stats;
  }

  /**
   * Collect statistics recursively
   */
  private collectStats(
    node: ComponentNode, 
    stats: { totalNodes: number; categories: Record<string, number>; componentTypes: Record<string, number> }
  ): void {
    stats.totalNodes++;
    stats.categories[node.metadata.category] = (stats.categories[node.metadata.category] || 0) + 1;
    stats.componentTypes[node.componentId] = (stats.componentTypes[node.componentId] || 0) + 1;

    node.children.forEach(child => this.collectStats(child, stats));
  }
}

/**
 * Default tree builder instance
 */
export const defaultTreeBuilder = new ComponentTreeBuilder();

/**
 * Convenience function to build tree from AI selections
 */
export async function buildComponentTree(
  selections: ComponentSelection,
  userPrompt: string,
  options: TreeBuildOptions = {}
): Promise<TreeBuildResult> {
  return await defaultTreeBuilder.buildTree(selections, userPrompt, options);
}

/**
 * Convert tree to React-renderable format
 */
export async function convertTreeToReact(tree: ComponentTree): Promise<any> {
  return await defaultTreeBuilder.convertToReactTree(tree);
}