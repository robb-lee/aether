/**
 * Streaming Response Handler for Real-Time UI Updates
 * 
 * Handles streaming responses from different AI models through LiteLLM
 * Provides real-time parsing and validation for progressive UI updates
 */

import { EventEmitter } from 'events';
import { z } from 'zod';
import { parseAIResponse, type RawAIResponse, type ParsedResponse } from './response-parser';
import { SiteStructureSchema, GenerationProgressSchema } from '../schemas/site-structure';

/**
 * Stream chunk with metadata
 */
export interface StreamChunk {
  content: string;
  model: string;
  tokenCount: number;
  timestamp: number;
  chunkIndex: number;
}

/**
 * Stream progress events
 */
export interface StreamProgress {
  stage: 'initializing' | 'streaming' | 'parsing' | 'validating' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  partialData?: any;
  estimatedTimeRemaining?: number;
  model?: string;
}

/**
 * Stream handler options
 */
interface StreamHandlerOptions {
  bufferSize?: number;
  validationInterval?: number; // milliseconds
  enablePartialParsing?: boolean;
  maxRetries?: number;
  timeout?: number; // milliseconds
}

/**
 * Real-time streaming response handler
 */
export class StreamingResponseHandler extends EventEmitter {
  private buffer = '';
  private chunks: StreamChunk[] = [];
  private startTime = Date.now();
  private lastValidation = 0;
  private partialResult: any = null;
  private currentModel = '';
  private totalTokens = 0;
  
  constructor(private options: StreamHandlerOptions = {}) {
    super();
    
    // Set defaults
    this.options = {
      bufferSize: 1024,
      validationInterval: 500,
      enablePartialParsing: true,
      maxRetries: 3,
      timeout: 30000,
      ...options
    };
    
    // Set timeout
    if (this.options.timeout) {
      setTimeout(() => {
        if (!this.isComplete()) {
          this.emit('error', new Error('Stream timeout'));
        }
      }, this.options.timeout);
    }
  }
  
  /**
   * Process incoming stream chunk
   */
  async processChunk(chunk: StreamChunk): Promise<void> {
    this.chunks.push(chunk);
    this.buffer += chunk.content;
    this.currentModel = chunk.model;
    this.totalTokens = chunk.tokenCount;
    
    // Emit raw chunk
    this.emit('chunk', chunk);
    
    // Update progress
    this.emitProgress('streaming', this.getProgressPercentage(), 'Receiving content...');
    
    // Try partial parsing if enabled and enough time has passed
    if (this.options.enablePartialParsing && 
        Date.now() - this.lastValidation > this.options.validationInterval!) {
      await this.attemptPartialParsing();
    }
  }
  
