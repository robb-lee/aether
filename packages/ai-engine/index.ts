/**
 * AI Engine Package
 * 
 * Unified interface for AI operations through LiteLLM
 */

// Export main client functions
export {
  generateCompletion,
  generateImage,
  streamCompletion,
  checkHealth,
  listModels,
  getModelCapabilities,
  litellm,
  type CompletionResponse,
  type ImageResponse,
  type StreamChunk,
  type HealthStatus,
} from './lib/litellm-client';

// Export error types
export {
  AIEngineError,
  ModelError,
  RateLimitError,
  ValidationError,
  QuotaExceededError,
  NetworkError,
  isRetryableError,
  getRetryDelay,
} from './lib/errors';

// Export configuration
export {
  config,
  modelRouting,
  modelSettings,
  costPerModel,
  retryConfig,
  loggingConfig,
  healthCheckConfig,
} from './config';

// Export prompt engine and generators
export {
  PromptEngine,
  createPromptEngine,
  type GenerationOptions,
  type GenerationRequest,
  type GenerationResponse,
  type GenerationProgress,
} from './generators/prompt-engine';

// Export prompt templates and system prompts
export {
  systemPrompts,
  stagePrompts,
  industryEnhancements,
  recoveryPrompts,
  getSystemPrompt,
  enhanceWithIndustry,
  createPromptChain,
  createContextTemplate,
} from './prompts/system';

export {
  templates,
  getTemplate,
  getTemplateSections,
  getTemplatePrompt,
  mergeWithTemplate,
  type SiteTemplate,
  type SectionTemplate,
  type ComponentTemplate,
  type ContentTemplate,
  type StylePreset,
} from './prompts/templates';

// Export enhancer utilities
export {
  extractContext,
  enhancePrompt,
  enhanceForTask,
  optimizePrompt,
  addExamples,
} from './lib/enhancer';

// Export model router
export {
  routeToModel,
  getOptimalChain,
  calculateTotalResources,
  selectModelWithinBudget,
  AdaptiveRouter,
  type TaskType,
  type ModelSelection,
} from './lib/model-router';

// Export schemas and validation
export {
  // Schemas
  ComponentNodeSchema,
  ComponentTreeSchema,
  ContextExtractionSchema,
  SEOMetadataSchema,
  PageStructureSchema,
  SiteStructureSchema,
  GenerationProgressSchema,
  ValidationResultSchema,
  GenerationRequestSchema,
  GenerationResponseSchema,
  // Types
  type ComponentNode,
  type ComponentTree,
  type ContextExtraction,
  type SEOMetadata,
  type PageStructure,
  type SiteStructure,
  type ValidationResult,
  // Validation functions
  validateSiteStructure,
  validateComponentTree,
  validateGenerationRequest,
  isValidSiteStructure,
  safeParseSiteStructure,
} from './schemas/site-structure';

// Export parsers and handlers
export {
  parseAIResponse,
  parseSiteStructure,
  parseComponentTree,
  parseContextExtraction,
  parseUniversalResponse,
  type RawAIResponse,
  type ParsedResponse,
} from './parsers/response-parser';

export {
  StreamingResponseHandler,
  handleStreamingResponse,
  streamSiteGeneration,
  type StreamChunk as ParserStreamChunk,
  type StreamProgress,
  type StreamHandlerOptions,
} from './parsers/stream-handler';

// Export validators
export {
  validateAIResponse,
  validateSiteStructure as validateSiteStructureAdvanced,
  validateComponentTree as validateComponentTreeAdvanced,
  validateComponent,
  validateSEO,
  validateBatch,
  CustomValidator,
  CUSTOM_RULES,
  quickValidate,
  type ValidationIssue,
} from './lib/validators';

// Export normalizers
export {
  normalizeResponse,
  normalizeModelDifferences,
  smartNormalize,
  batchNormalize,
  normalizeAndValidate,
  detectResponseType,
  extractModelContent,
} from './lib/normalizer';