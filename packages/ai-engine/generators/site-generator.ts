/**
 * AI Site Generator using LiteLLM with Component Registry Integration
 * 
 * NEW: Component selection mode - 90% token reduction
 * Legacy: Direct generation mode - kept as fallback
 */

import { generateCompletion, streamCompletion, generateImage, type StreamChunk } from '../lib/litellm-client';
import { parseSiteStructure, parseComponentTree } from '../parsers/response-parser';
import { StreamingResponseHandler, handleStreamingResponse, type StreamChunk as HandlerStreamChunk } from '../parsers/stream-handler';
import { normalizeModelDifferences } from '../lib/normalizer';
import { validateSiteStructure } from '../lib/validators';
import { SiteStructureSchema } from '../schemas/site-structure';
import { 
  ComponentSelector, 
  getComponentSelector, 
  SelectionContext,
  ComponentSelection 
} from '../selectors/component-selector';
import { 
  createSelectionPrompt, 
  generateContextualPrompt,
  createHierarchicalSelectionPrompt,
  createPerformanceOptimizedPrompt,
  COMPONENT_SELECTION_SYSTEM_PROMPT 
} from '../prompts/selection-prompts';
import { 
  buildComponentTree, 
  convertTreeToReact,
  defaultTreeBuilder 
} from '../builders/component-tree';
import { ComponentTree, TreeBuildOptions } from '../types/components';

/**
 * NEW: Generate site using Component Registry (90% token reduction)
 */
export async function generateSiteWithRegistry(
  prompt: string, 
  context: SelectionContext,
  options: {
    streaming?: boolean;
    onProgress?: (progress: any) => void;
    model?: string;
  } = {}
): Promise<any> {
  const { streaming = false, onProgress, model } = options;
  const selector = getComponentSelector();
  
  try {
    // Generate selection prompt with context
    const availableComponents = await selector.getAvailableComponents();
    const { prompt: selectionPrompt, estimatedTokens } = generateContextualPrompt(
      prompt, 
      context, 
      availableComponents
    );

    console.log(`🎯 Token estimate: ${estimatedTokens} (vs ~20,000 for direct generation)`);
    
    const messages = [
      { role: 'system', content: COMPONENT_SELECTION_SYSTEM_PROMPT },
      { role: 'user', content: selectionPrompt }
    ];

    // Track token usage
    const startTime = Date.now();
    
    if (streaming) {
      return await generateSelectionWithStreaming(messages, onProgress, model, selector);
    } else {
      return await generateSelectionWithParsing(messages, model, selector, startTime);
    }
  } catch (error) {
    console.error('❌ Registry-based generation failed, falling back to direct generation:', error);
    
    // Fallback to legacy generation
    return await generateSiteStructureLegacy(prompt, options);
  }
}

/**
 * ENHANCED: Generate site with hierarchical component tree building
 */
