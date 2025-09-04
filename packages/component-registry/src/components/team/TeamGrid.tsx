/**
 * Team Grid Component
 * 
 * Team member showcase in grid layout
 */

import React from 'react';
import { EditableElement } from '../shared/EditableElement';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface TeamGridProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

export const TeamGrid: React.FC<TeamGridProps> = ({
  title = "Meet Our Team",
  subtitle = "The experts behind our success",
  members = [
    {
      name: "Alex Thompson",
      role: "CEO & Founder",
      bio: "10+ years building innovative products",
      social: { linkedin: "#", email: "alex@company.com" }
    },
    {
      name: "Sarah Kim",
      role: "Head of Product",
      bio: "Former Google PM with expertise in user experience",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "David Martinez",
      role: "Lead Engineer",
      bio: "Full-stack expert specializing in scalable systems",
      social: { linkedin: "#", email: "david@company.com" }
    },
    {
      name: "Lisa Wang",
      role: "Head of Design",
      bio: "Award-winning designer focused on user-centered products",
      social: { linkedin: "#", twitter: "#" }
    }
  ]
}) => {
  return (
    <section className="py-16 px-4 bg-white" role="region" aria-label="Team members">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="relative mb-4">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={`${member.name} - ${member.role}`}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                  />
                ) : (
                  <div 
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                    role="img"
                    aria-label={`${member.name} placeholder avatar`}
                  >
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              
              <p className="text-blue-600 font-medium mb-2">
                {member.role}
              </p>
              
              {member.bio && (
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>
              )}
              
              {member.social && (
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={`${member.name} LinkedIn profile`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label={`${member.name} Twitter profile`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.social.email && (
                    <a 
                      href={`mailto:${member.social.email}`}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;