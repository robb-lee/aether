/**
 * AI Site Generator using LiteLLM
 * 
 * Example usage of the unified LiteLLM client for site generation
 */

import { generateCompletion, streamCompletion, generateImage } from '../lib/litellm-client';

/**
 * Generate a complete website structure using AI
 */
export async function generateSiteStructure(prompt: string) {
  const systemPrompt = `You are an expert web designer and developer.
Generate a complete website structure optimized for conversion.

Output format: JSON with the following structure:
{
  "siteName": "string",
  "pages": [
    {
      "path": "/",
      "title": "string",
      "components": [
        {
          "type": "hero|features|testimonials|pricing|footer",
          "content": {},
          "styles": {}
        }
      ]
    }
  ],
  "theme": {
    "colors": {},
    "fonts": {}
  }
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  try {
    // Generate with primary model (GPT-4 by default)
    const result = await generateCompletion({
      messages,
      stream: false
    });

    console.log(`✅ Generated with ${result.model}`);
    console.log(`💰 Cost: $${result.cost.toFixed(4)}`);
    
    if (result.fallback) {
      console.log('⚠️ Used fallback model due to primary model failure');
    }

    const content = result.response.choices[0].message.content;
    return JSON.parse(content);
    
  } catch (error) {
    console.error('❌ Site generation failed:', error);
    throw error;
  }
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

    console.log(`🎨 Generated ${result.images.length} image(s)`);
    console.log(`💰 Cost: $${result.cost.toFixed(2)}`);

    return result.images[0].url;
    
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

// Export for use in other modules
export default {
  generateSiteStructure,
  generateSectionContent,
  generateHeroImage,
  generateSaaSLandingPage
};
