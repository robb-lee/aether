/**
 * Model Router
 * 
 * Intelligent routing logic for task-based model selection
 * Optimizes for quality, speed, and cost based on task requirements
 */

import { modelRouting, costPerModel } from '../config';
import { ContextExtraction } from '../schemas/site-structure';

/**
 * Task type definitions
 */
export type TaskType = keyof typeof modelRouting.tasks;

export interface ModelSelection {
  primary: string;
  fallbacks: string[];
  reasoning: string;
  estimatedCost: number;
  estimatedTime: number; // seconds
  priority: 'quality' | 'speed' | 'cost';
}

/**
 * Model capabilities and characteristics
 */
const modelCapabilities = {
  'claude-4-sonnet': {
    strengths: ['advanced reasoning', 'code generation', 'structured output', 'JSON', 'multimodal'],
    weaknesses: ['expensive'],
    speed: 4,
    quality: 5,
    cost: 5
  },
  'claude-4-sonnet-mini': {
    strengths: ['fast', 'efficient', 'good reasoning', 'cost-effective'],
    weaknesses: ['less capable than GPT-5'],
    speed: 5,
    quality: 4,
    cost: 2
  },
  'claude-4-sonnet': {
    strengths: ['excellent reasoning', 'natural language', 'creative writing', 'analysis'],
    weaknesses: ['moderate cost'],
    speed: 4,
    quality: 5,
    cost: 3
  },
  'claude-3-opus': {
    strengths: ['natural language', 'creative writing', 'nuanced content'],
    weaknesses: ['expensive', 'older generation'],
    speed: 3,
    quality: 4,
    cost: 4
  },
  'gpt-3.5-turbo': {
    strengths: ['fast', 'cheap', 'reliable'],
    weaknesses: ['less capable for complex tasks'],
    speed: 5,
    quality: 3,
    cost: 1
  },
  'claude-4-sonnet': {
    strengths: ['highest quality images', 'precise prompt following', 'style consistency'],
    weaknesses: ['expensive'],
    speed: 3,
    quality: 5,
    cost: 5
  },
  'claude-4-sonnet': {
    strengths: ['high quality images', 'accurate to prompts'],
    weaknesses: ['expensive', 'older generation'],
    speed: 2,
    quality: 4,
    cost: 4
  }
};

/**
 * Route to optimal model based on task
 */
export function routeToModel(
  task: TaskType,
  context?: ContextExtraction,
  options?: {
    priority?: 'quality' | 'speed' | 'cost';
    maxCost?: number;
    maxTime?: number;
  }
): ModelSelection {
  const priority = options?.priority || 'quality';
  const baseModel = modelRouting.tasks[task];
  
  // Adjust model based on priority
  let selectedModel = baseModel;
  let reasoning = `Default model for ${task} task`;
  
  if (priority === 'speed') {
    selectedModel = selectFastModel(task);
    reasoning = 'Optimized for speed';
  } else if (priority === 'cost') {
    selectedModel = selectCheapModel(task);
    reasoning = 'Optimized for cost';
  } else if (priority === 'quality') {
    selectedModel = selectQualityModel(task);
    reasoning = 'Optimized for quality';
  }
  
  // Adjust based on context
  if (context) {
    const contextAdjustment = adjustForContext(selectedModel, context);
    if (contextAdjustment.model !== selectedModel) {
      selectedModel = contextAdjustment.model;
      reasoning = contextAdjustment.reasoning;
    }
  }
  
  // Get fallback chain
  const fallbacks = modelRouting.fallbackChains[selectedModel] || [];
  
  // Estimate cost and time
  const { estimatedCost, estimatedTime } = estimateResources(selectedModel, task);
  
  return {
    primary: selectedModel,
    fallbacks,
    reasoning,
    estimatedCost,
    estimatedTime,
    priority
  };
}

/**
 * Select fastest model for task
 */
