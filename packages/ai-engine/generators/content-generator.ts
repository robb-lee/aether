/**
 * Content Generator for Stage 2: Component-specific content generation
 * 
 * Takes selected component IDs and generates accurate props based on Zod schemas
 */

import { z } from 'zod';
import { SelectionContext } from '../selectors/component-selector';
import { generateCompletion } from '../lib/litellm-client';

// Import isolated schemas to avoid pulling in client components
import { COMPONENT_SCHEMAS, getExampleJSON } from '../schemas/component-schemas';

/**
 * Components that need complex content generation
 */
const COMPLEX_COMPONENTS = new Set([
  'pricing-table',
  'testimonials-slider', 
  'stats-section',
  'team-grid',
  'portfolio-gallery',
  'blog-grid',
  'faq-section',
  'timeline'
]);

/**
 * Component-specific timeouts in milliseconds
 */
const COMPONENT_TIMEOUTS = {
  // Simple components - 5-8 seconds
  'hero-split': 5000,
  'hero-centered': 5000,
  'hero-video-bg': 5000,
  'cta-simple': 5000,
  'contact-form': 5000,
  'footer-simple': 5000,
  'features-grid': 8000,
  
  // Complex components - 15-20 seconds  
  'pricing-table': 15000,
  'testimonials-slider': 15000,
  'stats-section': 15000,
  'team-grid': 15000,
  'portfolio-gallery': 20000,
  'blog-grid': 20000,
  'faq-section': 15000,
  'timeline': 15000
} as const;

/**
 * In-memory cache for component content
 */
const componentCache = new Map<string, any>();

/**
 * Simple components with basic props
 */
const SIMPLE_COMPONENT_PROPS = {
  'hero-split': {
    title: '',
    subtitle: '',
    description: '',
    ctaText: 'Get Started',
    ctaHref: '#',
    imagePrompt: ''
  },
  'hero-centered': {
    title: '',
    subtitle: '',
    description: '',
    ctaText: 'Get Started',
    ctaHref: '#',
    imagePrompt: ''
  },
  'hero-video-bg': {
    title: '',
    subtitle: '',
    description: '',
    ctaText: 'Get Started',
    ctaHref: '#',
    videoUrl: ''
  },
  'features-grid': {
    title: 'Key Features',
    description: 'Everything you need to succeed',
    features: []
  },
  'cta-simple': {
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of satisfied customers',
    ctaText: 'Get Started',
    ctaHref: '#'
  },
  'footer-simple': {
    companyName: '',
    description: '',
    links: []
  },
  'contact-form': {
    title: 'Get In Touch',
    subtitle: 'We\'d love to hear from you',
    submitText: 'Send Message',
    successMessage: 'Thank you! We\'ll get back to you soon.'
  }
} as const;

export interface ComponentContent {
  componentId: string;
  props: Record<string, any>;
}

export interface ContentGenerationResult {
  components: ComponentContent[];
  errors: Array<{ componentId: string; error: string }>;
}

/**
 * Generate content for selected components
 */
