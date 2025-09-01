/**
 * Prompt Engine with 5-Stage Pipeline
 * 
 * Main orchestrator that routes prompts to appropriate models via LiteLLM
 * Based on prompt.md Section 2.2 - Site Generation Pipeline
 */

import { 
  generateCompletion, 
  streamCompletion,
  type CompletionResponse 
} from '../lib/litellm-client';
import { 
  routeToModel, 
  getOptimalChain, 
  calculateTotalResources,
  AdaptiveRouter,
  type TaskType 
} from '../lib/model-router';
import { 
  extractContext, 
  enhancePrompt, 
  enhanceForTask,
  optimizePrompt 
} from '../lib/enhancer';
import { 
  systemPrompts, 
  stagePrompts, 
  createPromptChain,
  getSystemPrompt,
  enhanceWithIndustry 
} from '../prompts/system';
import { getTemplate, getTemplatePrompt } from '../prompts/templates';
import {
  type SiteStructure,
  type ContextExtraction,
  type GenerationProgress,
  type GenerationRequest,
  type GenerationResponse,
  type ValidationResult,
  SiteStructureSchema,
  ContextExtractionSchema,
  GenerationProgressSchema,
  GenerationResponseSchema,
  validateSiteStructure,
  safeParseSiteStructure
} from '../schemas/site-structure';

/**
 * Generation options
 */
export interface GenerationOptions {
  streaming?: boolean;
  validateOutput?: boolean;
  optimizePerformance?: boolean;
  generateImages?: boolean;
  maxTokens?: number;
  temperature?: number;
  priority?: 'quality' | 'speed' | 'cost';
  onProgress?: (progress: GenerationProgress) => void;
}

/**
 * Stage timing targets (total: 30 seconds)
 */
const STAGE_TIMING = {
  contextAnalysis: 5000,      // 5 seconds
  structureGeneration: 5000,   // 5 seconds
  contentGeneration: 10000,    // 10 seconds
  designSystem: 5000,          // 5 seconds
  optimization: 5000           // 5 seconds
};

/**
 * Main Prompt Engine class
 */
export class PromptEngine {
  private adaptiveRouter: AdaptiveRouter;
  private totalCost: number = 0;
  private totalTokens: number = 0;
  private attemptedModels: string[] = [];
  
  constructor() {
    this.adaptiveRouter = new AdaptiveRouter();
  }
  
