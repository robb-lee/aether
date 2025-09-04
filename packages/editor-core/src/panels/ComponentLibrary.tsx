import React, { useState } from 'react';
import { Search, Layout, Type, Image, Layers, Box, Grid } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description?: string;
}

interface ComponentLibraryProps {
  onAddComponent: (componentType: string) => void;
}

const COMPONENT_LIBRARY: ComponentItem[] = [
  // Layout
  { id: 'hero-split', name: 'Hero Split', category: 'Layout', icon: <Layout className="w-4 h-4" />, description: 'Hero section with content and image' },
  { id: 'hero-centered', name: 'Hero Centered', category: 'Layout', icon: <Layout className="w-4 h-4" />, description: 'Centered hero section' },
  { id: 'features-grid', name: 'Features Grid', category: 'Layout', icon: <Grid className="w-4 h-4" />, description: 'Grid of feature cards' },
  { id: 'header-nav', name: 'Navigation Header', category: 'Layout', icon: <Layout className="w-4 h-4" />, description: 'Header with navigation' },
  { id: 'footer-simple', name: 'Simple Footer', category: 'Layout', icon: <Layout className="w-4 h-4" />, description: 'Basic footer' },
  
  // Content
  { id: 'text-block', name: 'Text Block', category: 'Content', icon: <Type className="w-4 h-4" />, description: 'Rich text content' },
  { id: 'heading', name: 'Heading', category: 'Content', icon: <Type className="w-4 h-4" />, description: 'H1-H6 headings' },
  { id: 'paragraph', name: 'Paragraph', category: 'Content', icon: <Type className="w-4 h-4" />, description: 'Text paragraph' },
  
  // Media
  { id: 'image', name: 'Image', category: 'Media', icon: <Image className="w-4 h-4" />, description: 'Single image' },
  { id: 'gallery', name: 'Image Gallery', category: 'Media', icon: <Layers className="w-4 h-4" />, description: 'Grid of images' },
  { id: 'video-youtube', name: 'YouTube Video', category: 'Media', icon: <Box className="w-4 h-4" />, description: 'Embed YouTube video' },
  
  // Components
  { id: 'card', name: 'Card', category: 'Components', icon: <Box className="w-4 h-4" />, description: 'Content card' },
  { id: 'button', name: 'Button', category: 'Components', icon: <Box className="w-4 h-4" />, description: 'CTA button' },
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(COMPONENT_LIBRARY.map(c => c.category)));
  
  const filteredComponents = COMPONENT_LIBRARY.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('componentType', componentId);
    e.dataTransfer.effectAllowed = 'copy';
    // Set a text/plain type for better browser support
    e.dataTransfer.setData('text/plain', componentId);

    // Suppress the browser's default drag preview (ghost image),
    // which can appear offset when the canvas is scaled via CSS transforms.
    // We use a tiny transparent element as the drag image.
    const ghost = document.createElement('div');
    ghost.style.width = '1px';
    ghost.style.height = '1px';
    ghost.style.opacity = '0';
    ghost.style.position = 'fixed';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    try {
      e.dataTransfer.setDragImage(ghost, 0, 0);
    } catch {}
    // Cleanup when the drag operation ends
    const cleanup = () => {
      ghost.remove();
      window.removeEventListener('dragend', cleanup, true);
      window.removeEventListener('drop', cleanup, true);
    };
    window.addEventListener('dragend', cleanup, true);
    window.addEventListener('drop', cleanup, true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Components</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex gap-1 mt-3 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              !selectedCategory 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredComponents.map(component => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
              onClick={() => onAddComponent(component.id)}
              className="p-3 border rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded group-hover:bg-blue-100">
                  {component.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{component.name}</h4>
                  {component.description && (
                    <p className="text-xs text-gray-500 mt-1">{component.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No components found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
