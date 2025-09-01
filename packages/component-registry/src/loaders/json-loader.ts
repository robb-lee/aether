import { readFile } from 'fs/promises';
import { join } from 'path';
import { 
  ExternalMetadata, 
  ExternalMetadataSchema,
  ComponentMetadata,
  IndustryMapping,
} from '../types/metadata';
import { DesignSystem, DesignSystemSchema, DesignTokens } from '../types/design-tokens';

/**
 * JSON-based metadata loader for extensible component registry
 * Supports dynamic loading of component metadata, design tokens, and industry mappings
 */
export class MetadataLoader {
  private cache: Map<string, any> = new Map();
  private cacheEnabled: boolean;
  private cacheTTL: number;

  constructor(options: {
    cacheEnabled?: boolean;
    cacheTTL?: number; // minutes
  } = {}) {
    this.cacheEnabled = options.cacheEnabled ?? true;
    this.cacheTTL = (options.cacheTTL ?? 30) * 60 * 1000; // Convert to ms
  }

  /**
   * Load external metadata from JSON file
   */
  async loadExternalMetadata(filePath: string): Promise<ExternalMetadata> {
    const cacheKey = `external:${filePath}`;
    
    if (this.cacheEnabled && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      const validated = ExternalMetadataSchema.parse(data);
      
      if (this.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: validated,
          timestamp: Date.now()
        });
      }
      
      return validated;
    } catch (error) {
      throw new Error(`Failed to load external metadata from ${filePath}: ${error}`);
    }
  }

  /**
   * Load design system from JSON file
   */
  async loadDesignSystem(filePath: string): Promise<DesignSystem> {
    const cacheKey = `design-system:${filePath}`;
    
    if (this.cacheEnabled && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      const validated = DesignSystemSchema.parse(data);
      
      if (this.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: validated,
          timestamp: Date.now()
        });
      }
      
      return validated;
    } catch (error) {
      throw new Error(`Failed to load design system from ${filePath}: ${error}`);
    }
  }

  /**
   * Load component metadata updates from JSON
   */
  async loadComponentUpdates(filePath: string): Promise<Record<string, Partial<ComponentMetadata>>> {
    const externalData = await this.loadExternalMetadata(filePath);
    
    const updates: Record<string, Partial<ComponentMetadata>> = {};
    
    if (externalData.components) {
      for (const [componentId, componentData] of Object.entries(externalData.components)) {
        updates[componentId] = {
          ...componentData.metadata,
          designTokens: componentData.designTokens,
          variants: componentData.variants,
          aiHints: componentData.aiHints,
          custom: {
            ...componentData.custom,
            loadedFrom: filePath,
            loadedAt: new Date().toISOString()
          }
        };
      }
    }
    
    return updates;
  }

  /**
   * Load industry mappings from JSON
   */
  async loadIndustryMappings(filePath: string): Promise<Record<string, IndustryMapping>> {
    const externalData = await this.loadExternalMetadata(filePath);
    return externalData.industries || {};
  }

  /**
   * Load design tokens from JSON
   */
  async loadDesignTokens(filePath: string): Promise<DesignTokens> {
    const externalData = await this.loadExternalMetadata(filePath);
    return externalData.designSystem || {};
  }

  /**
   * Merge external metadata with existing component metadata
   */
  mergeMetadata(
    existing: ComponentMetadata, 
    external: Partial<ComponentMetadata>
  ): ComponentMetadata {
    return {
      ...existing,
      ...external,
      
      // Deep merge nested objects
      designTokens: {
        ...existing.designTokens,
        ...external.designTokens
      },
      variants: {
        ...existing.variants,
        ...external.variants
      },
      aiHints: {
        ...existing.aiHints,
        ...external.aiHints,
        industries: [
          ...(existing.aiHints?.industries || []),
          ...(external.aiHints?.industries || [])
        ].filter((v, i, arr) => arr.indexOf(v) === i), // Remove duplicates
        useCases: [
          ...(existing.aiHints?.useCases || []),
          ...(external.aiHints?.useCases || [])
        ].filter((v, i, arr) => arr.indexOf(v) === i),
        keywords: [
          ...(existing.aiHints?.keywords || []),
          ...(external.aiHints?.keywords || [])
        ].filter((v, i, arr) => arr.indexOf(v) === i),
        avoidWhen: [
          ...(existing.aiHints?.avoidWhen || []),
          ...(external.aiHints?.avoidWhen || [])
        ].filter((v, i, arr) => arr.indexOf(v) === i)
      },
      custom: {
        ...existing.custom,
        ...external.custom
      },
      
      // Update timestamp
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Watch for file changes and reload metadata
   */
  async watchFile(filePath: string, callback: (metadata: ExternalMetadata) => void): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment - not supported
      console.warn('File watching not supported in browser environment');
      return;
    }

    try {
      const { watch } = await import('fs');
      watch(filePath, async (eventType) => {
        if (eventType === 'change') {
          try {
            // Clear cache and reload
            this.clearCache(`external:${filePath}`);
            const metadata = await this.loadExternalMetadata(filePath);
            callback(metadata);
          } catch (error) {
            console.error(`Error reloading metadata from ${filePath}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to set up file watcher:', error);
    }
  }

  /**
   * Validate JSON file structure before loading
   */
  async validateJSONFile(filePath: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      const result = ExternalMetadataSchema.safeParse(data);
      
      if (result.success) {
        return {
          valid: true,
          errors: [],
          warnings: []
        };
      } else {
        return {
          valid: false,
          errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
          warnings: []
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to parse JSON: ${error}`],
        warnings: []
      };
    }
  }

  /**
   * Cache management
   */
  private isCacheValid(key: string): boolean {
    if (!this.cacheEnabled) return false;
    
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const age = Date.now() - cached.timestamp;
    return age < this.cacheTTL;
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getCacheStats(): {
    size: number;
    keys: string[];
    totalMemory: number;
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: JSON.stringify(Object.fromEntries(this.cache)).length
    };
  }
}

/**
 * Default paths for metadata files
 */
export const DEFAULT_METADATA_PATHS = {
  components: './metadata/component-meta.json',
  designTokens: './metadata/design-tokens.json',
  industryMappings: './metadata/industry-mappings.json',
  designSystem: './metadata/design-system.json'
} as const;

/**
 * Helper function to resolve metadata file paths
 */
export function resolveMetadataPath(basePath: string, file: string): string {
  return join(basePath, file);
}

/**
 * Utility to create metadata file template
 */
export function createMetadataTemplate(): ExternalMetadata {
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    components: {},
    industries: {},
    designSystem: {},
    config: {}
  };
}