  /**
   * Generate complete website from prompt
   * Implements 5-stage pipeline from prompt.md
   */
  async generateSite(
    request: GenerationRequest,
    options: GenerationOptions = {}
  ): Promise<GenerationResponse> {
    const startTime = Date.now();
    const generationId = this.generateId();
    
    try {
      // Reset tracking
      this.totalCost = 0;
      this.totalTokens = 0;
      this.attemptedModels = [];
      
      // Stage 1: Context Analysis (5s)
      this.reportProgress(options.onProgress, {
        stage: 'context_analysis',
        progress: 10,
        currentTask: 'Analyzing user requirements',
        estimatedTimeRemaining: 25
      });
      
      const context = await this.analyzeContext(request.prompt, options);
      
      // Stage 2: Structure Generation (5s)
      this.reportProgress(options.onProgress, {
        stage: 'structure_generation',
        progress: 30,
        currentTask: 'Generating website structure',
        estimatedTimeRemaining: 20
      });
      
      const structure = await this.generateStructure(context, request, options);
      
      // Stage 3: Content Generation (10s)
      this.reportProgress(options.onProgress, {
        stage: 'content_generation',
        progress: 50,
        currentTask: 'Creating content for all sections',
        estimatedTimeRemaining: 15
      });
      
      const content = await this.generateContent(context, structure, options);
      
      // Stage 4: Design System (5s)
      this.reportProgress(options.onProgress, {
        stage: 'design_system',
        progress: 70,
        currentTask: 'Applying design system',
        estimatedTimeRemaining: 10
      });
      
      const design = await this.generateDesignSystem(context, options);
      
      // Stage 5: Assembly & Optimization (5s)
      this.reportProgress(options.onProgress, {
        stage: 'optimization',
        progress: 85,
        currentTask: 'Optimizing and validating',
        estimatedTimeRemaining: 5
      });
      
      const finalSite = await this.assembleAndOptimize(
        structure,
        content,
        design,
        context,
        options
      );
      
      // Validation
      let validation: ValidationResult | undefined;
      if (options.validateOutput) {
        validation = await this.validateSite(finalSite);
      }
      
      // Complete
      this.reportProgress(options.onProgress, {
        stage: 'complete',
        progress: 100,
        currentTask: 'Generation complete',
        estimatedTimeRemaining: 0
      });
      
      const totalTime = Date.now() - startTime;
      
      return GenerationResponseSchema.parse({
        success: true,
        siteStructure: finalSite,
        validation,
        metadata: {
          generationId,
          model: this.attemptedModels[0] || 'unknown',
          totalTime,
          totalCost: this.totalCost,
          tokenUsage: {
            prompt: Math.floor(this.totalTokens * 0.3),
            completion: Math.floor(this.totalTokens * 0.7),
            total: this.totalTokens
          },
          fallbackUsed: this.attemptedModels.length > 1,
          attemptedModels: this.attemptedModels
        }
      });
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      
      return GenerationResponseSchema.parse({
        success: false,
        metadata: {
          generationId,
          model: this.attemptedModels[0] || 'unknown',
          totalTime,
          totalCost: this.totalCost,
          tokenUsage: {
            prompt: 0,
            completion: 0,
            total: 0
          },
          fallbackUsed: this.attemptedModels.length > 1,
          attemptedModels: this.attemptedModels
        },
        error: {
          code: 'GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      });
    }
  }
  
  /**
   * Stage 1: Context Analysis
   */
  private async analyzeContext(
    prompt: string,
    options: GenerationOptions
  ): Promise<ContextExtraction> {
    // First try to extract context directly
    const quickContext = await extractContext(prompt);
    
    // If we need more detailed analysis, use AI
    if (!quickContext.industry || quickContext.goals.length === 0) {
      const modelSelection = routeToModel('analysis', undefined, {
        priority: options.priority || 'quality'
      });
      
      const enhancedPrompt = stagePrompts.contextAnalysis.replace(
        '{user_prompt}',
        prompt
      );
      
      const response = await this.executeWithModel(
        modelSelection.primary,
        'analysis',
        enhancedPrompt,
        options
      );
      
      if (response.response.choices[0]?.message?.content) {
        try {
          const aiContext = JSON.parse(response.response.choices[0].message.content);
          return ContextExtractionSchema.parse(aiContext);
        } catch {
          // Fallback to quick context if AI parsing fails
          return quickContext;
        }
      }
    }
    
    return quickContext;
  }
  
  /**
   * Stage 2: Structure Generation
   */
  private async generateStructure(
    context: ContextExtraction,
    request: GenerationRequest,
    options: GenerationOptions
  ): Promise<any> {
    const template = getTemplate(context.industry);
    const templatePrompt = template ? getTemplatePrompt(context.industry) : '';
    
    const modelSelection = routeToModel('structure', context, {
      priority: options.priority || 'quality'
    });
    
    let structurePrompt = stagePrompts.structureGeneration
      .replace('{context}', JSON.stringify(context))
      .replace('{template}', context.industry);
    
    structurePrompt = enhanceWithIndustry(structurePrompt, context.industry);
    structurePrompt += templatePrompt;
    
    const response = await this.executeWithModel(
      modelSelection.primary,
      'structure',
      structurePrompt,
      options
    );
    
    const content = response.response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate structure');
    }
    
    try {
      return JSON.parse(content);
    } catch {
      // If parsing fails, return a basic structure
      return this.createBasicStructure(context, template);
    }
  }
  
  /**
   * Stage 3: Content Generation
   */
  private async generateContent(
    context: ContextExtraction,
    structure: any,
    options: GenerationOptions
  ): Promise<any> {
    const modelSelection = routeToModel('content', context, {
      priority: options.priority || 'quality'
    });
    
    let contentPrompt = stagePrompts.contentGeneration
      .replace('{context}', JSON.stringify(context))
      .replace('{structure}', JSON.stringify(structure));
    
    contentPrompt = enhanceForTask(contentPrompt, 'content');
    
    const response = await this.executeWithModel(
      modelSelection.primary,
      'content',
      contentPrompt,
      options
    );
    
    const content = response.response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate content');
    }
    
    try {
      return JSON.parse(content);
    } catch {
      // Return as text if not JSON
      return { content };
    }
  }
  
  /**
   * Stage 4: Design System Generation
   */
  private async generateDesignSystem(
    context: ContextExtraction,
    options: GenerationOptions
  ): Promise<any> {
    const modelSelection = routeToModel('simple', context, {
      priority: 'speed' // Design system can use faster model
    });
    
    const designPrompt = stagePrompts.designSystem
      .replace('{industry}', context.industry)
      .replace('{style}', context.style);
    
    const response = await this.executeWithModel(
      modelSelection.primary,
      'simple',
      designPrompt,
      options
    );
    
    const content = response.response.choices[0]?.message?.content;
    if (!content) {
      // Return default design system
      return this.getDefaultDesignSystem(context);
    }
    
    try {
      return JSON.parse(content);
    } catch {
      return this.getDefaultDesignSystem(context);
    }
  }
  
  /**
   * Stage 5: Assembly and Optimization
   */
  private async assembleAndOptimize(
    structure: any,
    content: any,
    design: any,
    context: ContextExtraction,
    options: GenerationOptions
  ): Promise<SiteStructure> {
    // Merge all components
    const assembled = this.mergeComponents(structure, content, design, context);
    
    if (options.optimizePerformance) {
      // Run optimization pass
      const modelSelection = routeToModel('simple', context, {
        priority: 'speed'
      });
      
      const optimizationPrompt = stagePrompts.optimization
        .replace('{structure}', JSON.stringify(assembled))
        .replace('{content}', JSON.stringify(content))
        .replace('{design}', JSON.stringify(design));
      
      const response = await this.executeWithModel(
        modelSelection.primary,
        'simple',
        optimizationPrompt,
        options
      );
      
      const optimized = response.response.choices[0]?.message?.content;
      if (optimized) {
        try {
          const parsed = JSON.parse(optimized);
          return validateSiteStructure(parsed);
        } catch {
          // Fallback to assembled if optimization fails
        }
      }
    }
    
    return validateSiteStructure(assembled);
  }
  
  /**
   * Execute prompt with specific model
   */
  private async executeWithModel(
    model: string,
    task: TaskType,
    prompt: string,
    options: GenerationOptions
  ): Promise<CompletionResponse> {
    const systemPrompt = getSystemPrompt(task);
    const optimizedPrompt = optimizePrompt(prompt, options.maxTokens);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: optimizedPrompt }
    ];
    
