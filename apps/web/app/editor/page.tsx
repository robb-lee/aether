'use client';

import React from 'react';
import { Canvas } from '@aether/editor-core';

// Sample component tree for testing
const sampleComponentTree = {
  id: 'root',
  type: 'page',
  props: {
    title: 'Sample Page'
  },
  children: [
    {
      id: 'hero-1',
      type: 'hero',
      props: {
        title: 'Welcome to Aether',
        description: 'AI-powered website builder',
        ctaText: 'Get Started'
      },
      position: { x: 50, y: 50 },
      size: { width: 400, height: 200 }
    },
    {
      id: 'features-1',
      type: 'features',
      props: {
        title: 'Key Features',
        features: [
          { title: '30-second generation', description: 'Lightning fast' },
          { title: 'AI-powered', description: 'Smart content creation' }
        ]
      },
      position: { x: 50, y: 300 },
      size: { width: 600, height: 300 }
    }
  ]
};

export default function EditorPage() {
  const handleSelectionChange = (selectedIds: string[]) => {
    // Selection change handler - could add state management here
  };

  const handleComponentUpdate = (componentId: string, updates: any) => {
    // Component update handler - could add state management here
  };

  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="h-full flex flex-col">
        {/* Editor Header */}
        <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-gray-900">Aether Editor</h1>
            <div className="text-sm text-gray-500">Untitled Site</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Preview
            </button>
            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
              Publish
            </button>
          </div>
        </header>

        {/* Editor Main */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Component Library */}
          <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Components</h3>
            <div className="space-y-2">
              <div className="p-2 border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-50">
                Hero Section
              </div>
              <div className="p-2 border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-50">
                Features Grid
              </div>
              <div className="p-2 border border-gray-200 rounded text-sm cursor-pointer hover:bg-gray-50">
                Text Block
              </div>
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 bg-gray-100">
            <Canvas
              componentTree={sampleComponentTree}
              onSelectionChange={handleSelectionChange}
              onComponentUpdate={handleComponentUpdate}
              onComponentTreeChange={() => {}}
              renderComponent={() => <div>Component</div>}
              className="w-full h-full"
            />
          </main>

          {/* Right Sidebar - Properties Panel */}
          <aside className="w-64 bg-white border-l border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Properties</h3>
            <div className="text-sm text-gray-500">
              Select a component to edit its properties
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}