export async function generateSiteWithTreeBuilder(
  prompt: string,
  context: SelectionContext,
  options: {
    streaming?: boolean;
    onProgress?: (progress: any) => void;
    model?: string;
    treeOptions?: TreeBuildOptions;
    performanceTarget?: 'lighthouse90' | 'lighthouse95' | 'fastest';
  } = {}
): Promise<{
  tree: ComponentTree;
  reactTree: any;
  metadata: {
    generationTime: number;
    tokenUsage: number;
    modelUsed: string;
    componentCount: number;
  };
}> {
  const { streaming = false, onProgress, model, treeOptions = {}, performanceTarget } = options;
  const selector = getComponentSelector();
  const startTime = Date.now();

  try {
    // Generate appropriate prompt based on performance target
    let selectionPrompt: string;
    let estimatedTokens: number;

    if (performanceTarget) {
      selectionPrompt = createPerformanceOptimizedPrompt(prompt, context, performanceTarget);
      estimatedTokens = Math.ceil(selectionPrompt.length / 4);
    } else {
      const availableComponents = await selector.getAvailableComponents();
      const promptResult = generateContextualPrompt(prompt, context, availableComponents);
      selectionPrompt = promptResult.prompt;
      estimatedTokens = promptResult.estimatedTokens;
    }

    console.log(`🎯 Enhanced prompt - Token estimate: ${estimatedTokens}`);
    
    if (onProgress) {
      onProgress({ 
        phase: 'prompt_generation', 
        message: 'Generated optimized selection prompt',
        tokenEstimate: estimatedTokens 
      });
    }

    const messages = [
      { role: 'system', content: COMPONENT_SELECTION_SYSTEM_PROMPT },
      { role: 'user', content: selectionPrompt }
    ];

    // Generate AI selections
    if (onProgress) {
      onProgress({ 
        phase: 'ai_selection', 
        message: 'Getting component selections from AI' 
      });
    }

    const aiResponse = await generateCompletion({
      messages,
      model: model, // Let generateCompletion handle model selection based on config
    });

    // Parse AI selections
    const selections = await selector.parseSelectionResponse(aiResponse.response.choices[0].message.content || '');
    
    if (onProgress) {
      onProgress({ 
        phase: 'tree_building', 
        message: `Building component tree from ${selections.selections.length} selections` 
      });
    }

    // Build component tree
    const treeResult = await buildComponentTree(selections, prompt, {
      generateIds: true,
      validateStructure: true,
      applyLayoutHints: true,
      includeResponsive: true,
      ...treeOptions
    });

    if (treeResult.warnings.length > 0) {
      console.warn('⚠️ Tree building warnings:', treeResult.warnings);
    }

    if (onProgress) {
      onProgress({ 
        phase: 'react_conversion', 
        message: 'Converting tree to React format' 
      });
    }

    // Convert to React-renderable format
    const reactTree = await convertTreeToReact(treeResult.tree);

    const generationTime = Date.now() - startTime;

    if (onProgress) {
      onProgress({ 
        phase: 'complete', 
        message: `Site generated successfully in ${generationTime}ms`,
        stats: treeResult.stats
      });
    }

    return {
      tree: treeResult.tree,
      reactTree,
      metadata: {
        generationTime,
        tokenUsage: aiResponse.response.usage?.total_tokens || estimatedTokens,
        modelUsed: aiResponse.model || model || 'unknown',
        componentCount: treeResult.stats.nodesCreated
      }
    };

  } catch (error) {
    console.error('❌ Enhanced generation failed:', error);
    
    if (onProgress) {
      onProgress({ 
        phase: 'error', 
        message: 'Enhanced generation failed, falling back to registry mode' 
      });
    }

    // Fallback to basic registry generation
    return await generateSiteWithRegistry(prompt, context, options);
  }
}

/**
 * LEGACY: Generate complete website structure (kept as fallback)
 */