function selectFastModel(task: TaskType): string {
  const fastModels: Record<TaskType, string> = {
    structure: 'claude-4-sonnet-mini',
    content: 'claude-4-sonnet',
    seo: 'claude-4-sonnet',
    code: 'claude-4-sonnet-mini',
    images: 'claude-4-sonnet',
    analysis: 'claude-4-sonnet',
    simple: 'claude-4-sonnet-mini'
  };
  
  return fastModels[task] || 'claude-4-sonnet-mini';
}

/**
 * Select cheapest model for task
 */
function selectCheapModel(task: TaskType): string {
  const cheapModels: Record<TaskType, string> = {
    structure: 'claude-4-sonnet-mini',
    content: 'claude-4-sonnet',
    seo: 'claude-4-sonnet',
    code: 'claude-4-sonnet-mini',
    images: 'claude-4-sonnet',
    analysis: 'claude-4-sonnet',
    simple: 'claude-4-sonnet-mini'
  };
  
  return cheapModels[task] || 'claude-4-sonnet';
}

/**
 * Select highest quality model for task
 */
function selectQualityModel(task: TaskType): string {
  const qualityModels: Record<TaskType, string> = {
    structure: 'claude-4-sonnet',
    content: 'claude-4-sonnet',
    seo: 'claude-4-sonnet',
    code: 'claude-4-sonnet',
    images: 'claude-4-sonnet',
    analysis: 'claude-4-sonnet',
    simple: 'claude-4-sonnet'
  };
  
  return qualityModels[task] || 'claude-4-sonnet';
}

/**
 * Adjust model selection based on context
 */
function adjustForContext(
  model: string,
  context: ContextExtraction
): { model: string; reasoning: string } {
  // Complex industries need better models
  const complexIndustries = ['finance', 'healthcare', 'legal', 'technical'];
  if (complexIndustries.includes(context.industry)) {
    const capabilities = modelCapabilities[model as keyof typeof modelCapabilities];
    if (capabilities && capabilities.quality < 4) {
      return {
        model: 'claude-4-sonnet',
        reasoning: `Complex ${context.industry} industry requires higher quality model`
      };
    }
  }
  
  // Creative content benefits from Claude
  const creativeIndustries = ['portfolio', 'blog', 'media', 'creative'];
  if (creativeIndustries.includes(context.industry) && model.includes('gpt')) {
    return {
      model: 'claude-4-sonnet',
      reasoning: 'Creative content benefits from Claude\'s natural language capabilities'
    };
  }
  
  // E-commerce needs structured data
  if (context.industry === 'ecommerce' && !model.includes('claude-4-sonnet')) {
    return {
      model: 'claude-4-sonnet',
      reasoning: 'E-commerce requires structured product data generation'
    };
  }
  
  return { model, reasoning: 'No context adjustment needed' };
}

/**
 * Estimate resource usage
 */
function estimateResources(
  model: string,
  task: TaskType
): { estimatedCost: number; estimatedTime: number } {
  // Base token estimates per task
  const tokenEstimates: Record<TaskType, { input: number; output: number }> = {
    structure: { input: 500, output: 2000 },
    content: { input: 1000, output: 3000 },
    seo: { input: 500, output: 1000 },
    code: { input: 800, output: 2500 },
    images: { input: 100, output: 0 }, // Images don't have output tokens
    analysis: { input: 1500, output: 2000 },
    simple: { input: 200, output: 500 }
  };
  
  const tokens = tokenEstimates[task] || { input: 500, output: 1000 };
  const costs = costPerModel[model as keyof typeof costPerModel];
  
  let estimatedCost = 0;
  if (costs) {
    if ('input' in costs && 'output' in costs) {
      estimatedCost = (tokens.input / 1000) * costs.input + 
                     (tokens.output / 1000) * costs.output;
    } else if ('image' in costs) {
      estimatedCost = costs.image;
    }
  }
  
  // Time estimates based on model speed
  const capabilities = modelCapabilities[model as keyof typeof modelCapabilities];
  const baseTime = {
    structure: 5,
    content: 10,
    seo: 3,
    code: 7,
    images: 8,
    analysis: 6,
    simple: 2
  };
  
  const timeMultiplier = capabilities ? (6 - capabilities.speed) / 2 : 1;
  const estimatedTime = baseTime[task] * timeMultiplier;
  
  return { estimatedCost, estimatedTime };
}

