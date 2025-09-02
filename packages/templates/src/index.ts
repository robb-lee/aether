import { Template, TemplateMatch, TemplateCustomization } from './types/template';
import { saasTemplate } from './templates/saas';
import { portfolioTemplate } from './templates/portfolio';
import { ecommerceTemplate } from './templates/ecommerce';
import { blogTemplate } from './templates/blog';
import { restaurantTemplate } from './templates/restaurant';

export class TemplateManager {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.registerTemplates();
  }

  private registerTemplates(): void {
    const templates = [
      saasTemplate,
      portfolioTemplate,
      ecommerceTemplate,
      blogTemplate,
      restaurantTemplate
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getTemplateById(id: string): Template | null {
    return this.templates.get(id) || null;
  }

  getTemplatesByIndustry(industry: string): Template[] {
    return Array.from(this.templates.values())
      .filter(template => template.industry === industry);
  }

  findBestTemplate(prompt: string): TemplateMatch | null {
    const matches = this.analyzePrompt(prompt);
    return matches.length > 0 ? matches[0] : null;
  }

  findTemplateMatches(prompt: string, limit: number = 3): TemplateMatch[] {
    return this.analyzePrompt(prompt).slice(0, limit);
  }

  private analyzePrompt(prompt: string): TemplateMatch[] {
    const lowerPrompt = prompt.toLowerCase();
    const matches: TemplateMatch[] = [];

    for (const template of this.templates.values()) {
      const confidence = this.calculateConfidence(lowerPrompt, template);
      if (confidence > 0.3) {
        matches.push({
          template,
          confidence,
          reasons: this.getMatchReasons(lowerPrompt, template)
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateConfidence(prompt: string, template: Template): number {
    let score = 0;
    const factors = [];

    // Industry keyword matching
    if (prompt.includes(template.industry)) {
      score += 0.4;
      factors.push(`Industry match: ${template.industry}`);
    }

    // Tag matching
    template.tags.forEach(tag => {
      if (prompt.includes(tag)) {
        score += 0.2;
        factors.push(`Tag match: ${tag}`);
      }
    });

    // SEO keyword matching
    template.aiHints.seoKeywords.forEach(keyword => {
      if (prompt.includes(keyword)) {
        score += 0.15;
        factors.push(`Keyword match: ${keyword}`);
      }
    });

    // Key message alignment
    template.aiHints.keyMessages.forEach(message => {
      const messageWords = message.toLowerCase().split(' ');
      const matchingWords = messageWords.filter(word => prompt.includes(word));
      if (matchingWords.length > 0) {
        score += (matchingWords.length / messageWords.length) * 0.1;
        factors.push(`Message alignment: ${message}`);
      }
    });

    return Math.min(score, 1);
  }

  private getMatchReasons(prompt: string, template: Template): string[] {
    const reasons: string[] = [];

    if (prompt.includes(template.industry)) {
      reasons.push(`Matches ${template.industry} industry`);
    }

    template.tags.forEach(tag => {
      if (prompt.includes(tag)) {
        reasons.push(`Contains "${tag}" keyword`);
      }
    });

    template.aiHints.seoKeywords.forEach(keyword => {
      if (prompt.includes(keyword)) {
        reasons.push(`Relevant to "${keyword}"`);
      }
    });

    return reasons;
  }

  applyCustomization(template: Template, customization: Partial<TemplateCustomization>): Template {
    return {
      ...template,
      defaultCustomization: {
        ...template.defaultCustomization,
        ...customization,
        colors: {
          ...template.defaultCustomization.colors,
          ...customization.colors
        },
        fonts: {
          ...template.defaultCustomization.fonts,
          ...customization.fonts
        },
        spacing: {
          ...template.defaultCustomization.spacing,
          ...customization.spacing
        }
      }
    };
  }
}

// Export templates individually
export { saasTemplate } from './templates/saas';
export { portfolioTemplate } from './templates/portfolio';
export { ecommerceTemplate } from './templates/ecommerce';
export { blogTemplate } from './templates/blog';
export { restaurantTemplate } from './templates/restaurant';

// Export types
export * from './types/template';

// Export utilities
export { createCustomTheme, COLOR_PALETTES, FONT_PAIRS } from './utils/customization';
export { generateAIHints } from './utils/ai-hints';

// Export default instance
export const templateManager = new TemplateManager();