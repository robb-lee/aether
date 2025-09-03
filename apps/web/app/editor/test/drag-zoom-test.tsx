'use client';

import { Canvas } from '@aether/editor-core';
import { useState } from 'react';
import { ComponentTreeNode } from '@aether/editor-core';

export default function DragZoomTest() {
  const [componentTree, setComponentTree] = useState<ComponentTreeNode>({
    id: 'root',
    type: 'page',
    position: { x: 0, y: 0 },
    children: []
  });

  const handleComponentUpdate = (componentId: string, updates: any) => {
    console.log('Component update:', componentId, updates);
    
    if (componentId === '__ADD_COMPONENT__') {
      // Add a new component at the drop position
      const newComponent: ComponentTreeNode = {
        id: `component-${Date.now()}`,
        type: updates.type || 'box',
        position: updates.position,
        size: { width: 200, height: 100 },
        props: {
          title: 'Dropped Component',
          description: `Position: ${Math.round(updates.position.x)}, ${Math.round(updates.position.y)}`
        }
      };
      
      setComponentTree(prev => ({
        ...prev,
        children: [...(prev.children || []), newComponent]
      }));
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Drag & Drop Zoom Test</h1>
        <p className="text-gray-600 mt-2">
          Instructions: Try zooming in/out using mouse wheel, then drag to create selection boxes.
          The box should appear exactly where you click, regardless of zoom level.
        </p>
        <div className="mt-4 flex gap-4">
          <div 
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('componentType', 'box');
              e.dataTransfer.effectAllowed = 'copy';
            }}
          >
            Drag me to canvas
          </div>
          <div className="text-sm text-gray-500 py-2">
            (Drag this box onto the canvas at different zoom levels)
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <Canvas
          componentTree={componentTree}
          onComponentUpdate={handleComponentUpdate}
          className="shadow-lg rounded-lg overflow-hidden"
          settings={{
            viewport: {
              x: 0,
              y: 0,
              zoom: 1,
              width: 1000,
              height: 600
            },
            grid: {
              size: 24,
              visible: true,
              snapEnabled: true,
              color: '#e5e7eb'
            }
          }}
        />
      </div>
    </div>
  );
}