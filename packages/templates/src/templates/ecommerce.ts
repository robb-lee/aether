import { Template } from '../types/template';

export const ecommerceTemplate: Template = {
  id: 'ecommerce-conversion',
  name: 'E-commerce Store',
  description: 'Conversion-optimized template for online stores with shopping focus',
  industry: 'ecommerce',
  sections: [
    {
      componentId: 'hero-product',
      defaultProps: {
        layout: 'productFocus',
        showOffer: true,
        showBadges: true
      },
      aiHints: {
        contentTone: 'Exciting and compelling',
        targetAudience: 'Online shoppers and potential customers',
        keyMessages: ['Special offers', 'Quality products', 'Easy shopping'],
        preferredSections: ['hero offer', 'product highlight', 'shop now']
      },
      required: true,
      order: 1
    },
    {
      componentId: 'product-categories',
      defaultProps: {
        layout: 'grid',
        showImages: true,
        columns: 4
      },
      aiHints: {
        contentTone: 'Clear and organized',
        keyMessages: ['Product variety', 'Easy navigation', 'Category benefits']
      },
      required: true,
      order: 2
    },
    {
      componentId: 'featured-products',
      defaultProps: {
        layout: 'carousel',
        showPrices: true,
        showRatings: true
      },
      aiHints: {
        contentTone: 'Persuasive and detailed',
        keyMessages: ['Best sellers', 'Customer favorites', 'Limited time deals']
      },
      required: true,
      order: 3
    },
    {
      componentId: 'testimonials-reviews',
      defaultProps: {
        layout: 'masonry',
        showRatings: true,
        showPhotos: true
      },
      aiHints: {
        contentTone: 'Authentic customer voices',
        keyMessages: ['Product satisfaction', 'Shopping experience', 'Trust signals']
      },
      required: false,
      order: 4
    },
    {
      componentId: 'newsletter-signup',
      defaultProps: {
        style: 'popup',
        showDiscount: true,
        collectPreferences: true
      },
      aiHints: {
        contentTone: 'Enticing with clear value',
        keyMessages: ['Exclusive offers', 'Early access', 'Personalized deals']
      },
      required: true,
      order: 5
    }
  ],
  defaultCustomization: {
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#374151'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans'
    },
    spacing: {
      padding: '1rem',
      margin: '0.75rem'
    },
    borderRadius: '0.375rem'
  },
  aiHints: {
    contentTone: 'Persuasive, trustworthy, and customer-focused',
    targetAudience: 'Online shoppers, deal seekers, brand enthusiasts',
    keyMessages: [
      'High-quality products at great prices',
      'Fast and reliable shipping',
      'Excellent customer service',
      'Secure and easy checkout process'
    ],
    preferredSections: [
      'product showcase',
      'special offers',
      'customer reviews',
      'category navigation',
      'trust signals'
    ],
    seoKeywords: [
      'online store',
      'ecommerce',
      'shopping',
      'products',
      'deals',
      'free shipping',
      'customer reviews'
    ],
    callToActionStyle: 'urgent'
  },
  tags: ['ecommerce', 'shopping', 'conversion', 'retail', 'products']
};