export async function generateComponentContent(
  componentIds: string[],
  userInput: string,
  context: SelectionContext
): Promise<ContentGenerationResult> {
  const components: ComponentContent[] = [];
  const errors: Array<{ componentId: string; error: string }> = [];

  console.log('🔄 Stage 2: Generating content for components (parallel):', componentIds);

  // Split components by complexity for optimal processing
  const complexComponents = componentIds.filter(id => COMPLEX_COMPONENTS.has(id));
  const simpleComponents = componentIds.filter(id => !COMPLEX_COMPONENTS.has(id));
  
  console.log(`📊 Processing: ${simpleComponents.length} simple, ${complexComponents.length} complex components`);
  
  // Process simple components in parallel (fast)
  const simplePromises = simpleComponents.map(async (componentId) => {
    const timeoutMs = COMPONENT_TIMEOUTS[componentId as keyof typeof COMPONENT_TIMEOUTS] || 8000;
    
    try {
      // Check cache first
      const cacheKey = `${componentId}:${context.industry}:${context.businessType}:${userInput.slice(0, 50)}`;
      if (componentCache.has(cacheKey)) {
        console.log(`⚡ Cache hit for ${componentId}`);
        return { componentId, props: componentCache.get(cacheKey) };
      }
      
      const withTimeout = Promise.race([
        generateSimpleComponentContent(componentId, userInput, context),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: ${componentId} (${timeoutMs}ms)`)), timeoutMs)
        )
      ]);
      
      const content = await withTimeout;
      
      // Cache successful result
      componentCache.set(cacheKey, content);
      
      return { componentId, props: content };
    } catch (error) {
      console.warn(`⚠️ Simple component failed, using fallback: ${componentId}`);
      const fallback = enhanceTemplateWithContext(
        SIMPLE_COMPONENT_PROPS[componentId as keyof typeof SIMPLE_COMPONENT_PROPS] || {},
        userInput,
        context,
        componentId
      );
      return { componentId, props: fallback };
    }
  });
  
  // Process complex components with individual timeouts
  const complexPromises = complexComponents.map(async (componentId) => {
    const timeoutMs = COMPONENT_TIMEOUTS[componentId as keyof typeof COMPONENT_TIMEOUTS] || 15000;
    
    try {
      console.log(`📝 Generating content for: ${componentId} (timeout: ${timeoutMs}ms)`);
      
      // Check cache first
      const cacheKey = `${componentId}:${context.industry}:${context.businessType}:${userInput.slice(0, 50)}`;
      if (componentCache.has(cacheKey)) {
        console.log(`⚡ Cache hit for ${componentId}`);
        return { componentId, props: componentCache.get(cacheKey) };
      }
      
      const withTimeout = Promise.race([
        generateComplexComponentContent(componentId, userInput, context),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: ${componentId} (${timeoutMs}ms)`)), timeoutMs)
        )
      ]);
      
      const content = await withTimeout;
      
      // Cache successful result
      componentCache.set(cacheKey, content);
      
      return { componentId, props: content };
    } catch (error) {
      console.warn(`⚠️ Complex component failed, using fallback: ${componentId}`);
      const fallback = generateContextualFallback(componentId, userInput, context);
      return { componentId, props: fallback };
    }
  });
  
  // Execute all promises and collect results
  try {
    const [simpleResults, ...complexResults] = await Promise.all([
      Promise.all(simplePromises),
      ...complexPromises
    ]);
    
    components.push(...simpleResults, ...complexResults);
    
    console.log('✅ Stage 2 complete (parallel):', { 
      successful: components.length, 
      errors: errors.length,
      cached: componentCache.size 
    });
    
  } catch (error) {
    console.error('❌ Batch component generation failed:', error);
    errors.push({
      componentId: 'batch_processing',
      error: error instanceof Error ? error.message : 'Batch processing failed'
    });
  }

  return { components, errors };
}

/**
 * Generate content for complex components using AI
 */
