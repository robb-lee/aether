'use client';
import React, { useState, useEffect } from 'react';
import { designKits, getKitCSSVariables } from '@aether/component-registry/design-system';
import { 
  FeaturesGrid,
  FeaturesCards, 
  HeaderSimple, 
  NavMegaMenu,
  HeroCentered,
  HeroEnterprise,
  HeroSplit,
  HeroVideoBg,
  ContactForm,
  FAQSection,
  CTASimple,
  LogoCarousel,
  LogoGrid,
  FooterEnterprise,
  StatsSection,
  TestimonialsSlider,
  PricingTable,
  TeamGrid,
  PortfolioGallery,
  BlogGrid,
  Timeline
} from '@aether/component-registry';

// Simple inline components for visual showcase

// 3. Features Components






// 3. Social Proof Components



// 4. Business Components



// 5. Content Components  


// 6. Footer Component removed - using registry component

// Theme Selector Component
function ThemeSelector({ 
  currentTheme, 
  onThemeChange 
}: { 
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const themeDisplayNames = {
    'modern-saas': 'Modern SaaS',
    'corporate': 'Corporate',  
    'creative-agency': 'Creative Agency',
    'e-commerce': 'E-commerce',
    'startup': 'Startup'
  };

  const themeColors = {
    'modern-saas': { primary: '#6366f1', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    'corporate': { primary: '#1e3a8a', bg: '#ffffff' },
    'creative-agency': { primary: '#ff006e', bg: 'linear-gradient(45deg, #ff006e 0%, #8338ec 50%, #ffbe0b 100%)' },
    'e-commerce': { primary: '#dc2626', bg: '#ffffff' },
    'startup': { primary: '#3b82f6', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">🎨 테마 선택</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: themeColors[currentTheme as keyof typeof themeColors]?.primary }}
              />
              <span className="text-sm font-medium">
                {themeDisplayNames[currentTheme as keyof typeof themeDisplayNames]}
              </span>
            </div>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {isOpen && (
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(designKits).map(([kitId, kit]) => (
              <button
                key={kitId}
                onClick={() => {
                  onThemeChange(kitId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  currentTheme === kitId ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeColors[kitId as keyof typeof themeColors]?.primary }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {themeDisplayNames[kitId as keyof typeof themeDisplayNames]}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {kit.targetIndustry.join(', ')}
                  </div>
                </div>
                {currentTheme === kitId && (
                  <div className="text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        
        <div className="p-3 bg-gray-50 text-xs text-gray-600 border-t border-gray-100">
          테마를 선택하면 모든 컴포넌트에 즉시 적용됩니다
        </div>
      </div>
    </div>
  );
}

export default function WorkingShowcasePage() {
  const [currentTheme, setCurrentTheme] = useState('modern-saas');
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('aether-theme');
    if (savedTheme && designKits[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  
  // Apply theme CSS variables when theme changes
  useEffect(() => {
    const cssVariables = getKitCSSVariables(currentTheme);
    const root = document.documentElement;
    
    // Apply all CSS variables to the root element
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Save theme to localStorage
    localStorage.setItem('aether-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-background" style={{ transition: 'all 0.3s ease-in-out' }}>
      {/* Theme Selector */}
      <ThemeSelector 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
      
      {/* Page Header */}
      <div className="py-16" style={{ 
        background: 'var(--primary, #6366f1)',
        color: 'white',
        transition: 'all 0.3s ease-in-out'
      }}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Aether Component Visual Showcase</h1>
          <p className="text-xl opacity-90 mb-4">
            실제 컴포넌트들을 눈으로 확인할 수 있는 페이지 - Working demo components
          </p>
          <div className="text-sm opacity-75 bg-white/10 backdrop-blur-sm inline-block px-4 py-2 rounded-lg">
            🎨 우측 상단에서 테마를 변경해보세요! · Change themes from top-right selector!
          </div>
        </div>
      </div>

      {/* Component Showcase */}
      <div className="space-y-24 py-16">
        
        {/* Navigation Components */}
        <ComponentSection 
          title="Navigation Components" 
          description="Headers and navigation menus - 헤더 및 네비게이션"
        >
          <div className="space-y-8">
            <ComponentDemo title="Header Simple" componentId="header-simple">
              <HeaderSimple 
                logoText="Aether"
                navigation={[
                  { label: 'Home', href: '#' },
                  { label: 'Features', href: '#' },
                  { label: 'Pricing', href: '#' },
                  { label: 'About', href: '#' }
                ]}
                style="minimal"
                transparent={false}
              />
            </ComponentDemo>
            
            <div className="border border-gray-200 rounded-xl overflow-visible bg-white shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Navigation Mega Menu</h3>
                  <code className="text-sm bg-white px-2 py-1 rounded text-gray-600 border">
                    nav-mega-menu
                  </code>
                </div>
              </div>
              <div className="p-0 min-h-[400px] relative">
                <NavMegaMenu 
                  logoText="Enterprise"
                  megaMenuConfig={{
                  'Products': [
                    {
                      title: 'Platform',
                      items: [
                        { id: '1', label: 'Website Builder', href: '#', description: 'Create stunning websites' },
                        { id: '2', label: 'AI Engine', href: '#', description: 'Powered by AI' },
                        { id: '3', label: 'Templates', href: '#', description: 'Pre-built templates' }
                      ]
                    },
                    {
                      title: 'Features',
                      items: [
                        { id: '4', label: 'Drag & Drop', href: '#', description: 'Visual editor' },
                        { id: '5', label: 'SEO Tools', href: '#', description: 'Optimize for search' },
                        { id: '6', label: 'Analytics', href: '#', description: 'Track performance' }
                      ]
                    }
                  ],
                  'Solutions': [
                    {
                      title: 'By Industry',
                      items: [
                        { id: '7', label: 'E-commerce', href: '#', description: 'Online stores' },
                        { id: '8', label: 'SaaS', href: '#', description: 'Software companies' },
                        { id: '9', label: 'Portfolio', href: '#', description: 'Creative professionals' }
                      ]
                    }
                  ]
                }}
                showSearch={true}
                showLanguageSelector={true}
                ctaButtons={[
                  { label: 'Contact Sales', href: '#', variant: 'primary' }
                ]}
              />
              </div>
            </div>
          </div>
        </ComponentSection>
        
        {/* Hero Components */}
        <ComponentSection 
          title="Hero Components" 
          description="Above-the-fold content sections - 메인 히어로 섹션들"
        >
          <div className="space-y-8">
            <ComponentDemo title="Hero Centered" componentId="hero-centered">
              <HeroCentered 
                title="Build Something Amazing"
                subtitle="Transform your ideas into reality with our powerful platform"
                ctaText="Get Started"
                ctaHref="#"
                secondaryCtaText="Learn More"
                secondaryCtaHref="#"
                variant="center"
                style="minimal"
                animation="fade-in"
              />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Split" componentId="hero-split">
              <HeroSplit 
                title="The Future of Web Development"
                subtitle="Create stunning websites in seconds with AI-powered generation"
                description="Experience the power of AI-driven web development with instant deployment and visual editing capabilities."
                ctaText="Start Building"
                ctaHref="#"
                secondaryCtaText="View Demo"
                secondaryCtaHref="#"
                imageUrl="/api/placeholder/600/400"
                imageAlt="Platform preview"
                layout="left-content"
                style="modern"
                animation="slide-in"
                showDemo={false}
              />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Video Background" componentId="hero-video-bg">
              <HeroVideoBg 
                title="Experience the Future"
                subtitle="Immersive digital experiences that captivate and convert"
                ctaText="Watch Demo"
                ctaHref="#"
                secondaryCtaText="Learn More"
                secondaryCtaHref="#"
                videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                style="cinematic"
                animation="video-fade"
                layout="overlay-center"
                autoplay={true}
                muted={true}
                loop={true}
              />
            </ComponentDemo>
            
            <ComponentDemo title="Hero Enterprise" componentId="hero-enterprise">
              <HeroEnterprise 
                trustBadge={{ text: "Backed by YC" }}
                title="Enterprise-Grade AI Platform"
                description="Trusted by Fortune 500 companies to accelerate digital transformation with cutting-edge AI technology"
                primaryCta={{
                  text: "Request Demo",
                  href: "#"
                }}
                secondaryCta={{
                  text: "View Case Studies",
                  href: "#"
                }}
                backgroundVariant="gradient"
                layout="split"
                showProductDiagram={true}
              />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Feature Components */}
        <ComponentSection 
          title="Feature Components" 
          description="Showcase product features - 기능 소개 섹션들"
        >
          <div className="space-y-8">
            <ComponentDemo title="Features Grid" componentId="features-grid">
              <FeaturesGrid
                title="Powerful Features"
                subtitle="EVERYTHING YOU NEED"
                description="Comprehensive tools and capabilities to help you succeed."
                features={[
                  {
                    title: "AI Generation",
                    description: "Create stunning websites with advanced AI that understands your vision.",
                    dotColor: "var(--brand-600)",
                    decoColor: "var(--accent)",
                    href: "#"
                  },
                  {
                    title: "Instant Deployment",
                    description: "Go live immediately with our seamless deployment infrastructure.",
                    dotColor: "var(--brand-600)",
                    href: "#"
                  },
                  {
                    title: "Visual Editor",
                    description: "Fine-tune every detail with our intuitive drag-and-drop interface.",
                    dotColor: "#f59e0b",
                    href: "#"
                  },
                  {
                    title: "Performance Optimized",
                    description: "Lightning-fast websites with 90+ Lighthouse scores guaranteed.",
                    dotColor: "#22c55e",
                    href: "#"
                  }
                ]}
                layout="auto"
              />
            </ComponentDemo>
            
            <ComponentDemo title="Features Cards" componentId="features-cards">
              <FeaturesCards 
                title="Advanced Features"
                subtitle="Professional-grade tools designed for modern web development"
                features={[
                  {
                    title: "AI-Powered Generation",
                    description: "Create stunning websites with advanced AI that understands your vision and transforms ideas into reality.",
                    icon: "🤖",
                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop&crop=center"
                  },
                  {
                    title: "Lightning Fast Performance",
                    description: "Optimized for speed with 90+ Lighthouse scores and blazing-fast loading times across all devices.",
                    icon: "⚡",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center"
                  },
                  {
                    title: "Visual Drag & Drop Editor",
                    description: "Intuitive visual editor that lets you customize every detail without writing a single line of code.",
                    icon: "🎨",
                    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=300&fit=crop&crop=center"
                  }
                ]}
                layout="vertical"
                style="shadowed"
                overlayOpacity={0.55}
              />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Social Proof Components */}
        <ComponentSection 
          title="Social Proof Components" 
          description="Testimonials and trust signals - 고객 후기 및 신뢰 신호"
        >
          <div className="space-y-8">
            <ComponentDemo title="Testimonials Slider" componentId="testimonials-slider">
              <TestimonialsSlider 
          title="What Our Customers Say"
          testimonials={[
            {
              content: "Aether transformed our web presence in minutes. The AI understood exactly what we needed and delivered beyond our expectations.",
              name: "Sarah Johnson",
              company: "TechStart",
              rating: 5
            },
            {
              content: "Incredible speed and quality. We launched 5 client websites in a single day using this platform.",
              name: "Michael Chen",
              company: "DesignCo",
              rating: 5
            },
            {
              content: "The visual editor is intuitive and powerful. Perfect for our design workflow and client presentations.",
              name: "Emily Rodriguez",
              company: "Pixel Perfect",
              rating: 5
            }
          ]}
          autoSlide={true}
          slideInterval={5000}
        />
            </ComponentDemo>
            
            <ComponentDemo title="Logo Carousel" componentId="logo-carousel">
              <LogoCarousel 
                title="Trusted by Industry Leaders"
                logos={[
                  { name: 'Microsoft', src: '/logos/microsoft.svg', alt: 'Microsoft' },
                  { name: 'Google', src: '/logos/google.svg', alt: 'Google' },
                  { name: 'Amazon', src: '/logos/amazon.svg', alt: 'Amazon' },
                  { name: 'Tesla', src: '/logos/tesla.svg', alt: 'Tesla' },
                  { name: 'Apple', src: '/logos/apple.svg', alt: 'Apple' },
                  { name: 'Meta', src: '/logos/meta.svg', alt: 'Meta' }
                ]}
                speed="normal"
                direction="left"
                pauseOnHover={true}
                showTitle={true}
                variant="grayscale"
                spacing="normal"
                height="md"
              />
            </ComponentDemo>
            
            <ComponentDemo title="Logo Grid" componentId="logo-grid">
              <LogoGrid 
                title="Trusted Partners"
                logos={[
                  { name: 'Microsoft', src: '/logos/microsoft.svg', alt: 'Microsoft' },
                  { name: 'Google', src: '/logos/google.svg', alt: 'Google' },
                  { name: 'Amazon', src: '/logos/amazon.svg', alt: 'Amazon' },
                  { name: 'Tesla', src: '/logos/tesla.svg', alt: 'Tesla' },
                  { name: 'Apple', src: '/logos/apple.svg', alt: 'Apple' },
                  { name: 'Meta', src: '/logos/meta.svg', alt: 'Meta' },
                  { name: 'Netflix', src: '/logos/netflix.svg', alt: 'Netflix' },
                  { name: 'Spotify', src: '/logos/spotify.svg', alt: 'Spotify' }
                ]}
                showTitle={true}
                variant="grayscale"
                columns={4}
              />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Business Components */}
        <ComponentSection 
          title="Business Components" 
          description="Pricing, team, and portfolio sections - 가격, 팀, 포트폴리오"
        >
          <div className="space-y-8">
            <ComponentDemo title="Pricing Table" componentId="pricing-table">
              <PricingTable 
          title="Choose Your Plan"
          subtitle="Pricing That Scales"
          currency="$"
          plans={[
            {
              name: "Starter",
              price: "9",
              period: "month",
              description: "Perfect for individuals and small projects",
              features: ["5 websites", "AI generation", "Basic support", "SSL included"],
              highlighted: false,
              ctaText: "Start Free Trial"
            },
            {
              name: "Professional",
              price: "29",
              period: "month",
              description: "Ideal for growing businesses",
              features: ["25 websites", "Advanced AI", "Priority support", "Custom domains", "Analytics"],
              highlighted: true,
              ctaText: "Get Started"
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              description: "For large organizations",
              features: ["Unlimited websites", "White-label", "24/7 support", "API access", "SLA guarantee"],
              highlighted: false,
              ctaText: "Contact Sales"
            }
          ]}
        />
            </ComponentDemo>
            
            <ComponentDemo title="Team Grid" componentId="team-grid">
              <TeamGrid 
              title="Meet Our Team"
              subtitle="The People Behind Aether"
              members={[
                {
                  name: "Alex Thompson",
                  role: "Founder & CEO",
                  bio: "Former Google AI researcher with 10+ years in machine learning.",
                  social: { linkedin: "#", twitter: "#" }
                },
                {
                  name: "Maria Garcia",
                  role: "CTO",
                  bio: "Full-stack architect specializing in scalable AI systems.",
                  social: { linkedin: "#" }
                },
                {
                  name: "David Kim",
                  role: "Head of Design",
                  bio: "Design systems expert with experience at Airbnb and Figma.",
                  social: { linkedin: "#" }
                }
              ]}
            />
            </ComponentDemo>
            
            <ComponentDemo title="Portfolio Gallery" componentId="portfolio-gallery">
              <PortfolioGallery 
              title="Our Portfolio"
              subtitle="Stunning projects created with our platform"
              showFilters={false}
              items={[
                { title: "E-commerce Store", category: "Web Design", image: "https://picsum.photos/600/400?random=10", description: "Beautiful design crafted with attention to detail" },
                { title: "SaaS Dashboard", category: "UI/UX", image: "https://picsum.photos/600/400?random=11", description: "Beautiful design crafted with attention to detail" },
                { title: "Mobile App", category: "App Design", image: "https://picsum.photos/600/400?random=12", description: "Beautiful design crafted with attention to detail" },
                { title: "Brand Identity", category: "Branding", image: "https://picsum.photos/600/400?random=13", description: "Beautiful design crafted with attention to detail" },
                { title: "Landing Page", category: "Web Design", image: "https://picsum.photos/600/400?random=14", description: "Beautiful design crafted with attention to detail" },
                { title: "Blog Platform", category: "Content", image: "https://picsum.photos/600/400?random=15", description: "Beautiful design crafted with attention to detail" }
              ]}
            />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Contact Components */}
        <ComponentSection 
          title="Contact Components" 
          description="Contact forms - 연락처 폼 섹션들"
        >
          <ComponentDemo title="Contact Form" componentId="contact-form">
            <ContactForm 
              title="Get In Touch"
              subtitle="Have questions? We're here to help. Send us a message and we'll respond within 24 hours."
              onSubmit={(data) => {
                console.log('Form submitted:', data);
              }}
            />
          </ComponentDemo>
        </ComponentSection>

        {/* Content Components */}
        <ComponentSection 
          title="Content Components" 
          description="FAQ, stats, blog, and timeline - FAQ, 통계, 블로그, 타임라인"
        >
          <div className="space-y-8">
            <ComponentDemo title="FAQ Section" componentId="faq-section">
              <FAQSection 
                title="Frequently Asked Questions"
                subtitle="Everything You Need to Know"
                faqs={[
                  {
                    question: "How fast can I create a website?",
                    answer: "With Aether, you can have a professional website ready in 30 seconds. Just describe what you want, and our AI handles the rest."
                  },
                  {
                    question: "Can I customize the generated website?",
                    answer: "Absolutely! Our visual editor lets you modify every element. You can change colors, text, images, and layout with simple drag-and-drop."
                  },
                  {
                    question: "What about hosting and domains?",
                    answer: "All plans include free hosting and SSL certificates. Custom domains are available on Professional and Enterprise plans."
                  },
                  {
                    question: "Do I need coding skills?",
                    answer: "No coding skills required! Our AI and visual editor handle everything. However, developers can access and modify the code if needed."
                  }
                ]}
                showSearch={false}
                showCategories={false}
              />
            </ComponentDemo>
            
            <ComponentDemo title="Stats Section" componentId="stats-section">
              <StatsSection 
          title="Trusted by Thousands"
          subtitle="Our Impact"
          stats={[
            { value: "50,000+", label: "Websites Created", description: "Successfully deployed" },
            { value: "99.9%", label: "Uptime", description: "Reliable service" },
            { value: "30sec", label: "Average Generation Time", description: "Lightning fast" },
            { value: "95+", label: "Average Lighthouse Score", description: "Top performance" }
          ]}
          layout="grid"
          animated={true}
        />
            </ComponentDemo>
            
            <ComponentDemo title="Blog Grid" componentId="blog-grid">
              <BlogGrid 
            title="Latest from Our Blog"
            subtitle="Insights, tutorials, and industry trends"
            showCategories={false}
            posts={[
              {
                title: "The Future of AI in Web Design",
                excerpt: "Discover how artificial intelligence is revolutionizing the way we create and design websites...",
                author: "Tech Team",
                publishedAt: "Dec 15, 2024",
                readTime: "5 min read",
                category: "AI & Design",
                image: "https://picsum.photos/800/450?random=1"
              },
              {
                title: "10 Essential UX Principles for Modern Websites",
                excerpt: "Learn the fundamental user experience principles that every modern website should implement...",
                author: "Design Team",
                publishedAt: "Dec 12, 2024",
                readTime: "8 min read",
                category: "UX Design",
                image: "https://picsum.photos/800/450?random=2"
              },
              {
                title: "Building High-Performance Websites",
                excerpt: "Best practices and techniques to ensure your website loads fast and performs optimally...",
                author: "Dev Team",
                publishedAt: "Dec 10, 2024",
                readTime: "6 min read",
                category: "Performance",
                image: "https://picsum.photos/800/450?random=3"
              },
              {
                title: "SEO Guide for Modern Web Development",
                excerpt: "Complete guide to search engine optimization for contemporary web applications...",
                author: "Marketing Team",
                publishedAt: "Dec 8, 2024",
                readTime: "10 min read",
                category: "SEO",
                image: "https://picsum.photos/800/450?random=4"
              }
            ]}
          />
            </ComponentDemo>
            
            <ComponentDemo title="Timeline" componentId="timeline">
              <Timeline 
            title="Our Journey"
            subtitle="Milestones in our mission to revolutionize web creation"
            orientation="vertical"
            items={[
              {
                title: "AI Revolution",
                description: "Launch of advanced AI website generation with 30-second creation time",
                date: "2024",
                status: "upcoming",
                icon: "ai"
              },
              {
                title: "Enterprise Expansion",
                description: "Introduced enterprise-grade features and security compliance",
                date: "2023",
                status: "current",
                icon: "globe"
              },
              {
                title: "Visual Editor Launch",
                description: "Released intuitive drag-and-drop editor for post-generation customization",
                date: "2022",
                status: "completed",
                icon: "product"
              },
              {
                title: "Platform Genesis",
                description: "Founded with the vision to democratize professional web design",
                date: "2021",
                status: "completed",
                icon: "rocket"
              }
            ]}
          />
            </ComponentDemo>
          </div>
        </ComponentSection>

        {/* Call-to-Action Components */}
        <ComponentSection 
          title="Call-to-Action Components" 
          description="Conversion-focused sections - 행동 유도 섹션들"
        >
          <ComponentDemo title="CTA Simple" componentId="cta-simple">
            <CTASimple 
              title="Ready to Build Your Website?"
              description="Join thousands of users who've already transformed their web presence with AI."
              ctaText="Start Building Free"
              ctaHref="#"
              style="invert"
              layout="center"
              rounded={true}
              bleed={false}
              overlayOpacity={0.6}
            />
          </ComponentDemo>
        </ComponentSection>
        
        {/* Footer Components */}
        <ComponentSection 
          title="Footer Components" 
          description="Website footers - 웹사이트 푸터"
        >
          <ComponentDemo title="Footer Enterprise" componentId="footer-enterprise">
            <FooterEnterprise 
              logoText="Aether"
              companyName="Aether"
              showSocialSection={true}
            />
          </ComponentDemo>
        </ComponentSection>

      </div>

      {/* Footer Note */}
      <div className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>
            ✅ <strong>전체 21개 컴포넌트 완성!</strong> 이제 모든 컴포넌트의 시각적 모습과 상호작용을 확인할 수 있습니다.
            <br />
            <strong>Complete 21 Components Showcase!</strong> All components with visual preview and interactions.
          </p>
          <div className="mt-4 text-sm">
            <strong>Categories:</strong> Navigation (2) • Hero (4) • Features (2) • Social Proof (3) • Business (3) • Contact (1) • Content (4) • CTA (1) • Footer (1)
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ComponentSection({ 
  title, 
  description, 
  children 
}: { 
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ComponentDemo({ 
  title, 
  componentId, 
  children 
}: { 
  title: string;
  componentId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <code className="text-sm bg-white px-2 py-1 rounded text-gray-600 border">
            {componentId}
          </code>
        </div>
      </div>
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}