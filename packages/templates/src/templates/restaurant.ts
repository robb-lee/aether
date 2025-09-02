import { Template } from '../types/template';

export const restaurantTemplate: Template = {
  id: 'restaurant-appetizing',
  name: 'Restaurant & Dining',
  description: 'Appetizing template for restaurants with visual focus and reservations',
  industry: 'restaurant',
  sections: [
    {
      componentId: 'hero-visual',
      defaultProps: {
        layout: 'fullscreen',
        overlay: 'dark',
        showHours: true
      },
      aiHints: {
        contentTone: 'Warm and inviting',
        targetAudience: 'Potential diners and food enthusiasts',
        keyMessages: ['Appetizing visuals', 'Atmosphere', 'Dining experience'],
        preferredSections: ['restaurant name', 'cuisine type', 'reservation call']
      },
      required: true,
      order: 1
    },
    {
      componentId: 'menu-showcase',
      defaultProps: {
        layout: 'categories',
        showPrices: true,
        showImages: true
      },
      aiHints: {
        contentTone: 'Descriptive and appetizing',
        keyMessages: ['Signature dishes', 'Fresh ingredients', 'Chef specialties']
      },
      required: true,
      order: 2
    },
    {
      componentId: 'about-story',
      defaultProps: {
        layout: 'imageRight',
        showChef: true,
        showHistory: true
      },
      aiHints: {
        contentTone: 'Personal and authentic',
        keyMessages: ['Restaurant story', 'Chef background', 'Food philosophy']
      },
      required: true,
      order: 3
    },
    {
      componentId: 'reservation-form',
      defaultProps: {
        style: 'elegant',
        showAvailability: true,
        showSpecialRequests: true
      },
      aiHints: {
        contentTone: 'Professional and accommodating',
        keyMessages: ['Easy booking', 'Special occasions', 'Personalized service']
      },
      required: true,
      order: 4
    },
    {
      componentId: 'location-contact',
      defaultProps: {
        showMap: true,
        showHours: true,
        showParking: true
      },
      aiHints: {
        contentTone: 'Clear and helpful',
        keyMessages: ['Easy to find', 'Convenient location', 'Contact information']
      },
      required: true,
      order: 5
    }
  ],
  defaultCustomization: {
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#F59E0B',
      background: '#FEF7ED',
      text: '#1F2937'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato'
    },
    spacing: {
      padding: '1.5rem',
      margin: '1rem'
    },
    borderRadius: '0.5rem'
  },
  aiHints: {
    contentTone: 'Warm, appetizing, and hospitality-focused',
    targetAudience: 'Food lovers, diners, special occasion celebrants',
    keyMessages: [
      'Exceptional dining experience',
      'Fresh, quality ingredients',
      'Warm and welcoming atmosphere',
      'Perfect for special occasions'
    ],
    preferredSections: [
      'restaurant atmosphere',
      'signature dishes',
      'chef story',
      'reservation system',
      'location and hours'
    ],
    seoKeywords: [
      'restaurant',
      'dining',
      'cuisine',
      'reservations',
      'local restaurant',
      'fine dining',
      'chef special'
    ],
    callToActionStyle: 'friendly'
  },
  tags: ['restaurant', 'dining', 'food', 'hospitality', 'visual']
};