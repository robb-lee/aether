/**
 * AI Site Generator using LiteLLM
 * 
 * Enhanced site generation with streaming responses and robust parsing
 */

import { generateCompletion, streamCompletion, generateImage } from '../lib/litellm-client';
import { parseSiteStructure, parseComponentTree } from '../parsers/response-parser';
import { StreamingResponseHandler, handleStreamingResponse } from '../parsers/stream-handler';
import { normalizeModelDifferences } from '../lib/normalizer';
import { validateSiteStructure } from '../lib/validators';
import { SiteStructureSchema } from '../schemas/site-structure';

/**
 * Generate a complete website structure using AI with robust parsing
 */
export async function generateSiteStructure(prompt: string, options: {
  streaming?: boolean;
  onProgress?: (progress: any) => void;
  model?: string;
} = {}) {
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
  
  let chunks: any[] = [];
  
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
      console.error(`❌ Error with ${usedModel}:`, error.message);
    }
  })) {
    chunks.push(chunk);
    await handler.processChunk({
      content: chunk.content,
      model: chunk.model,
      tokenCount: chunk.tokenCount,
      timestamp: Date.now(),
      chunkIndex: chunks.length
    });
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
    chunks.push(chunk);
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
    'Create a SaaS landing page for an AI-powered project management tool called TaskFlow'
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
    });
  }
  
  return await handler.complete();
}

// Export for use in other modules
export default {
  generateSiteStructure,
  generateSectionContent,
  generateHeroImage,
  generateSaaSLandingPage,
  generateSiteWithStreaming
};