async function generateComplexComponentContent(
  componentId: string,
  userInput: string,
  context: SelectionContext
): Promise<Record<string, any>> {
  const schema = COMPONENT_SCHEMAS[componentId as keyof typeof COMPONENT_SCHEMAS];
  
  if (!schema) {
    throw new Error(`No schema found for component: ${componentId}`);
  }

  // Get component-specific prompt template with example JSON
  const promptTemplate = getComponentPromptTemplate(componentId);
  const exampleJSON = getExampleJSON(componentId);
  const prompt = promptTemplate
    .replace('{userInput}', userInput)
    .replace('{industry}', context.industry || 'general')
    .replace('{businessType}', context.businessType || 'company')
    .replace('{schema}', generateSchemaDocumentation(schema))
    .replace('{example}', exampleJSON);

  // Generate content with AI
  console.log(`🤖 Generating AI content for complex component: ${componentId}...`);
  
  const aiResult = await generateCompletion({
    messages: [
      {
        role: 'system',
        content: 'You are an expert web content generator. Generate realistic, professional content for website components. Return only valid JSON that matches the required schema exactly.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    task: 'content',
    maxRetries: 1 // Reduced retries for faster fallback
  });

  const result = { text: aiResult.response.choices[0].message.content.trim() };

  // Parse and validate JSON response
  let parsedContent;
  try {
    parsedContent = JSON.parse(result.text.trim());
  } catch (parseError) {
    throw new Error(`Failed to parse JSON response for ${componentId}: ${parseError}`);
  }

  // Validate with Zod schema - immediate fallback on failure
  const validation = schema.safeParse(parsedContent);
  if (!validation.success) {
    console.warn(`⚠️ Schema validation failed for ${componentId}, using immediate fallback`);
    // Don't waste time on retries - use fallback immediately
    return generateContextualFallback(componentId, userInput, context);
  }

  console.log(`✅ AI content validated for ${componentId}`);
  return validation.data;
}

/**
 * Generate content for simple components using AI
 */
async function generateSimpleComponentContent(
  componentId: string,
  userInput: string,
  context: SelectionContext
): Promise<Record<string, any>> {
  const template = SIMPLE_COMPONENT_PROPS[componentId as keyof typeof SIMPLE_COMPONENT_PROPS];
  
  if (!template) {
    throw new Error(`No template found for simple component: ${componentId}`);
  }

  console.log(`🤖 Generating AI content for ${componentId}...`);

  // Create component-specific prompts
  const prompt = createSimpleComponentPrompt(componentId, userInput, context, template);

  try {
    // Use AI to generate content
    const aiResult = await generateCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are an expert web content generator. Generate professional, engaging content for website components. Return only valid JSON that matches the required structure exactly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      task: 'content',
      maxRetries: 2
    });

    const generatedContent = JSON.parse(aiResult.response.choices[0].message.content.trim());
    
    console.log(`✅ AI content generated for ${componentId}`);
    return { ...template, ...generatedContent };

  } catch (error) {
    console.warn(`⚠️ AI generation failed for ${componentId}, using enhanced template:`, error);
    // Fallback: return enhanced template with basic content
    return enhanceTemplateWithContext(template, userInput, context, componentId);
  }
}

/**
 * Get component-specific prompt template
 */
function getComponentPromptTemplate(componentId: string): string {
  const templates: Record<string, string> = {
    'pricing-table': `Generate pricing plans for this business: {userInput}
Industry: {industry}
Business Type: {businessType}

Create 3 pricing tiers (Starter, Professional, Enterprise) with:
- Realistic pricing for {industry} industry  
- 4-6 features per tier
- Clear value progression
- One tier highlighted as "popular"

CRITICAL: Return ONLY valid JSON, no explanations or markdown.

EXACT FORMAT REQUIRED:
{example}

Your response must match this structure EXACTLY.
Field requirements:
- price: string (REQUIRED, never undefined)
- description: string (REQUIRED, never undefined)
- All fields must be present and valid

Return only valid JSON:`,

    'testimonials-slider': `Generate customer testimonials for: {userInput}
Industry: {industry}

Create 3-4 realistic testimonials with:
- Diverse customer profiles
- Specific benefits mentioned
- Professional tone
- Company names and roles

CRITICAL: Return ONLY valid JSON, no explanations or markdown.

EXACT FORMAT REQUIRED:
{example}

Your response must match this structure EXACTLY.
Testimonials must be an array of objects, NOT strings.
Each testimonial must have: name, content (both required).

Return only valid JSON:`,

    'stats-section': `Generate key statistics for: {userInput}
Industry: {industry}

Create 3-4 impressive but realistic metrics like:
- Customer count, revenue growth, uptime, etc.
- Include proper units (%, +, K, M, etc.)
- Make them credible for {industry} industry

CRITICAL: Return ONLY valid JSON, no explanations or markdown.

EXACT FORMAT REQUIRED:
{example}

Your response must match this structure EXACTLY.
Field requirements:
- value: string (REQUIRED, never undefined)
- label: string (REQUIRED, never undefined)

Return only valid JSON:`,

    'team-grid': `Generate team members for: {userInput}
Industry: {industry}

Create 3-4 team members with:
- Realistic names and roles for {industry}
- Professional bios (2-3 sentences)
- Diverse team composition
- Relevant expertise areas

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'faq-section': `Generate FAQ for: {userInput}
Industry: {industry}

Create 5-7 common questions and answers about:
- Product/service features
- Pricing and plans
- Support and implementation
- Security and compliance (if relevant)

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'timeline': `Generate company timeline for: {userInput}
Industry: {industry}

Create 4-6 key milestones showing:
- Company growth and development
- Product launches or major features
- Realistic dates and achievements
- Professional milestone descriptions

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'portfolio-gallery': `Generate portfolio items for: {userInput}
Industry: {industry}

Create 6-9 portfolio items showcasing:
- Project names relevant to {industry}
- Brief project descriptions
- Categories/tags
- Image descriptions for generation

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'blog-grid': `Generate blog posts for: {userInput}
Industry: {industry}

Create 6-9 blog posts with:
- Industry-relevant titles
- Brief excerpts (2-3 sentences)
- Author names
- Categories and publish dates
- SEO-friendly content

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`
  };

  return templates[componentId] || `Generate content for ${componentId} component.
Business: {userInput}
Industry: {industry}

CRITICAL: Return ONLY valid JSON, no explanations or markdown.

EXACT FORMAT REQUIRED:
{example}

Return only valid JSON:`;
}