export async function generateSiteStructureLegacy(prompt: string, options: {
  streaming?: boolean;
  onProgress?: (progress: any) => void;
  model?: string;
} = {}) {
  console.log('⚠️ Using legacy generation mode (high token usage)');
  
  const { streaming = false, onProgress, model } = options;
  const systemPrompt = `You are an expert web designer and developer.
Generate a complete website structure optimized for conversion.

Output format: Valid JSON with this exact structure:
{
  "id": "unique_site_id",
  "name": "Site Name",
  "pages": [
    {
      "id": "page_id",
      "name": "Page Name",
      "path": "/",
      "components": {
        "root": {
          "id": "root",
          "type": "page",
          "props": {},
          "children": [
            {
              "id": "hero_1",
              "type": "hero",
              "props": {},
              "content": { "text": "Hero text" },
              "styles": { "className": "hero-styles" }
            }
          ]
        },
        "version": "1.0.0",
        "metadata": {
          "generatedAt": "${new Date().toISOString()}",
          "model": "current_model"
        }
      },
      "seo": {
        "title": "Page Title",
        "description": "Page description",
        "keywords": []
      }
    }
  ],
  "globalStyles": {
    "colors": { "primary": "#3b82f6", "secondary": "#8b5cf6", "background": "#ffffff", "text": "#1f2937" },
    "typography": { "headingFont": "Inter", "bodyFont": "Inter" },
    "spacing": { "base": "1rem" },
    "borderRadius": "0.5rem",
    "shadows": "medium"
  },
  "navigation": {
    "main": [{ "label": "Home", "path": "/" }],
    "footer": []
  },
  "metadata": {
    "createdAt": "${new Date().toISOString()}",
    "updatedAt": "${new Date().toISOString()}",
    "version": "1.0.0"
  }
}

Important: Return ONLY valid JSON, no explanations or markdown.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  try {
    if (streaming) {
      return await generateWithStreaming(messages, onProgress, model);
    } else {
      return await generateWithParsing(messages, model);
    }
  } catch (error) {
    console.error('❌ Site generation failed:', error);
    throw error;
  }
}

/**
 * Generate component selection with streaming
 */
async function generateSelectionWithStreaming(
  messages: any[],
  onProgress?: (progress: any) => void,
  model?: string,
  selector?: ComponentSelector
): Promise<any> {
  const chunks: string[] = [];
  let totalTokens = 0;
  
  onProgress?.({ stage: 'selection_starting', mode: 'registry' });
  
  for await (const chunk of streamCompletion({
    messages,
    model,
    task: 'component_selection',
    onToken: (token) => {
      chunks.push(token);
      totalTokens++;
      
      // Show real-time token savings
      if (totalTokens % 100 === 0) {
        const savings = selector?.estimateTokenSavings(2) || { savingsPercent: 90 };
        onProgress?.({ 
          stage: 'selecting', 
          tokensUsed: totalTokens,
          estimatedSavings: savings.savingsPercent
        });
      }
    },
    onStart: (usedModel) => {
      console.log(`🎯 Starting component selection with ${usedModel}`);
      onProgress?.({ stage: 'ai_selecting', model: usedModel });
    },
    onComplete: (fullText, usedModel, cost) => {
      console.log(`✅ Selection complete with ${usedModel}`);
      console.log(`💰 Cost: $${cost.toFixed(4)} (vs ~$0.40 for legacy)`);
      onProgress?.({ stage: 'selection_complete', model: usedModel, cost, totalTokens });
    }
  })) {
    // Process chunks as they arrive
  }
  
  const fullResponse = chunks.join('');
  
  // Parse selection response
  const selection = await selector!.parseSelectionResponse(fullResponse);
  console.log(`📦 Selected ${selection.selections.length} components`);
  
  return selection;
}

/**
 * Generate component selection with parsing
 */
async function generateSelectionWithParsing(
  messages: any[], 
  model?: string, 
  selector?: ComponentSelector,
  startTime?: number
): Promise<any> {
  // Generate selection
  const result = await generateCompletion({
    messages,
    model,
    task: 'component_selection',
    stream: false
  });

  const endTime = Date.now();
  const duration = startTime ? endTime - startTime : 0;
  
  console.log(`✅ Selection generated with ${result.model} in ${duration}ms`);
  console.log(`💰 Cost: $${result.cost.toFixed(4)} (vs ~$0.40 for legacy generation)`);
  console.log(`🎯 Token usage: ${result.response.usage?.total_tokens || 'unknown'}`);
  
  if (result.fallback) {
    console.log('⚠️ Used fallback model due to primary model failure');
  }

  const rawResponse = result.response.choices[0].message.content || '';
  
  // Parse selection response
  const selection = await selector!.parseSelectionResponse(rawResponse);
  
  // Validate selection
  const componentIds = selection.selections.map(s => s.componentId);
  const validation = await selector!.validateSelection(componentIds);
  
  if (!validation.valid) {
    console.warn('⚠️ Component selection issues:', validation.issues);
  }
  
  console.log(`💾 Estimated token savings: ${validation.estimatedTokenSavings} tokens (${validation.estimatedTokenSavings > 0 ? ((validation.estimatedTokenSavings / 20000) * 100).toFixed(1) : 0}%)`);
  
  return {
    selection,
    validation,
    metadata: {
      model: result.model,
      cost: result.cost,
      tokensUsed: result.response.usage?.total_tokens,
      duration,
      fallback: result.fallback,
      estimatedSavings: validation.estimatedTokenSavings
    }
  };
}

/**
 * Backward compatibility alias (uses registry by default)
 */
export const generateSiteStructure = generateSiteWithRegistry;

/**
 * Generate with streaming and real-time parsing
 */
async function generateWithStreaming(
  messages: any[],
  onProgress?: (progress: any) => void,
  model?: string
) {
  const handler = new StreamingResponseHandler({
    enablePartialParsing: true,
    validationInterval: 1000
  });
  
  // Set up progress tracking
  if (onProgress) {
    handler.on('progress', onProgress);
    handler.on('partial', (data) => {
      onProgress({
        stage: 'streaming',
        partialData: data.data,
        confidence: data.confidence
      });
    });
  }
  
  let chunks: StreamChunk[] = [];
  
  // Stream completion
  for await (const chunk of streamCompletion({
    messages,
    model,
    task: 'structure',
    onToken: (token) => {
      // Real-time token processing handled by stream handler
    },
    onStart: (usedModel) => {
      console.log(`🚀 Starting generation with ${usedModel}`);
    },
    onComplete: (fullText, usedModel, cost) => {
      console.log(`✅ Generated with ${usedModel}`);
      console.log(`💰 Cost: $${cost.toFixed(4)}`);
    },
    onError: (error, usedModel) => {
      console.error(`❌ Error with ${usedModel}:`, (error as Error).message);
    }
  })) {
    chunks.push(chunk);
    await handler.processChunk({
      content: chunk.content,
      model: chunk.model,
      tokenCount: chunk.tokenCount,
      timestamp: Date.now(),
      chunkIndex: chunks.length
    } as HandlerStreamChunk);
  }
  
  // Complete parsing
  const result = await handler.complete();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(`Parsing failed: ${result.error?.message}`);
  }
}

/**
 * Generate with robust parsing and validation
 */
async function generateWithParsing(messages: any[], model?: string) {
  // Generate with primary model
  const result = await generateCompletion({
    messages,
    model,
    task: 'structure',
    stream: false
  });

  console.log(`✅ Generated with ${result.model}`);
  console.log(`💰 Cost: $${result.cost.toFixed(4)}`);
  
  if (result.fallback) {
    console.log('⚠️ Used fallback model due to primary model failure');
  }

  const rawResponse = {
    content: result.response.choices[0].message.content || '',
    model: result.model,
    usage: result.response.usage,
    cost: result.cost,
    fallback: result.fallback
  };
  
  // Parse and validate response
  const parsed = await parseSiteStructure(rawResponse);
  
  if (!parsed.success) {
    throw new Error(`Failed to parse ${result.model} response: ${parsed.error?.message}`);
  }
  
  // Additional validation
  const validation = await validateSiteStructure(parsed.data!, {
    autoFix: true,
    model: result.model
  });
  
  if (!validation.valid && validation.issues.some(i => i.type === 'error')) {
    console.warn('⚠️ Validation issues found:', validation.issues.filter(i => i.type === 'error'));
  }
  
  return validation.fixedData || parsed.data;
}

/**
 * Generate content for a specific section
 */
export async function generateSectionContent(sectionType: string, businessContext: any) {
  const messages = [
    {
      role: 'system',
      content: 'You are a professional copywriter. Generate compelling content.'
    },
    {
      role: 'user',
      content: `Generate ${sectionType} content for: ${JSON.stringify(businessContext)}`
    }
  ];

  // Use streaming for real-time feedback
  const chunks: string[] = [];
  
  for await (const chunk of streamCompletion({
    messages,
    onToken: (token) => {
      process.stdout.write(token); // Show progress
    }
  })) {
    chunks.push(chunk.content);
  }

  return chunks.join('');
}

/**
 * Generate hero image for the website
 */
export async function generateHeroImage(description: string) {
  try {
    const result = await generateImage({
      prompt: `Professional website hero image: ${description}. Modern, clean, high-quality design.`,
      size: '1792x1024', // 16:9 aspect ratio
      quality: 'hd'
    });

    console.log(`🎨 Generated ${result.images?.length || 0} image(s)`);
    console.log(`💰 Cost: $${result.cost.toFixed(2)}`);

    return result.images?.[0]?.url || '/images/placeholder-hero.jpg';
    
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    // Return placeholder image
    return '/images/placeholder-hero.jpg';
  }
}

/**
 * Example: Generate a complete SaaS landing page
 */
export async function generateSaaSLandingPage() {
  console.log('🚀 Starting SaaS landing page generation...\n');

  // 1. Generate structure
  console.log('📐 Generating site structure...');
  const structure = await generateSiteStructure(
    'Create a SaaS landing page for an AI-powered project management tool called TaskFlow',
    {}
  );

  // 2. Generate hero content
  console.log('\n📝 Generating hero content...');
  const heroContent = await generateSectionContent('hero section', {
    product: 'TaskFlow',
    tagline: 'AI-powered project management',
    target: 'startups and agencies'
  });

  // 3. Generate hero image
  console.log('\n🎨 Generating hero image...');
  const heroImage = await generateHeroImage(
    'Modern SaaS dashboard interface with AI elements, purple and blue gradient'
  );

  return {
    structure,
    heroContent,
    heroImage
  };
}

/**
 * Enhanced streaming site generation with real-time updates
 */
export async function generateSiteWithStreaming(
  prompt: string,
  onProgress: (update: any) => void
) {
  const handler = new StreamingResponseHandler({
    enablePartialParsing: true,
    validationInterval: 500
  });
  
  // Track progress through generation stages
  handler.on('progress', onProgress);
  handler.on('partial', (data) => {
    onProgress({
      stage: 'parsing',
      partialData: data.data,
      confidence: data.confidence
    });
  });
  
  const messages = [
    {
      role: 'system',
      content: `Generate a complete website structure as valid JSON. Include proper component hierarchy, styling, and SEO metadata.`
    },
    { role: 'user', content: prompt }
  ];
  
  // Stream the generation
  for await (const chunk of streamCompletion({
    messages,
    task: 'structure',
    onStart: (model) => onProgress({ stage: 'initializing', model }),
    onComplete: (fullText, model, cost) => {
      onProgress({ stage: 'completing', model, cost });
    }
  })) {
    await handler.processChunk({
      content: chunk.content,
      model: chunk.model,
      tokenCount: chunk.tokenCount,
      timestamp: Date.now(),
      chunkIndex: 0
    } as HandlerStreamChunk);
  }
  
  return await handler.complete();
}

/**
 * MAIN API: Generate site with automatic fallback
 */
export async function generateSiteComplete(
  userPrompt: string, 
  options: {
    context?: SelectionContext;
    streaming?: boolean;
    onProgress?: (progress: any) => void;
    model?: string;
    forceMode?: 'registry' | 'legacy';
  } = {}
): Promise<any> {
  const { 
    context = {}, 
    streaming = false, 
    onProgress, 
    model,
    forceMode 
  } = options;

  // Import composer here to avoid circular dependencies
  const { getSiteComposer } = await import('../composers/site-composer');
  const composer = getSiteComposer();

  // Force legacy mode if requested
  if (forceMode === 'legacy') {
    console.log('🔄 Forced legacy generation mode');
    return await generateSiteStructureLegacy(userPrompt, { streaming, onProgress, model });
  }

  try {
    console.log('🎯 Starting Registry-based generation...');
    
    // Step 1: AI component selection
    onProgress?.({ stage: 'selecting_components', mode: 'registry' });
    const selectionResult = await generateSiteWithRegistry(userPrompt, context, { streaming, onProgress, model });
    
    // Step 2: Compose site from selections
    onProgress?.({ stage: 'composing_site', selections: selectionResult.selection?.selections?.length || 0 });
    const composedSite = await composer.composeSiteFromSelections(
      userPrompt, 
      selectionResult.selection, 
      selectionResult.metadata
    );

    console.log('🎉 Registry-based generation completed successfully!');
    console.log(`📊 Performance: ${composedSite.metadata.performance.estimatedLighthouse} Lighthouse score`);
    console.log(`💾 Token savings: ${composedSite.metadata.performance.tokenSavings} tokens`);
    
    return composedSite;

  } catch (error) {
    console.error('❌ Registry generation failed:', error);
    console.log('🔄 Falling back to legacy generation...');
    
    onProgress?.({ stage: 'fallback_to_legacy', error: error instanceof Error ? error.message : 'Unknown error' });
    
    try {
      const legacyResult = await generateSiteStructureLegacy(userPrompt, { streaming, onProgress, model });
      
      // Add metadata to indicate fallback was used
      if (typeof legacyResult === 'object' && legacyResult !== null) {
        legacyResult.metadata = {
          ...legacyResult.metadata,
          generationMethod: 'legacy_fallback',
          fallbackReason: error instanceof Error ? error.message : 'Registry selection failed'
        };
      }
      
      console.log('✅ Fallback generation completed');
      return legacyResult;
      
    } catch (fallbackError) {
      console.error('❌ Both registry and legacy generation failed:', fallbackError);
      throw new Error(`All generation methods failed. Registry: ${error instanceof Error ? error.message : 'Unknown'}. Legacy: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown'}`);
    }
  }
}

