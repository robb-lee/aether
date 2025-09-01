/**
 * Mock LiteLLM Client for Testing
 * 
 * Provides fake responses that match the real LiteLLM interface
 * Allows testing without external dependencies
 */

import type { CompletionResponse, ImageResponse } from './litellm-client';

/**
 * Mock responses for different tasks
 */
const mockResponses = {
  structure: {
    choices: [{
      message: {
        content: JSON.stringify({
          root: {
            id: 'root',
            type: 'page',
            props: {},
            children: [
              {
                id: 'hero',
                type: 'hero',
                props: { variant: 'centered' },
                children: [
                  {
                    id: 'title',
                    type: 'heading',
                    props: { level: 1 },
                    content: { text: 'Welcome to Our SaaS' }
                  }
                ]
              }
            ]
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            model: 'gpt-4-turbo-preview'
          }
        })
      }
    }],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 500,
      total_tokens: 600
    }
  },
  
  content: {
    choices: [{
      message: {
        content: JSON.stringify({
          title: 'Revolutionary SaaS Platform',
          description: 'Transform your workflow with our cutting-edge solution',
          sections: {
            hero: {
              headline: 'Transform Your Business',
              subheadline: 'The most powerful SaaS platform for modern teams',
              cta: 'Start Free Trial'
            },
            features: {
              headline: 'Everything You Need',
              items: [
                { title: 'Lightning Fast', description: 'Optimized for speed and performance' },
                { title: 'Secure by Default', description: 'Enterprise-grade security built in' }
              ]
            }
          }
        })
      }
    }],
    usage: {
      prompt_tokens: 200,
      completion_tokens: 300,
      total_tokens: 500
    }
  },
  
  analysis: {
    choices: [{
      message: {
        content: JSON.stringify({
          industry: 'saas',
          audience: 'business professionals',
          goals: ['increase sales', 'build brand'],
          style: 'modern',
          features: ['auth', 'payment', 'analytics']
        })
      }
    }],
    usage: {
      prompt_tokens: 150,
      completion_tokens: 100,
      total_tokens: 250
    }
  },

  simple: {
    choices: [{
      message: {
        content: JSON.stringify({
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
          }
        })
      }
    }],
    usage: {
      prompt_tokens: 50,
      completion_tokens: 150,
      total_tokens: 200
    }
  }
};

/**
 * Mock generateCompletion function
 */
export async function mockGenerateCompletion({
  messages,
  model,
  task,
}: {
  messages: any[];
  model?: string;
  task?: string;
}): Promise<CompletionResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Get appropriate mock response based on task
  const taskType = task || 'simple';
  const response = mockResponses[taskType as keyof typeof mockResponses] || mockResponses.simple;
  
  return {
    response,
    model: model || 'mock-model',
    cost: 0.001, // Mock cost
    fallback: false,
    metadata: {
      attemptedModels: [model || 'mock-model']
    }
  };
}

/**
 * Mock generateImage function
 */
export async function mockGenerateImage({
  prompt,
  size = '1024x1024',
}: {
  prompt: string;
  size?: string;
}): Promise<ImageResponse> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    images: [{
      url: 'https://via.placeholder.com/1024x1024?text=Mock+Image',
      revised_prompt: prompt
    }],
    model: 'mock-dall-e',
    cost: 0.04,
    fallback: false,
    metadata: {
      attemptedModels: ['mock-dall-e']
    }
  };
}

/**
 * Mock streamCompletion function
 */
export async function* mockStreamCompletion({
  messages,
  model,
  onToken,
  onStart,
  onComplete,
}: {
  messages: any[];
  model?: string;
  onToken?: (token: string) => void;
  onStart?: (model: string) => void;
  onComplete?: (fullText: string, model: string, cost: number) => void;
}) {
  const mockModel = model || 'mock-model';
  onStart?.(mockModel);
  
  const text = 'This is a mock streaming response for testing purposes.';
  const tokens = text.split(' ');
  
  let fullText = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] + ' ';
    fullText += token;
    onToken?.(token);
    
    yield {
      content: token,
      model: mockModel,
      tokenCount: i + 1
    };
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  onComplete?.(fullText, mockModel, 0.001);
}

/**
 * Mock checkHealth function
 */
export async function mockCheckHealth() {
  return {
    healthy: true,
    litellm: true,
    models: {
      'gpt-4-turbo-preview': true,
      'claude-3-haiku': true,
      'dall-e-3': true
    },
    latency: 100,
    timestamp: new Date().toISOString()
  };
}

/**
 * Mock listModels function
 */
export async function mockListModels() {
  return [
    { id: 'gpt-4-turbo-preview', object: 'model' },
    { id: 'claude-3-opus', object: 'model' },
    { id: 'claude-3-haiku', object: 'model' },
    { id: 'dall-e-3', object: 'model' }
  ];
}