/**
 * Generate schema documentation from Zod schema
 */
function generateSchemaDocumentation(schema: z.ZodType): string {
  try {
    const defaultValues = getDefaultValues(schema);
    return JSON.stringify(defaultValues, null, 2);
  } catch (error) {
    return 'Schema documentation unavailable';
  }
}

/**
 * Get default values from Zod schema
 */
function getDefaultValues(schema: z.ZodType): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const defaults: any = {};
    
    for (const [key, value] of Object.entries(shape)) {
      if (value instanceof z.ZodDefault) {
        defaults[key] = value._def.defaultValue();
      } else if (value instanceof z.ZodString) {
        defaults[key] = 'string';
      } else if (value instanceof z.ZodNumber) {
        defaults[key] = 0;
      } else if (value instanceof z.ZodBoolean) {
        defaults[key] = false;
      } else if (value instanceof z.ZodArray) {
        defaults[key] = ['array of items'];
      } else if (value instanceof z.ZodOptional) {
        // Skip optional fields in documentation
        continue;
      }
    }
    
    return defaults;
  }
  
  return {};
}

/**
 * Generate fallback content when AI fails (context-aware defaults)
 */
function generateContextualFallback(componentId: string, userInput: string, context: SelectionContext): any {
  const businessName = extractBusinessName(userInput);
  const industry = context.industry || 'business';
  
  const fallbackData: Record<string, any> = {
    'pricing-table': {
      title: "Choose Your Plan",
      subtitle: `Flexible pricing for ${industry} businesses`, 
      currency: "$",
      plans: [
        {
          name: "Starter",
          price: "29",
          period: "month",
          description: `Perfect for small ${industry} teams`,
          features: ["Basic features", "Email support", "Standard tools"],
          ctaText: "Start Free Trial"
        },
        {
          name: "Professional", 
          price: "99",
          period: "month",
          description: `Best for growing ${industry} businesses`,
          features: ["Advanced features", "Priority support", "Premium tools", "Analytics"],
          highlighted: true,
          ctaText: "Get Started"
        },
        {
          name: "Enterprise",
          price: "299", 
          period: "month",
          description: `For large ${industry} organizations`,
          features: ["All features", "24/7 support", "Custom integrations", "Dedicated manager"],
          ctaText: "Contact Sales"
        }
      ]
    },
    'testimonials-slider': {
      title: "What Our Customers Say",
      subtitle: `Trusted by ${industry} professionals`,
      testimonials: [
        {
          name: "Sarah Johnson",
          company: "Tech Solutions Inc",
          role: `${industry} Manager`,
          content: `Working with ${businessName} has been instrumental in transforming our ${industry} operations. Their expertise and support are exceptional.`,
          rating: 5
        },
        {
          name: "Mike Chen",
          company: "Industry Leader Co",
          role: "CEO",
          content: `Outstanding service and results in the ${industry} sector.`,
          rating: 5
        }
      ]
    },
    'stats-section': {
      title: "Our Impact",
      subtitle: `Proven results in ${industry}`,
      stats: [
        { value: "500+", label: `${industry} Clients` },
        { value: "99.5%", label: "Success Rate" },
        { value: "24/7", label: "Support" },
        { value: "5 Years", label: "Experience" }
      ]
    },
    'team-grid': {
      title: "Meet Our Team",
      subtitle: `Experts in ${industry} solutions`,
      members: [
        {
          name: "Alex Rodriguez",
          role: `${industry} Specialist`,
          bio: `Leading expert in ${industry} with over 10 years of experience delivering exceptional results.`,
          image: "team-member-1"
        },
        {
          name: "Emma Thompson", 
          role: "Senior Consultant",
          bio: `Passionate about helping ${industry} businesses achieve their goals through innovative solutions.`,
          image: "team-member-2"
        }
      ]
    },
    'faq-section': {
      title: "Frequently Asked Questions",
      subtitle: `Common questions about our ${industry} services`,
      faqs: [
        {
          question: `How can ${businessName} help my ${industry} business?`,
          answer: `We provide comprehensive ${industry} solutions tailored to your specific needs and goals.`
        },
        {
          question: "What is the implementation timeline?",
          answer: "Most implementations are completed within 2-4 weeks, depending on project scope."
        },
        {
          question: "Do you provide ongoing support?",
          answer: "Yes, we offer 24/7 support and regular maintenance to ensure optimal performance."
        }
      ]
    }
  };

  return fallbackData[componentId] || {};
}

