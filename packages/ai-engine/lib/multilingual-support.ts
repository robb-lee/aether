/**
 * Multilingual Content Support
 * 
 * Provides language templates and cultural adaptations
 */

export interface LanguageConfig {
  code: string;
  name: string;
  rtl: boolean;
  culturalContext: {
    businessStyle: 'direct' | 'indirect' | 'formal' | 'casual';
    persuasionStyle: 'logical' | 'emotional' | 'authoritative' | 'relationship';
    urgencyTolerance: 'low' | 'medium' | 'high';
  };
  contentAdaptations: {
    headlines: string[];
    ctas: Record<string, string[]>;
    commonPhrases: Record<string, string>;
  };
}

export const supportedLanguages: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    rtl: false,
    culturalContext: {
      businessStyle: 'direct',
      persuasionStyle: 'logical',
      urgencyTolerance: 'high'
    },
    contentAdaptations: {
      headlines: [
        'Transform Your {business} with {solution}',
        'Scale Your {business} Operations',
        'Grow Your {business} Fast'
      ],
      ctas: {
        signup: ['Sign Up', 'Get Started', 'Join Now'],
        purchase: ['Buy Now', 'Order Today', 'Shop Now'],
        contact: ['Contact Us', 'Get in Touch', 'Reach Out']
      },
      commonPhrases: {
        'value_proposition': 'Get more value for your money',
        'social_proof': 'Join thousands of satisfied customers',
        'guarantee': 'Money-back guarantee'
      }
    }
  },
  ko: {
    code: 'ko',
    name: '한국어',
    rtl: false,
    culturalContext: {
      businessStyle: 'formal',
      persuasionStyle: 'relationship',
      urgencyTolerance: 'medium'
    },
    contentAdaptations: {
      headlines: [
        '{solution}으로 {business}를 혁신하세요',
        '{business} 성장을 위한 최고의 선택',
        '성공하는 {business}의 비밀'
      ],
      ctas: {
        signup: ['가입하기', '시작하기', '무료체험'],
        purchase: ['구매하기', '주문하기', '지금 구매'],
        contact: ['문의하기', '상담신청', '연락하기']
      },
      commonPhrases: {
        'value_proposition': '더 나은 가치를 경험하세요',
        'social_proof': '수천 명의 만족한 고객들과 함께하세요',
        'guarantee': '100% 만족 보장'
      }
    }
  },
  ja: {
    code: 'ja',
    name: '日本語',
    rtl: false,
    culturalContext: {
      businessStyle: 'formal',
      persuasionStyle: 'relationship',
      urgencyTolerance: 'low'
    },
    contentAdaptations: {
      headlines: [
        '{solution}で{business}を変革',
        '{business}の成長を支援',
        '信頼できる{solution}サービス'
      ],
      ctas: {
        signup: ['登録する', '始める', '無料体験'],
        purchase: ['購入する', '注文する', '今すぐ購入'],
        contact: ['お問い合わせ', 'ご相談', 'ご連絡']
      },
      commonPhrases: {
        'value_proposition': 'より良い価値をご提供',
        'social_proof': '多くのお客様にご満足いただいております',
        'guarantee': '満足保証制度'
      }
    }
  },
  zh: {
    code: 'zh',
    name: '中文',
    rtl: false,
    culturalContext: {
      businessStyle: 'direct',
      persuasionStyle: 'logical',
      urgencyTolerance: 'high'
    },
    contentAdaptations: {
      headlines: [
        '用{solution}改变您的{business}',
        '助力{business}快速增长',
        '专业的{solution}服务'
      ],
      ctas: {
        signup: ['注册', '开始使用', '免费试用'],
        purchase: ['立即购买', '马上订购', '现在购买'],
        contact: ['联系我们', '咨询', '获取信息']
      },
      commonPhrases: {
        'value_proposition': '为您提供更大价值',
        'social_proof': '数千客户的信赖选择',
        'guarantee': '满意保证'
      }
    }
  },
  es: {
    code: 'es',
    name: 'Español',
    rtl: false,
    culturalContext: {
      businessStyle: 'casual',
      persuasionStyle: 'emotional',
      urgencyTolerance: 'medium'
    },
    contentAdaptations: {
      headlines: [
        'Transforma tu {business} con {solution}',
        'Haz crecer tu {business} rápidamente',
        'La mejor {solution} para tu {business}'
      ],
      ctas: {
        signup: ['Registrarse', 'Empezar', 'Prueba Gratis'],
        purchase: ['Comprar Ahora', 'Ordenar Hoy', 'Comprar'],
        contact: ['Contáctanos', 'Hablar Ahora', 'Más Info']
      },
      commonPhrases: {
        'value_proposition': 'Obtén más valor por tu dinero',
        'social_proof': 'Miles de clientes satisfechos',
        'guarantee': 'Garantía de satisfacción'
      }
    }
  }
};

/**
 * Get language configuration
 */
export function getLanguageConfig(languageCode: string): LanguageConfig {
  return supportedLanguages[languageCode] || supportedLanguages.en;
}

/**
 * Generate language-specific content templates
 */
export function getLocalizedTemplate(
  language: string,
  templateType: 'headline' | 'cta' | 'phrase',
  context: Record<string, string> = {}
): string {
  const config = getLanguageConfig(language);
  
  switch (templateType) {
    case 'headline':
      const headline = config.contentAdaptations.headlines[0];
      return this.replaceTokens(headline, context);
      
    case 'cta':
      const ctaType = context.type || 'signup';
      return config.contentAdaptations.ctas[ctaType]?.[0] || 'Get Started';
      
    case 'phrase':
      const phraseType = context.type || 'value_proposition';
      return config.contentAdaptations.commonPhrases[phraseType] || '';
      
    default:
      return '';
  }
}

/**
 * Replace template tokens with actual values
 */
function replaceTokens(template: string, context: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return context[key] || match;
  });
}

/**
 * Detect appropriate language based on user context
 */
export function detectLanguage(context: {
  userAgent?: string;
  acceptLanguage?: string;
  country?: string;
  businessLocation?: string;
}): string {
  // Simple language detection based on available context
  if (context.acceptLanguage) {
    const lang = context.acceptLanguage.split(',')[0].split('-')[0];
    if (supportedLanguages[lang]) {
      return lang;
    }
  }
  
  if (context.country) {
    const countryLangMap: Record<string, string> = {
      'KR': 'ko', 'JP': 'ja', 'CN': 'zh', 'TW': 'zh',
      'ES': 'es', 'MX': 'es', 'AR': 'es',
      'FR': 'fr', 'DE': 'de'
    };
    return countryLangMap[context.country.toUpperCase()] || 'en';
  }
  
  return 'en'; // Default to English
}

export default {
  supportedLanguages,
  getLanguageConfig,
  getLocalizedTemplate,
  detectLanguage
};