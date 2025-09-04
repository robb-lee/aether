/**
 * FAQ Section Component
 * 
 * Expandable FAQ section with search and categories
 */

import React from 'react';
import { EditableElement } from '../shared/EditableElement';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  showSearch?: boolean;
  showCategories?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about our services",
  showSearch = true,
  showCategories = false,
  faqs = [
    {
      question: "How does your service work?",
      answer: "Our platform uses advanced AI technology to analyze your requirements and deliver customized solutions within 30 seconds.",
      category: "General"
    },
    {
      question: "What's included in the free trial?",
      answer: "The free trial includes full access to all features for 14 days, with no credit card required.",
      category: "Pricing"
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.",
      category: "Pricing"
    },
    {
      question: "Do you offer customer support?",
      answer: "We provide 24/7 customer support through chat, email, and phone for all paid plans.",
      category: "Support"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption and SOC 2 Type II compliance.",
      category: "Security"
    },
    {
      question: "Can I integrate with other tools?",
      answer: "Yes, we offer integrations with 100+ popular tools including Slack, Zoom, Google Workspace, and more.",
      category: "Integrations"
    }
  ]
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="py-16 px-4 bg-gray-50" role="region" aria-label="Frequently asked questions">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <EditableElement
            as="h2"
            className="text-3xl font-bold mb-4 text-gray-900"
            ariaLevel={2}
          >
            {title}
          </EditableElement>
          
          <EditableElement
            as="p"
            className="text-xl text-gray-600"
          >
            {subtitle}
          </EditableElement>
        </div>
        
        {/* Search and Filters */}
        {(showSearch || showCategories) && (
          <div className="mb-8 space-y-4">
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search frequently asked questions"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
            
            {showCategories && categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category as string)}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openItems.has(index);
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Didn't find what you're looking for?
          </p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;