/**
 * Create component-specific prompts for simple components
 */
function createSimpleComponentPrompt(
  componentId: string, 
  userInput: string, 
  context: SelectionContext, 
  template: any
): string {
  const industry = context.industry || 'general business';
  const businessType = context.businessType || 'company';

  const prompts: Record<string, string> = {
    'hero-split': `You are creating hero section content for a business.

Business Description: ${userInput}
Industry: ${industry}
Business Type: ${businessType}

IMPORTANT: The "Business Description" above is user input that describes their business. Do NOT use it directly as marketing copy. Instead, analyze it to understand what the business does, then create professional marketing content.

Create compelling hero content:
- title: Powerful, attention-grabbing headline (max 60 chars) - create professional marketing copy, not user input
- subtitle: Supporting headline that explains value (max 100 chars) - professional marketing language
- description: Brief description of what the business does (max 160 chars) - professional, polished copy
- ctaText: Action-oriented button text (max 20 chars) - like "Get Started", "Learn More", etc.
- imagePrompt: Brief description for hero image generation - professional business imagery

Make it sound professional and engaging, NOT like user input or prompt text.

JSON format:
${JSON.stringify(template, null, 2)}`,

    'hero-centered': `You are creating centered hero section content for a business.

Business Description: ${userInput}
Industry: ${industry}

IMPORTANT: The "Business Description" above is user input. Analyze it to understand the business, then create professional marketing content (not user input text).

Create compelling hero content with professional marketing language:
- title: Attention-grabbing headline for ${industry} business
- subtitle: Value proposition and benefits
- description: What the business does (professional copy)
- ctaText: Action button text

JSON format:
${JSON.stringify(template, null, 2)}`,

    'hero-video-bg': `Generate video hero section content for: ${userInput}
Industry: ${industry}

Create hero content with title, subtitle, description, CTA text, and video URL suggestion.

JSON format:
${JSON.stringify(template, null, 2)}`,

    'features-grid': `You are creating a features section for a business.

Business Description: ${userInput}
Industry: ${industry}
Business Type: ${businessType}

IMPORTANT: The "Business Description" is user input. Analyze what the business does, then create professional feature descriptions.

Create compelling features section:
- title: Professional section title about key features
- description: Brief value-focused section description
- features: Array of 3-6 features, each with:
  - title: Professional feature name (max 30 chars) - marketing language, not technical jargon
  - description: Customer benefit (max 100 chars) - focus on value to customer
  - icon: Suggested icon name (e.g. "shield", "speed", "users")

Focus on benefits that matter most to customers in ${industry} industry.

JSON format:
${JSON.stringify({
  ...template,
  features: [
    { title: "Feature Name", description: "Feature benefit description", icon: "icon-name" }
  ]
}, null, 2)}`,

    'cta-simple': `Generate call-to-action section for: ${userInput}
Industry: ${industry}

Create compelling CTA with title, subtitle, and action button text.
Make it conversion-focused for ${industry} business.

JSON format:
${JSON.stringify(template, null, 2)}`,

    'footer-simple': `Generate footer content for: ${userInput}
Industry: ${industry}

Create:
- companyName: Business name
- description: Brief company description (max 100 chars)
- links: Array of footer links with name and href

JSON format:
${JSON.stringify({
  ...template,
  links: [{ name: "Link Name", href: "#link" }]
}, null, 2)}`,

    'contact-form': `Generate contact form content for: ${userInput}
Industry: ${industry}

Create professional contact form with title, subtitle, and messaging.

JSON format:
${JSON.stringify(template, null, 2)}`
  };

  return prompts[componentId] || `Generate content for ${componentId} component for: ${userInput}
Industry: ${industry}

JSON format:
${JSON.stringify(template, null, 2)}`;
}