  /**
   * Complete the stream and perform final parsing
   */
  async complete(): Promise<ParsedResponse> {
    this.emitProgress('parsing', 90, 'Parsing final response...');
    
    try {
      const rawResponse: RawAIResponse = {
        content: this.buffer,
        model: this.currentModel,
        usage: {
          prompt_tokens: 0, // Will be updated by actual response
          completion_tokens: this.totalTokens,
          total_tokens: this.totalTokens
        },
        metadata: {
          streamDuration: Date.now() - this.startTime,
          chunkCount: this.chunks.length
        }
      };
      
      this.emitProgress('validating', 95, 'Validating structure...');
      
      // Parse with site structure schema by default
      const result = await parseAIResponse(rawResponse, SiteStructureSchema, {
        autoFix: true,
        strictValidation: false,
        extractCost: true
      });
      
      this.emitProgress('complete', 100, 'Generation complete!');
      this.emit('complete', result);
      
      return result;
      
    } catch (error) {
      this.emitProgress('error', 0, `Parsing failed: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Handle stream error with recovery
   */
  handleError(error: any, model: string): void {
    this.emitProgress('error', 0, `Stream error from ${model}: ${error.message}`);
    this.emit('error', error);
  }
  
  /**
   * Attempt to parse partial buffer content
   */
  private async attemptPartialParsing(): Promise<void> {
    this.lastValidation = Date.now();
    
    if (this.buffer.length < 100) return; // Too small to parse
    
    try {
      // Look for complete JSON objects in buffer
      const jsonMatches = this.buffer.match(/\{[^{}]*\}/g);
      if (!jsonMatches) return;
      
      // Try to parse the most complete-looking JSON
      const lastMatch = jsonMatches[jsonMatches.length - 1];
      const parsed = JSON.parse(lastMatch);
      
      if (parsed && typeof parsed === 'object') {
        this.partialResult = parsed;
        this.emit('partial', {
          data: parsed,
          confidence: this.getParsingConfidence(parsed),
          progress: this.getProgressPercentage()
        });
      }
    } catch (error) {
      // Partial parsing failed, continue streaming
    }
  }
  
  /**
   * Calculate parsing confidence based on data completeness
   */
  private getParsingConfidence(data: any): number {
    if (!data || typeof data !== 'object') return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Basic structure checks
    if (data.id) score += 10;
    if (data.name) score += 10;
    if (data.pages) score += 20;
    if (data.globalStyles) score += 15;
    if (data.navigation) score += 15;
    if (data.metadata) score += 10;
    
    // Content completeness
    if (data.pages && Array.isArray(data.pages)) {
      const pagesWithContent = data.pages.filter(p => p.components || p.content);
      score += (pagesWithContent.length / data.pages.length) * 20;
    }
    
    return Math.min(score, maxScore);
  }
  
  /**
   * Calculate progress percentage
   */
  private getProgressPercentage(): number {
    const elapsed = Date.now() - this.startTime;
    const estimated = 20000; // 20 seconds estimated generation time
    return Math.min((elapsed / estimated) * 80, 80); // Cap at 80% until completion
  }
  
  /**
   * Emit progress update
   */
  private emitProgress(stage: StreamProgress['stage'], progress: number, message: string): void {
    const progressData: StreamProgress = {
      stage,
      progress,
      message,
      partialData: this.partialResult,
      estimatedTimeRemaining: this.getEstimatedTimeRemaining(),
      model: this.currentModel
    };
    
    this.emit('progress', progressData);
  }
  
  /**
   * Estimate remaining time based on current progress
   */
  private getEstimatedTimeRemaining(): number {
    const elapsed = Date.now() - this.startTime;
    const progress = this.getProgressPercentage();
    
    if (progress <= 0) return 30; // Default estimate
    
    const totalEstimated = (elapsed / progress) * 100;
    return Math.max(0, (totalEstimated - elapsed) / 1000); // seconds
  }
  
  /**
   * Check if stream is complete
   */
  private isComplete(): boolean {
    return this.chunks.length > 0 && this.chunks[this.chunks.length - 1].content === '';
  }
  
  /**
   * Get current buffer content
   */
  getBuffer(): string {
    return this.buffer;
  }
  
  /**
   * Get streaming statistics
   */
  getStats() {
    return {
      chunks: this.chunks.length,
      tokens: this.totalTokens,
      duration: Date.now() - this.startTime,
      bufferSize: this.buffer.length,
      model: this.currentModel,
      hasPartialResult: !!this.partialResult
    };
  }
  
  /**
   * Reset handler for reuse
   */
  reset(): void {
    this.buffer = '';
    this.chunks = [];
    this.startTime = Date.now();
    this.lastValidation = 0;
    this.partialResult = null;
    this.currentModel = '';
    this.totalTokens = 0;
    this.removeAllListeners();
  }
}

/**
 * Convenience function for handling streaming responses
 */
export async function handleStreamingResponse<T = any>(
  streamGenerator: AsyncGenerator<StreamChunk>,
  schema: z.ZodSchema<T>,
  onProgress?: (progress: StreamProgress) => void,
  onPartial?: (data: any) => void,
  options?: StreamHandlerOptions
): Promise<ParsedResponse<T>> {
  const handler = new StreamingResponseHandler(options);
  
  // Set up event listeners
  if (onProgress) {
    handler.on('progress', onProgress);
  }
  
  if (onPartial) {
    handler.on('partial', (data) => onPartial(data.data));
  }
  
  // Process all chunks
  try {
    for await (const chunk of streamGenerator) {
      await handler.processChunk(chunk);
    }
    
    return await handler.complete();
    
  } catch (error) {
    handler.handleError(error, handler.getStats().model);
    throw error;
  }
}

/**
 * Create streaming site generator with real-time updates
 */
export async function* streamSiteGeneration(
  prompt: string,
  onProgress?: (progress: StreamProgress) => void
): AsyncGenerator<StreamProgress | ParsedResponse> {
  const handler = new StreamingResponseHandler({
    enablePartialParsing: true,
    validationInterval: 1000
  });
  
  const progressUpdates: (StreamProgress | ParsedResponse)[] = [];
  
  // Set up progress listener
  handler.on('progress', (progress: StreamProgress) => {
    progressUpdates.push(progress);
    if (onProgress) onProgress(progress);
  });
  
  // Set up partial data listener
  handler.on('partial', (data) => {
    const update: StreamProgress = {
      stage: 'streaming',
      progress: data.progress || 50,
      message: 'Processing partial data...',
      partialData: data.data
    };
    progressUpdates.push(update);
    if (onProgress) onProgress(update);
  });
  
  try {
    // Initialize
    const initProgress: StreamProgress = {
      stage: 'initializing',
      progress: 5,
      message: 'Starting generation...'
    };
    progressUpdates.push(initProgress);
    yield initProgress;
    
    // Yield any accumulated progress
    for (const update of progressUpdates) {
      yield update;
    }
    
    // The actual implementation would connect to streamCompletion from litellm-client
    // and process real chunks here
    
  } catch (error) {
    handler.handleError(error, 'unknown');
    throw error;
  }
}

/**
 * Export types for external use
 */
export type { StreamHandlerOptions };