/**
 * Get optimal model chain for complete generation
 */
export function getOptimalChain(
  context: ContextExtraction,
  priority: 'quality' | 'speed' | 'cost' = 'quality'
): Record<string, ModelSelection> {
  const stages = {
    contextAnalysis: routeToModel('analysis', context, { priority }),
    structureGeneration: routeToModel('structure', context, { priority }),
    contentGeneration: routeToModel('content', context, { priority }),
    seoOptimization: routeToModel('seo', context, { priority }),
    designSystem: routeToModel('simple', context, { priority })
  };
  
  return stages;
}

/**
 * Calculate total estimated cost and time
 */
export function calculateTotalResources(
  chain: Record<string, ModelSelection>
): { totalCost: number; totalTime: number } {
  let totalCost = 0;
  let totalTime = 0;
  
  Object.values(chain).forEach(selection => {
    totalCost += selection.estimatedCost;
    totalTime += selection.estimatedTime;
  });
  
  return { totalCost, totalTime };
}

/**
 * Dynamic model selection based on remaining budget
 */
export function selectModelWithinBudget(
  task: TaskType,
  remainingBudget: number,
  remainingTime: number
): string {
  const models = [
    'claude-4-sonnet',
    'claude-4-sonnet',
    'claude-4-sonnet-mini',
    'claude-4-sonnet'
  ];
  
  for (const model of models) {
    const { estimatedCost, estimatedTime } = estimateResources(model, task);
    if (estimatedCost <= remainingBudget && estimatedTime <= remainingTime) {
      return model;
    }
  }
  
  // Fallback to cheapest model if budget is very tight
  return 'claude-4-sonnet';
}

/**
 * Monitor and adjust routing based on performance
 */
export class AdaptiveRouter {
  private performanceHistory: Map<string, {
    avgTime: number;
    avgCost: number;
    successRate: number;
    samples: number;
  }> = new Map();
  
  /**
   * Record performance metrics
   */
  recordPerformance(
    model: string,
    task: TaskType,
    time: number,
    cost: number,
    success: boolean
  ): void {
    const key = `${model}:${task}`;
    const current = this.performanceHistory.get(key) || {
      avgTime: 0,
      avgCost: 0,
      successRate: 0,
      samples: 0
    };
    
    const samples = current.samples + 1;
    current.avgTime = (current.avgTime * current.samples + time) / samples;
    current.avgCost = (current.avgCost * current.samples + cost) / samples;
    current.successRate = (current.successRate * current.samples + (success ? 1 : 0)) / samples;
    current.samples = samples;
    
    this.performanceHistory.set(key, current);
  }
  
  /**
   * Get optimal model based on historical performance
   */
  getOptimalModel(task: TaskType, priority: 'quality' | 'speed' | 'cost'): string {
    const candidates: Array<{ model: string; score: number }> = [];
    
    for (const model of Object.keys(modelCapabilities)) {
      const key = `${model}:${task}`;
      const history = this.performanceHistory.get(key);
      
      if (history && history.samples >= 5) {
        let score = 0;
        
        if (priority === 'speed') {
          score = 100 / history.avgTime;
        } else if (priority === 'cost') {
          score = 1 / history.avgCost;
        } else {
          score = history.successRate;
        }
        
        candidates.push({ model, score });
      }
    }
    
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0].model;
    }
    
    // Fallback to default routing
    return modelRouting.tasks[task];
  }
}