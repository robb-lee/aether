/**
 * Content Generator for Stage 2: Component-specific content generation
 * 
 * Takes selected component IDs and generates accurate props based on Zod schemas
 */

import { z } from 'zod';
import { SelectionContext } from '../selectors/component-selector';

// Import isolated schemas to avoid pulling in client components
import { COMPONENT_SCHEMAS } from '../schemas/component-schemas';

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

  console.log('🔄 Stage 2: Generating content for components:', componentIds);

  for (const componentId of componentIds) {
    try {
      console.log(`📝 Generating content for: ${componentId}`);
      
      if (COMPLEX_COMPONENTS.has(componentId)) {
        // Complex component - use AI generation
        const content = await generateComplexComponentContent(componentId, userInput, context);
        components.push({ componentId, props: content });
      } else {
        // Simple component - use template + basic AI
        const content = await generateSimpleComponentContent(componentId, userInput, context);
        components.push({ componentId, props: content });
      }
    } catch (error) {
      console.error(`❌ Failed to generate content for ${componentId}:`, error);
      errors.push({ 
        componentId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  console.log('✅ Stage 2 complete:', { 
    successful: components.length, 
    errors: errors.length 
  });

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

  // Get component-specific prompt template
  const promptTemplate = getComponentPromptTemplate(componentId);
  const prompt = promptTemplate
    .replace('{userInput}', userInput)
    .replace('{industry}', context.industry || 'general')
    .replace('{businessType}', context.businessType || 'company')
    .replace('{schema}', generateSchemaDocumentation(schema));

  // Generate content with AI (temporary mock implementation)
  // TODO: Replace with actual AI generation once LiteLLM is properly configured
  const result = { text: generateMockContent(componentId, userInput, context) };

  // Parse and validate JSON response
  let parsedContent;
  try {
    parsedContent = JSON.parse(result.text.trim());
  } catch (parseError) {
    throw new Error(`Failed to parse JSON response for ${componentId}: ${parseError}`);
  }

  // Validate with Zod schema
  const validation = schema.safeParse(parsedContent);
  if (!validation.success) {
    console.warn(`⚠️ Schema validation failed for ${componentId}:`, validation.error);
    // Return default values if validation fails
    const defaultValues = getDefaultValues(schema);
    return { ...defaultValues, ...parsedContent };
  }

  return validation.data;
}

/**
 * Generate content for simple components
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

  // Use AI to fill in the template fields
  const prompt = `Generate content for ${componentId} component.
Business: ${userInput}
Industry: ${context.industry || 'general'}

Fill in these fields with appropriate content:
${JSON.stringify(template, null, 2)}

Return only valid JSON matching the structure above.`;

  // Generate content with AI (temporary mock implementation)
  const result = { text: JSON.stringify(template) };

  try {
    return JSON.parse(result.text.trim());
  } catch (error) {
    console.warn(`⚠️ Failed to parse simple component content for ${componentId}, using template`);
    return template;
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

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'testimonials-slider': `Generate customer testimonials for: {userInput}
Industry: {industry}

Create 3-4 realistic testimonials with:
- Diverse customer profiles
- Specific benefits mentioned
- Professional tone
- Company names and roles

REQUIRED JSON STRUCTURE:
{schema}

Return only valid JSON:`,

    'stats-section': `Generate key statistics for: {userInput}
Industry: {industry}

Create 3-4 impressive but realistic metrics like:
- Customer count, revenue growth, uptime, etc.
- Include proper units (%, +, K, M, etc.)
- Make them credible for {industry} industry

REQUIRED JSON STRUCTURE:
{schema}

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

Return only valid JSON:`
  };

  return templates[componentId] || `Generate content for ${componentId} component.
Business: {userInput}
Industry: {industry}

REQUIRED STRUCTURE:
{schema}

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
 * Generate mock content for testing (temporary implementation)
 */
function generateMockContent(componentId: string, userInput: string, context: SelectionContext): string {
  const mockData: Record<string, any> = {
    'pricing-table': {
      title: "Choose Your Plan",
      subtitle: "Flexible pricing for teams of all sizes", 
      currency: "$",
      plans: [
        {
          name: "Starter",
          price: "29",
          period: "month",
          description: "Perfect for small teams",
          features: ["5 users", "10GB storage", "Basic support"],
          ctaText: "Start Free Trial"
        },
        {
          name: "Professional", 
          price: "99",
          period: "month",
          description: "Best for growing businesses",
          features: ["25 users", "100GB storage", "Priority support", "Advanced features"],
          highlighted: true,
          ctaText: "Get Started"
        },
        {
          name: "Enterprise",
          price: "299", 
          period: "month",
          description: "For large organizations",
          features: ["Unlimited users", "1TB storage", "24/7 support", "All features"],
          ctaText: "Contact Sales"
        }
      ]
    },
    'testimonials-slider': {
      title: "What Our Customers Say",
      testimonials: [
        {
          name: "John Smith",
          company: "TechCorp",
          content: "This service has transformed our workflow completely.",
          rating: 5
        }
      ]
    },
    'stats-section': {
      title: "Our Impact",
      stats: [
        { value: "10K+", label: "Happy Customers" },
        { value: "99.9%", label: "Uptime" },
        { value: "50+", label: "Countries" }
      ]
    }
  };

  return JSON.stringify(mockData[componentId] || {});
}