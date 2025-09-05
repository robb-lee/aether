/**
 * ID Generator for component tree nodes
 * 
 * Generates unique, trackable, and hierarchical IDs for components
 */

import { nanoid } from 'nanoid';

/**
 * Configuration for ID generation
 */
export interface IdGeneratorConfig {
  prefix?: string;
  length?: number;
  includeTimestamp?: boolean;
  includeHierarchy?: boolean;
}

/**
 * ID generation context for hierarchical IDs
 */
export interface IdContext {
  parentId?: string;
  depth: number;
  index: number;
  category?: string;
}

/**
 * ID Generator class for component trees
 */
export class IdGenerator {
  private config: Required<IdGeneratorConfig>;
  private usedIds: Set<string> = new Set();

  constructor(config: IdGeneratorConfig = {}) {
    this.config = {
      prefix: config.prefix || 'comp',
      length: config.length || 8,
      includeTimestamp: config.includeTimestamp ?? false,
      includeHierarchy: config.includeHierarchy ?? true,
    };
  }

  /**
   * Generate a unique component ID
   */
  generateId(context?: IdContext): string {
    let id: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      id = this.createId(context);
      attempts++;
      
      if (attempts > maxAttempts) {
        // Fallback to guaranteed unique ID
        id = `${this.config.prefix}_${nanoid(this.config.length)}_${Date.now()}`;
        break;
      }
    } while (this.usedIds.has(id));

    this.usedIds.add(id);
    return id;
  }

  /**
   * Generate ID for tree root
   */
  generateTreeId(name?: string): string {
    const timestamp = this.config.includeTimestamp 
      ? `_${Date.now()}` 
      : '';
    
    const sanitizedName = name 
      ? `_${name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 20)}`
      : '';
    
    // Generate nanoid with only alphanumeric and underscore characters
    const id = nanoid(6).replace(/-/g, '_');
    
    return `tree${sanitizedName}${timestamp}_${id}`;
  }

  /**
   * Generate hierarchical ID based on context
   */
  private createId(context?: IdContext): string {
    const parts: string[] = [this.config.prefix];

    if (context && this.config.includeHierarchy) {
      // Add category if available (truncate to 4 chars for consistency)
      if (context.category) {
        parts.push(context.category.slice(0, 4));
      }

      // Add depth and index for hierarchy
      parts.push(`d${context.depth}`);
      parts.push(`i${context.index}`);
    }

    // Add unique identifier
    parts.push(nanoid(this.config.length));

    // Add timestamp if enabled
    if (this.config.includeTimestamp) {
      parts.push(Date.now().toString(36));
    }

    return parts.join('_');
  }

  /**
   * Validate ID format
   */
  isValidId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    if (id.length < 3 || id.length > 100) return false;
    
    // Check for valid characters (alphanumeric, underscore, hyphen)
    return /^[a-zA-Z0-9_-]+$/.test(id);
  }

  /**
   * Extract information from hierarchical ID
   */
  parseId(id: string): {
    prefix: string;
    category?: string;
    depth?: number;
    index?: number;
    unique: string;
    timestamp?: number;
  } | null {
    const parts = id.split('_');
    if (parts.length < 2) return null;

    const result: any = {
      prefix: parts[0],
      unique: parts[parts.length - 1]
    };

    // Parse hierarchical information
    for (let i = 1; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (part.startsWith('d') && !isNaN(Number(part.slice(1)))) {
        result.depth = Number(part.slice(1));
      } else if (part.startsWith('i') && !isNaN(Number(part.slice(1)))) {
        result.index = Number(part.slice(1));
      } else if (part.length <= 4 && isNaN(Number(part))) {
        result.category = part;
      } else if (this.config.includeTimestamp && /^[a-z0-9]+$/.test(part) && part.length > 6) {
        // This looks like a base36 timestamp
        const timestamp = parseInt(part, 36);
        if (!isNaN(timestamp) && timestamp > 1000000000) { // Reasonable timestamp range
          result.timestamp = timestamp;
        }
      }
    }

    return result;
  }

  /**
   * Check if ID belongs to same tree/hierarchy
   */
  isSameHierarchy(id1: string, id2: string): boolean {
    const parsed1 = this.parseId(id1);
    const parsed2 = this.parseId(id2);
    
    if (!parsed1 || !parsed2) return false;
    
    return parsed1.prefix === parsed2.prefix && 
           parsed1.category === parsed2.category;
  }

  /**
   * Reset used IDs (useful for new tree generation)
   */
  reset(): void {
    this.usedIds.clear();
  }

  /**
   * Get statistics about generated IDs
   */
  getStats(): {
    totalGenerated: number;
    uniqueIds: string[];
    config: Required<IdGeneratorConfig>;
  } {
    return {
      totalGenerated: this.usedIds.size,
      uniqueIds: Array.from(this.usedIds),
      config: this.config
    };
  }
}

/**
 * Default ID generator instance
 */
export const defaultIdGenerator = new IdGenerator({
  prefix: 'comp',
  length: 8,
  includeHierarchy: true,
  includeTimestamp: false
});

/**
 * Helper functions for common ID operations
 */
export function generateComponentId(context?: IdContext): string {
  return defaultIdGenerator.generateId(context);
}

export function generateTreeId(name?: string): string {
  return defaultIdGenerator.generateTreeId(name);
}

export function validateComponentId(id: string): boolean {
  return defaultIdGenerator.isValidId(id);
}

export function resetIdGenerator(): void {
  defaultIdGenerator.reset();
}