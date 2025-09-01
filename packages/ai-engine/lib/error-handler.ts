/**
 * Centralized Error Handler
 * 
 * Provides standardized error handling, logging, and recovery strategies
 * for the AI engine and application-wide error management.
 */

import {
  AIEngineError,
  ModelError,
  RateLimitError,
  NetworkError,
  ValidationError,
  QuotaExceededError,
  isRetryableError,
  getRetryDelay,
} from './errors';

export interface ErrorHandlerOptions {
  enableTelemetry?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface ErrorContext {
  operation: string;
  model?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export class ErrorHandler {
  private options: Required<ErrorHandlerOptions>;

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableTelemetry: options.enableTelemetry ?? true,
      enableRetry: options.enableRetry ?? true,
      maxRetries: options.maxRetries ?? 3,
      logLevel: options.logLevel ?? 'error',
    };
  }

  /**
   * Handle and process errors with appropriate recovery strategies
   */
  async handleError(
    error: any,
    context: ErrorContext
  ): Promise<{
    shouldRetry: boolean;
    userMessage: string;
    retryDelay?: number;
    recoveryAction?: 'retry' | 'fallback' | 'abort';
  }> {
    // Log error for monitoring
    this.logError(error, context);

    // Send telemetry if enabled
    if (this.options.enableTelemetry) {
      await this.sendTelemetry(error, context);
    }

    // Determine error type and response
    const errorAnalysis = this.analyzeError(error, context);

    return {
      shouldRetry: this.options.enableRetry && errorAnalysis.retryable,
      userMessage: errorAnalysis.userMessage,
      retryDelay: errorAnalysis.retryable ? getRetryDelay(error, 0) : undefined,
      recoveryAction: errorAnalysis.recoveryAction,
    };
  }

  /**
   * Analyze error and determine appropriate response
   */
  private analyzeError(error: any, context: ErrorContext) {
    // Known AI Engine errors
    if (error instanceof ModelError) {
      return {
        retryable: true,
        userMessage: `AI model "${error.model}" is currently unavailable. We're trying backup models.`,
        recoveryAction: 'fallback' as const,
      };
    }

    if (error instanceof RateLimitError) {
      return {
        retryable: true,
        userMessage: `We're receiving high traffic right now. Please wait ${
          error.retryAfter ? `${error.retryAfter} seconds` : 'a moment'
        } before trying again.`,
        recoveryAction: 'retry' as const,
      };
    }

    if (error instanceof QuotaExceededError) {
      return {
        retryable: false,
        userMessage: 'You\'ve reached your usage limit. Please upgrade your plan or wait for your quota to reset.',
        recoveryAction: 'abort' as const,
      };
    }

    if (error instanceof ValidationError) {
      return {
        retryable: false,
        userMessage: 'Please check your input and try again.',
        recoveryAction: 'abort' as const,
      };
    }

    if (error instanceof NetworkError) {
      return {
        retryable: true,
        userMessage: 'Connection issue detected. Please check your internet connection and try again.',
        recoveryAction: 'retry' as const,
      };
    }

    // HTTP status code errors
    const statusCode = error?.response?.status || error?.statusCode;
    if (statusCode) {
      switch (statusCode) {
        case 400:
          return {
            retryable: false,
            userMessage: 'Invalid request. Please check your input.',
            recoveryAction: 'abort' as const,
          };
        case 401:
        case 403:
          return {
            retryable: false,
            userMessage: 'Authentication error. Please refresh the page and try again.',
            recoveryAction: 'abort' as const,
          };
        case 429:
          return {
            retryable: true,
            userMessage: 'Too many requests. Please wait a moment and try again.',
            recoveryAction: 'retry' as const,
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            retryable: true,
            userMessage: 'Server temporarily unavailable. Please try again in a moment.',
            recoveryAction: 'retry' as const,
          };
      }
    }

    // Generic error analysis
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('timeout')) {
      return {
        retryable: true,
        userMessage: 'Network timeout. Please check your connection and try again.',
        recoveryAction: 'retry' as const,
      };
    }

    if (message.includes('quota') || message.includes('limit')) {
      return {
        retryable: false,
        userMessage: 'Usage limit reached. Please upgrade your plan or wait for your quota to reset.',
        recoveryAction: 'abort' as const,
      };
    }

    // Unknown error - be conservative
    return {
      retryable: isRetryableError(error),
      userMessage: 'An unexpected error occurred. Please try again.',
      recoveryAction: 'retry' as const,
    };
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: any, context: ErrorContext) {
    const logData = {
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
    };

    switch (this.options.logLevel) {
      case 'debug':
        console.debug('[ErrorHandler]', logData);
        break;
      case 'info':
        console.info('[ErrorHandler]', logData);
        break;
      case 'warn':
        console.warn('[ErrorHandler]', logData);
        break;
      case 'error':
      default:
        console.error('[ErrorHandler]', logData);
        break;
    }
  }

  /**
   * Send error telemetry for monitoring
   */
  private async sendTelemetry(error: any, context: ErrorContext) {
    try {
      // In production, this would send to monitoring service
      // For now, just enhanced logging
      const telemetryData = {
        errorType: error.constructor.name,
        errorCode: error.code,
        operation: context.operation,
        model: context.model,
        userId: context.userId,
        sessionId: context.sessionId,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
        metadata: context.metadata,
      };

      console.log('[Telemetry]', telemetryData);

      // Future: Send to external monitoring service
      // await sendToMonitoringService(telemetryData);
    } catch (telemetryError) {
      console.warn('Failed to send error telemetry:', telemetryError);
    }
  }

  /**
   * Create user-friendly error from any error type
   */
  static createUserFriendlyError(error: any, operation: string): AIEngineError {
    if (error instanceof AIEngineError) {
      return error;
    }

    // Convert common errors to our error types
    const statusCode = error?.response?.status || error?.statusCode;
    const message = error?.message || 'Unknown error occurred';

    if (statusCode === 429) {
      return new RateLimitError(message, error?.retryAfter);
    }

    if (statusCode === 402 || message.toLowerCase().includes('quota')) {
      return new QuotaExceededError(message, error?.details);
    }

    if (statusCode === 400 || message.toLowerCase().includes('validation')) {
      return new ValidationError(message, error?.details);
    }

    if (statusCode >= 500 || message.toLowerCase().includes('network')) {
      return new NetworkError(message, error);
    }

    if (message.toLowerCase().includes('model')) {
      return new ModelError(message, error?.model || 'unknown', error);
    }

    // Generic error
    return new AIEngineError(message, 'UNKNOWN_ERROR', statusCode || 500, error);
  }

  /**
   * Execute operation with error handling and retry logic
   */
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext
  ): Promise<T> {
    let lastError: any;
    let attempt = 0;

    while (attempt <= this.options.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const errorResponse = await this.handleError(error, context);

        if (!errorResponse.shouldRetry || attempt === this.options.maxRetries) {
          throw ErrorHandler.createUserFriendlyError(error, context.operation);
        }

        if (errorResponse.retryDelay) {
          await new Promise(resolve => setTimeout(resolve, errorResponse.retryDelay));
        }

        attempt++;
      }
    }

    throw ErrorHandler.createUserFriendlyError(lastError, context.operation);
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler();

/**
 * Utility function for API route error handling
 */
export function handleAPIError(error: any, operation: string) {
  const friendlyError = ErrorHandler.createUserFriendlyError(error, operation);
  
  return {
    error: friendlyError.message,
    code: friendlyError.code,
    statusCode: friendlyError.statusCode || 500,
    details: process.env.NODE_ENV === 'development' ? friendlyError.details : undefined,
  };
}