/**
 * Quick helper for extracting context from prompt
 */
export function extractContextFromPrompt(prompt: string): SelectionContext {
  const lowerPrompt = prompt.toLowerCase();
  const context: SelectionContext = {};

  // Industry detection
  if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
    context.industry = 'saas';
  } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
    context.industry = 'ecommerce';
  } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
    context.industry = 'portfolio';
  } else if (lowerPrompt.includes('entertainment') || lowerPrompt.includes('media')) {
    context.industry = 'entertainment';
  }

  // Style detection
  if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean')) {
    context.style = 'minimal';
  } else if (lowerPrompt.includes('modern') || lowerPrompt.includes('contemporary')) {
    context.style = 'modern';
  } else if (lowerPrompt.includes('bold') || lowerPrompt.includes('striking')) {
    context.style = 'bold';
  }

  // Performance requirements
  if (lowerPrompt.includes('fast') || lowerPrompt.includes('performance')) {
    context.performance = 'high';
  }

  // Extract keywords
  context.keywords = prompt.split(/\s+/).filter(word => word.length > 3);

  return context;
}

// Export for use in other modules
export default {
  generateSiteStructure: generateSiteComplete, // Main API
  generateSiteComplete,
  generateSiteWithRegistry,
  generateSiteStructureLegacy,
  generateSectionContent,
  generateHeroImage,
  generateSaaSLandingPage,
  generateSiteWithStreaming,
  extractContextFromPrompt
};
