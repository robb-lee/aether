'use client';

import React from 'react';
import { Button } from '@aether/ui';

interface BaseErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const BaseErrorState: React.FC<BaseErrorStateProps & { icon: string; color: string }> = ({
  icon,
  color,
  title,
  message,
  onRetry,
  onBack,
  className = '',
  children
}) => (
  <div className={`flex flex-col items-center justify-center min-h-[300px] p-6 text-center ${className}`}>
    <div className={`text-5xl mb-4 ${color}`}>{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
      {message}
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <Button onClick={onRetry}>
          Try Again
        </Button>
      )}
      {onBack && (
        <Button variant="secondary" onClick={onBack}>
          Go Back
        </Button>
      )}
    </div>
    {children}
  </div>
);

export const AIErrorState: React.FC<BaseErrorStateProps & {
  model?: string;
  fallbackUsed?: boolean;
}> = ({ model, fallbackUsed, ...props }) => (
  <BaseErrorState
    icon="🤖"
    color="text-blue-500"
    title={props.title || "AI Generation Failed"}
    message={
      props.message || 
      `We encountered an issue generating your content${model ? ` with ${model}` : ''}.${
        fallbackUsed ? ' We tried backup models but they also failed.' : ' Please try again.'
      }`
    }
    {...props}
  />
);

export const NetworkErrorState: React.FC<BaseErrorStateProps> = (props) => (
  <BaseErrorState
    icon="🌐"
    color="text-red-500"
    title={props.title || "Connection Error"}
    message={
      props.message || 
      "We're having trouble connecting to our servers. Please check your internet connection and try again."
    }
    {...props}
  />
);

export const QuotaErrorState: React.FC<BaseErrorStateProps & {
  usage?: { current: number; limit: number };
  tier?: string;
}> = ({ usage, tier, ...props }) => (
  <BaseErrorState
    icon="📊"
    color="text-orange-500"
    title={props.title || "Usage Limit Reached"}
    message={
      props.message || 
      `You've reached your ${tier || 'current'} plan's generation limit${
        usage ? ` (${usage.current}/${usage.limit})` : ''
      }. Upgrade your plan or wait for your limit to reset.`
    }
    {...props}
  />
);

export const RateLimitErrorState: React.FC<BaseErrorStateProps & {
  retryAfter?: number;
}> = ({ retryAfter, ...props }) => (
  <BaseErrorState
    icon="⏱️"
    color="text-yellow-500"
    title={props.title || "Too Many Requests"}
    message={
      props.message || 
      `We're receiving a lot of requests right now. ${
        retryAfter ? `Please wait ${retryAfter} seconds before trying again.` : 'Please wait a moment and try again.'
      }`
    }
    {...props}
  />
);

export const ValidationErrorState: React.FC<BaseErrorStateProps & {
  validationErrors?: string[];
}> = ({ validationErrors, ...props }) => (
  <BaseErrorState
    icon="✏️"
    color="text-purple-500"
    title={props.title || "Invalid Input"}
    message={
      props.message || 
      "Please check your input and try again."
    }
    {...props}
  >
    {validationErrors && validationErrors.length > 0 && (
      <div className="mt-4 text-left">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issues found:</p>
        <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
          {validationErrors.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    )}
  </BaseErrorState>
);

export const GenericErrorState: React.FC<BaseErrorStateProps> = (props) => (
  <BaseErrorState
    icon="❌"
    color="text-gray-500"
    title={props.title || "Something went wrong"}
    message={
      props.message || 
      "An unexpected error occurred. Our team has been notified. Please try again later."
    }
    {...props}
  />
);

// Error state selector - maps error types to appropriate components
export const ErrorStateSelector: React.FC<{
  error: any;
  onRetry?: () => void;
  onBack?: () => void;
}> = ({ error, onRetry, onBack }) => {
  if (!error) return null;

  const baseProps = { onRetry, onBack };

  // Map error types to appropriate components
  if (error.name === 'ModelError' || error.code === 'MODEL_ERROR') {
    return (
      <AIErrorState
        {...baseProps}
        model={error.details?.model}
        fallbackUsed={error.details?.fallbackUsed}
      />
    );
  }

  if (error.name === 'RateLimitError' || error.code === 'RATE_LIMIT') {
    return (
      <RateLimitErrorState
        {...baseProps}
        retryAfter={error.details?.retryAfter}
      />
    );
  }

  if (error.name === 'QuotaExceededError' || error.code === 'QUOTA_EXCEEDED') {
    return (
      <QuotaErrorState
        {...baseProps}
        usage={error.details?.usage}
        tier={error.details?.tier}
      />
    );
  }

  if (error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR') {
    return (
      <ValidationErrorState
        {...baseProps}
        validationErrors={error.details?.validationErrors}
      />
    );
  }

  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return <NetworkErrorState {...baseProps} />;
  }

  // Default fallback
  return <GenericErrorState {...baseProps} message={error.message} />;
};