/**
 * Extract clean business name from user input
 */
function extractBusinessName(userInput: string): string {
  // Remove Korean particles and descriptive text
  const patterns = [
    /^([가-힣A-Za-z0-9\s&]+?)(?:는|은|이|가|의|을|를)\s/,  // Korean particles
    /^([가-힣A-Za-z0-9\s&]+?)(?:\s+provides?|\s+is|\s+offers?|\s+specializes?)/i, // English patterns
    /^([가-힣A-Za-z0-9\s&]+?)(?:\s|$)/ // First word/phrase
  ];
  
  for (const pattern of patterns) {
    const match = userInput.match(pattern);
    if (match) {
      const name = match[1].trim();
      // Avoid generic terms
      if (name.length > 1 && !['it', 'we', 'our', 'the', 'this'].includes(name.toLowerCase())) {
        return name;
      }
    }
  }
  
  // Fallback: first meaningful word
  const words = userInput.split(/[\s.,!?]/);
  for (const word of words) {
    if (word.length > 2 && /[A-Za-z가-힣]/.test(word)) {
      return word;
    }
  }
  
  return 'Our Company';
}

/**
 * Enhance template with basic context when AI fails
 */
function enhanceTemplateWithContext(
  template: any,
  userInput: string,
  context: SelectionContext,
  componentId: string
): any {
  const enhanced = { ...template };
  const businessName = extractBusinessName(userInput);
  const industry = context.industry || 'business';

  // Basic enhancements based on component type
  switch (componentId) {
    case 'hero-split':
    case 'hero-centered':
    case 'hero-video-bg':
      enhanced.title = enhanced.title || `Transform Your ${industry.charAt(0).toUpperCase() + industry.slice(1)} Business`;
      enhanced.subtitle = enhanced.subtitle || `Professional solutions for ${industry} companies`;
      enhanced.description = enhanced.description || `${businessName} delivers innovative ${industry} solutions to help businesses succeed and grow.`;
      break;

    case 'features-grid':
      enhanced.title = enhanced.title || 'Why Choose Us';
      enhanced.description = enhanced.description || `Discover what makes our ${industry} solutions different`;
      enhanced.features = enhanced.features || [
        { title: 'Professional Service', description: 'Expert solutions tailored to your needs', icon: 'star' },
        { title: 'Reliable Support', description: '24/7 customer support when you need it', icon: 'support' },
        { title: 'Proven Results', description: 'Track record of success in the industry', icon: 'chart' }
      ];
      break;

    case 'cta-simple':
      enhanced.title = enhanced.title || 'Ready to Get Started?';
      enhanced.subtitle = enhanced.subtitle || `Join thousands of satisfied ${industry} customers`;
      break;

    case 'footer-simple':
      enhanced.companyName = enhanced.companyName || businessName;
      enhanced.description = enhanced.description || `Leading ${industry} solutions provider`;
      enhanced.links = enhanced.links || [
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' }
      ];
      break;

    case 'contact-form':
      enhanced.title = enhanced.title || 'Get In Touch';
      enhanced.subtitle = enhanced.subtitle || `Ready to discuss your ${industry} needs?`;
      break;
  }

  return enhanced;
}