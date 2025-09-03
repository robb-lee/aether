import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Grid } from './Grid';
import { Rulers } from './Rulers';
import { ViewportManager } from './viewport';
import { CanvasSettings, ComponentTreeNode, Point } from '../types';

interface CanvasProps {
  componentTree?: ComponentTreeNode;
  settings?: Partial<CanvasSettings>;
  onSelectionChange?: (selectedIds: string[]) => void;
  onComponentUpdate?: (componentId: string, updates: any) => void;
  className?: string;
}

const DEFAULT_SETTINGS: CanvasSettings = {
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
    width: 1200,
    height: 800
  },
  grid: {
    size: 24,
    visible: true,
    snapEnabled: true,
    color: '#e5e7eb'
  },
  rulers: {
    visible: true,
    units: 'px',
    color: '#6b7280'
  },
  backgroundColor: '#f9fafb'
};

export const Canvas: React.FC<CanvasProps> = ({
  componentTree,
  settings: userSettings = {},
  onSelectionChange,
  onComponentUpdate,
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportManagerRef = useRef<ViewportManager>();
  const [settings, setSettings] = useState<CanvasSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...userSettings
  }));
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [isPanning, setIsPanning] = useState(false);

  // Initialize viewport manager
  useEffect(() => {
    if (!viewportManagerRef.current) {
      viewportManagerRef.current = new ViewportManager(settings.viewport);
    }
  }, []);

  // Handle viewport updates
  const updateViewport = useCallback((updates: Partial<typeof settings.viewport>) => {
    if (viewportManagerRef.current) {
      viewportManagerRef.current.setViewport(updates);
      setSettings(prev => ({
        ...prev,
        viewport: viewportManagerRef.current!.getViewport()
      }));
    }
  }, []);

  // Handle zoom
  const handleZoom = useCallback((event: React.WheelEvent) => {
    if (!viewportManagerRef.current) return;
    
    event.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const center: Point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const delta = -event.deltaY * 0.001;
    viewportManagerRef.current.zoom(delta, center);
    
    setSettings(prev => ({
      ...prev,
      viewport: viewportManagerRef.current!.getViewport()
    }));
  }, []);

  // Handle pan
  const handlePan = useCallback((event: MouseEvent, info: PanInfo) => {
    if (!viewportManagerRef.current || !isPanning) return;
    
    viewportManagerRef.current.pan(info.delta.x, info.delta.y);
    setSettings(prev => ({
      ...prev,
      viewport: viewportManagerRef.current!.getViewport()
    }));
  }, [isPanning]);

  // Handle component selection
  const handleComponentClick = useCallback((componentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newSelection = new Set(selectedComponents);
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      if (newSelection.has(componentId)) {
        newSelection.delete(componentId);
      } else {
        newSelection.add(componentId);
      }
    } else {
      // Single select
      newSelection.clear();
      newSelection.add(componentId);
    }
    
    setSelectedComponents(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  }, [selectedComponents, onSelectionChange]);

  // Handle canvas click (deselect all)
  const handleCanvasClick = useCallback(() => {
    setSelectedComponents(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        setIsPanning(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Render component tree
  const renderComponent = useCallback((node: ComponentTreeNode, depth = 0): React.ReactNode => {
    const isSelected = selectedComponents.has(node.id);
    
    return (
      <motion.div
        key={node.id}
        className={`
          relative border-2 transition-colors duration-200
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'}
        `}
        style={{
          transform: `translate(${node.position?.x || 0}px, ${node.position?.y || 0}px)`,
          width: node.size?.width || 'auto',
          height: node.size?.height || 'auto',
          zIndex: 100 + depth
        }}
        onClick={(e) => handleComponentClick(node.id, e)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Component content placeholder */}
        <div className="p-4 bg-white rounded shadow-sm">
          <div className="text-xs text-gray-500 mb-2">{node.type}</div>
          <div className="font-medium">{node.props?.title || node.props?.content || `Component ${node.id}`}</div>
          {node.props?.description && (
            <div className="text-sm text-gray-600 mt-1">{node.props.description}</div>
          )}
        </div>
        
        {/* Render children */}
        {node.children?.map((child) => renderComponent(child, depth + 1))}
      </motion.div>
    );
  }, [selectedComponents, handleComponentClick]);

  return (
    <div 
      ref={canvasRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: settings.viewport.width,
        height: settings.viewport.height,
        backgroundColor: settings.backgroundColor,
        cursor: isPanning ? 'grabbing' : 'default'
      }}
      onWheel={handleZoom}
      onClick={handleCanvasClick}
    >
      {/* Rulers */}
      <Rulers viewport={settings.viewport} settings={settings.rulers} />
      
      {/* Canvas content area */}
      <motion.div
        className="absolute"
        style={{
          left: 24, // Offset for vertical ruler
          top: 24,  // Offset for horizontal ruler
          width: settings.viewport.width - 24,
          height: settings.viewport.height - 24
        }}
        drag={isPanning}
        onPan={handlePan}
        dragMomentum={false}
        dragElastic={0}
      >
        {/* Grid */}
        <Grid 
          viewport={{
            ...settings.viewport,
            width: settings.viewport.width - 24,
            height: settings.viewport.height - 24
          }} 
          settings={settings.grid} 
        />
        
        {/* Component rendering area */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${settings.viewport.x}px, ${settings.viewport.y}px) scale(${settings.viewport.zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {componentTree && renderComponent(componentTree)}
        </div>
      </motion.div>

      {/* Canvas controls overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        <button
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => updateViewport({ zoom: Math.min(settings.viewport.zoom + 0.1, 5) })}
        >
          Zoom In
        </button>
        <button
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => updateViewport({ zoom: Math.max(settings.viewport.zoom - 0.1, 0.1) })}
        >
          Zoom Out
        </button>
        <button
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => updateViewport({ zoom: 1, x: 0, y: 0 })}
        >
          Reset
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-300 rounded px-3 py-1 text-sm z-20">
        {Math.round(settings.viewport.zoom * 100)}%
      </div>
    </div>
  );
};