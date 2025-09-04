/**
 * Pricing Table Component
 * 
 * Professional pricing table with 3-tier structure
 */

import React from 'react';
import { EditableElement } from '../shared/EditableElement';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

interface PricingTableProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  currency?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  title = "Choose Your Plan",
  subtitle = "Flexible pricing for teams of all sizes",
  currency = "$",
  plans = [
    {
      name: "Starter",
      price: "29",
      period: "month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 users",
        "10GB storage",
        "Basic support",
        "Core features"
      ],
      ctaText: "Start Free Trial"
    },
    {
      name: "Professional", 
      price: "99",
      period: "month",
      description: "Best for growing businesses",
      features: [
        "Up to 25 users",
        "100GB storage", 
        "Priority support",
        "Advanced features",
        "Analytics dashboard",
        "API access"
      ],
      highlighted: true,
      ctaText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "299",
      period: "month", 
      description: "For large organizations",
      features: [
        "Unlimited users",
        "1TB storage",
        "24/7 support",
        "All features",
        "Custom integrations",
        "Dedicated account manager",
        "SSO & security"
      ],
      ctaText: "Contact Sales"
    }
  ]
}) => {
  return (
    <section className="py-16 px-4 bg-white" role="region" aria-label="Pricing plans">
      <div className="max-w-6xl mx-auto">
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
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {subtitle}
          </EditableElement>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-4">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-lg border-2 p-8 ${
                plan.highlighted 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-200`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{currency}{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8" role="list">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.ctaText || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            All plans include 30-day money-back guarantee. No setup fees.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;