    const response = await generateCompletion({
      messages,
      model,
      task,
      maxRetries: 3,
      stream: false,
      metadata: { task }
    });
    
    // Track usage
    this.totalCost += response.cost || 0;
    this.totalTokens += response.response.usage?.total_tokens || 0;
    if (!this.attemptedModels.includes(response.model)) {
      this.attemptedModels.push(response.model);
    }
    
    // Record performance for adaptive routing
    this.adaptiveRouter.recordPerformance(
      response.model,
      task,
      1000, // placeholder time
      response.cost || 0,
      true
    );
    
    return response;
  }
  
  /**
   * Validate generated site
   */
  private async validateSite(site: SiteStructure): Promise<ValidationResult> {
    const startTime = Date.now();
    const issues: any[] = [];
    let score = 100;
    
    // Check structure validity
    const parseResult = safeParseSiteStructure(site);
    if (!parseResult.success) {
      parseResult.error?.errors.forEach(err => {
        issues.push({
          type: 'error',
          path: err.path.join('.'),
          message: err.message,
          autoFixed: false
        });
        score -= 10;
      });
    }
    
    // Check for required sections
    if (!site.pages || site.pages.length === 0) {
      issues.push({
        type: 'error',
        message: 'No pages generated',
        autoFixed: false
      });
      score -= 20;
    }
    
    // Check SEO metadata
    site.pages?.forEach(page => {
      if (!page.seo?.title) {
        issues.push({
          type: 'warning',
          path: `pages.${page.id}.seo.title`,
          message: 'Missing SEO title',
          autoFixed: false
        });
        score -= 5;
      }
    });
    
    return {
      valid: issues.filter(i => i.type === 'error').length === 0,
      score: Math.max(0, score),
      issues,
      metadata: {
        validatedAt: new Date().toISOString(),
        validationTime: Date.now() - startTime,
        rulesApplied: ['structure', 'seo', 'completeness']
      }
    };
  }
  
  /**
   * Helper: Create basic structure fallback
   */
  private createBasicStructure(context: ContextExtraction, template: any): any {
    return {
      root: {
        id: 'root',
        type: 'page',
        props: {},
        children: template?.sections.map((section: any) => ({
          id: section.id,
          type: section.type,
          props: {},
          children: section.components
        })) || []
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'fallback',
        industry: context.industry
      }
    };
  }
  
  /**
   * Helper: Get default design system
   */
  private getDefaultDesignSystem(context: ContextExtraction): any {
    const template = getTemplate(context.industry);
    return template?.defaultStyle || {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#334155'
      },
      typography: {
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
        scale: 1.25
      },
      spacing: {
        base: '8px',
        scale: ['4px', '8px', '16px', '24px', '32px', '48px', '64px']
      },
      borderRadius: '8px',
      shadows: 'subtle'
    };
  }
  
  /**
   * Helper: Merge components into final structure
   */
  private mergeComponents(
    structure: any,
    content: any,
    design: any,
    context: ContextExtraction
  ): any {
    const now = new Date().toISOString();
    
    return {
      id: this.generateId(),
      name: `${context.industry} Website`,
      pages: [{
        id: 'home',
        name: 'Home',
        path: '/',
        components: structure,
        seo: {
          title: content.title || `${context.industry} - Professional Website`,
          description: content.description || 'Welcome to our website',
          keywords: context.keywords || []
        }
      }],
      globalStyles: design,
      navigation: {
        main: this.generateNavigation(structure)
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: '1.0.0',
        template: context.industry,
        industry: context.industry
      }
    };
  }
  
  /**
   * Helper: Generate navigation from structure
   */
  private generateNavigation(structure: any): any[] {
    const navigation: any[] = [];
    
    // Extract sections for navigation
    if (structure.root?.children) {
      structure.root.children.forEach((section: any) => {
        if (section.type && section.id) {
          navigation.push({
            label: this.formatLabel(section.id),
            path: `#${section.id}`
          });
        }
      });
    }
    
    return navigation.length > 0 ? navigation : [
      { label: 'Home', path: '/' },
      { label: 'About', path: '#about' },
      { label: 'Contact', path: '#contact' }
    ];
  }
  
  /**
   * Helper: Format label from ID
   */
  private formatLabel(id: string): string {
    return id
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  /**
   * Helper: Report progress
   */
  private reportProgress(
    onProgress?: (progress: GenerationProgress) => void,
    progress?: Partial<GenerationProgress>
  ): void {
    if (onProgress && progress) {
      const fullProgress = GenerationProgressSchema.parse({
        stage: progress.stage || 'initializing',
        progress: progress.progress || 0,
        currentTask: progress.currentTask || '',
        message: progress.message,
        estimatedTimeRemaining: progress.estimatedTimeRemaining,
        errors: progress.errors
      });
      onProgress(fullProgress);
    }
  }
  
  /**
   * Helper: Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Factory function to create prompt engine
 */
export function createPromptEngine(): PromptEngine {
  return new PromptEngine();
}

/**
 * Export types for external use
 */
export type {
  SiteStructure,
  ContextExtraction,
  GenerationProgress,
  GenerationRequest,
  GenerationResponse,
  ValidationResult
};