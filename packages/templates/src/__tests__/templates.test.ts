import { describe, it, expect } from 'vitest';
import { 
  TemplateManager, 
  saasTemplate,
  portfolioTemplate,
  ecommerceTemplate,
  blogTemplate,
  restaurantTemplate,
  createCustomTheme,
  generateAIHints,
  COLOR_PALETTES,
  FONT_PAIRS
} from '../index';

describe('TemplateManager', () => {
  const manager = new TemplateManager();

  it('should load all 5 templates', () => {
    const templates = manager.getAllTemplates();
    expect(templates).toHaveLength(5);
    
    const industries = templates.map(t => t.industry);
    expect(industries).toContain('saas');
    expect(industries).toContain('portfolio');
    expect(industries).toContain('ecommerce');
    expect(industries).toContain('blog');
    expect(industries).toContain('restaurant');
  });

  it('should find templates by ID', () => {
    const saas = manager.getTemplateById('saas-modern');
    expect(saas).toBeDefined();
    expect(saas?.name).toBe('Modern SaaS');
    
    const nonExistent = manager.getTemplateById('non-existent');
    expect(nonExistent).toBeNull();
  });

  it('should filter templates by industry', () => {
    const saasTemplates = manager.getTemplatesByIndustry('saas');
    expect(saasTemplates).toHaveLength(1);
    expect(saasTemplates[0].industry).toBe('saas');
  });

  it('should find best template match for prompts', () => {
    const saasMatch = manager.findBestTemplate('I want to build a SaaS platform for productivity');
    expect(saasMatch).toBeDefined();
    expect(saasMatch?.template.industry).toBe('saas');
    expect(saasMatch?.confidence).toBeGreaterThan(0.3);

    const restaurantMatch = manager.findBestTemplate('Create a website for my Italian restaurant');
    expect(restaurantMatch).toBeDefined();
    expect(restaurantMatch?.template.industry).toBe('restaurant');
  });

  it('should provide multiple template matches', () => {
    const matches = manager.findTemplateMatches('professional business website', 3);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(3);
    expect(matches[0].confidence).toBeGreaterThanOrEqual(matches[1]?.confidence || 0);
  });

  it('should apply customizations to templates', () => {
    const customization = {
      colors: { primary: '#FF5733' },
      fonts: { heading: 'Custom Font' }
    };

    const customized = manager.applyCustomization(saasTemplate, customization);
    expect(customized.defaultCustomization.colors?.primary).toBe('#FF5733');
    expect(customized.defaultCustomization.fonts?.heading).toBe('Custom Font');
    expect(customized.defaultCustomization.fonts?.body).toBe(saasTemplate.defaultCustomization.fonts?.body);
  });
});

describe('Template Structure Validation', () => {
  const templates = [saasTemplate, portfolioTemplate, ecommerceTemplate, blogTemplate, restaurantTemplate];

  templates.forEach(template => {
    describe(`${template.name} template`, () => {
      it('should have valid structure', () => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.industry).toBeDefined();
        expect(template.sections).toBeDefined();
        expect(template.sections.length).toBeGreaterThan(0);
      });

      it('should have required sections in correct order', () => {
        const requiredSections = template.sections
          .filter(s => s.required)
          .sort((a, b) => a.order - b.order);
        
        expect(requiredSections.length).toBeGreaterThan(0);
        expect(requiredSections[0].order).toBe(1);
      });

      it('should have valid component IDs', () => {
        template.sections.forEach(section => {
          expect(section.componentId).toBeDefined();
          expect(typeof section.componentId).toBe('string');
          expect(section.componentId.length).toBeGreaterThan(0);
        });
      });

      it('should have AI hints', () => {
        expect(template.aiHints).toBeDefined();
        expect(template.aiHints.contentTone).toBeDefined();
        expect(template.aiHints.targetAudience).toBeDefined();
        expect(template.aiHints.keyMessages.length).toBeGreaterThan(0);
        expect(template.aiHints.seoKeywords.length).toBeGreaterThan(0);
      });

      it('should have default customization', () => {
        expect(template.defaultCustomization).toBeDefined();
        expect(template.defaultCustomization.colors).toBeDefined();
        expect(template.defaultCustomization.fonts).toBeDefined();
      });
    });
  });
});

describe('Customization Utilities', () => {
  it('should create custom themes', () => {
    const theme = createCustomTheme('Professional Blue', 'Modern Sans', {
      borderRadius: 'large',
      spacing: 'loose'
    });

    expect(theme.colors?.primary).toBe('#3B82F6');
    expect(theme.fonts?.heading).toBe('Inter');
    expect(theme.borderRadius).toBe('1rem');
    expect(theme.spacing?.padding).toBe('2.5rem');
  });

  it('should handle custom color palettes', () => {
    const customPalette = {
      name: 'Custom',
      colors: {
        primary: '#FF5733',
        secondary: '#FF3300',
        accent: '#FFB533',
        background: '#FFFFFF',
        text: '#000000'
      }
    };

    const theme = createCustomTheme(customPalette, FONT_PAIRS[0]);
    expect(theme.colors?.primary).toBe('#FF5733');
  });
});

describe('AI Hints Generation', () => {
  it('should generate content hints for templates', () => {
    const hints = generateAIHints(
      saasTemplate,
      'A productivity tool for teams',
      { callToActionStyle: 'urgent' }
    );

    expect(hints.tone).toBeDefined();
    expect(hints.audience).toBeDefined();
    expect(hints.keyWords).toContain('productivity');
    expect(hints.callToActionExamples.length).toBeGreaterThan(0);
  });

  it('should extract keywords from business description', () => {
    const hints = generateAIHints(
      restaurantTemplate,
      'Family-owned Italian restaurant serving authentic pasta and pizza'
    );

    expect(hints.keyWords).toContain('italian');
    expect(hints.keyWords).toContain('pasta');
    expect(hints.keyWords).toContain('pizza');
  });

  it('should provide industry-appropriate avoid words', () => {
    const saasHints = generateAIHints(saasTemplate, 'SaaS platform');
    const ecommerceHints = generateAIHints(ecommerceTemplate, 'Online store');

    expect(saasHints.avoidWords).toContain('revolutionary');
    expect(ecommerceHints.avoidWords).toContain('lowest price');
  });
});