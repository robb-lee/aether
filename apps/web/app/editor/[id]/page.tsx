'use client'

import { useState } from 'react'

export default function EditorPage({ params }: { params: { id: string } }) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar - Components */}
      <div className="w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Components</h2>
          <div className="mt-4 space-y-2">
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Text</span>
              </div>
            </button>
            
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Image</span>
              </div>
            </button>
            
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Button</span>
              </div>
            </button>
            
            <button className="w-full rounded-lg border border-gray-300 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Section</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              </button>
              <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                Preview
              </button>
              <button 
                onClick={() => setIsSaving(true)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm text-white hover:from-blue-700 hover:to-purple-700">
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="min-h-screen bg-white p-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Visual Editor</h3>
              <p className="mt-1 text-sm text-gray-500">
                Site ID: {params.id}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop components to build your site
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Properties</h2>
          {selectedElement ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Enter text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </div>
    </div>
  )
}