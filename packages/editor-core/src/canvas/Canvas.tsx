import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Grid } from './Grid';
import { Rulers } from './Rulers';
import { ViewportManager } from './viewport';
import { CanvasSettings, ComponentTreeNode, Point } from '../types';
import { DragDropProvider } from '../dnd/DragDropContext';
import { DndProvider } from '../dnd/DndProvider';
import { Draggable } from '../dnd/Draggable';
import { Droppable } from '../dnd/Droppable';
import { flattenComponentTree } from '../dnd/utils/sortableHelpers';
import { useSelection } from '../selection/hooks/useSelection';
import { useKeyboardNavigation } from '../selection/hooks/useKeyboardNavigation';
import { SelectionBox } from '../selection/SelectionBox';
import { ResizeHandles } from '../selection/ResizeHandles';

interface CanvasProps {
  componentTree?: ComponentTreeNode;
  settings?: Partial<CanvasSettings>;
  onSelectionChange?: (selectedIds: string[]) => void;
  onComponentUpdate?: (componentId: string, updates: any) => void;
  onComponentTreeChange?: (tree: ComponentTreeNode) => void;
  className?: string;
  renderComponent?: (component: any) => React.ReactNode;
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
  onComponentTreeChange,
  className = '',
  renderComponent: externalRenderComponent
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportManagerRef = useRef<ViewportManager>();
  const [settings, setSettings] = useState<CanvasSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...userSettings
  }));
  const [isPanning, setIsPanning] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStartPoint, setSelectionStartPoint] = useState<Point | null>(null);

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

  // Initialize selection system
  const selection = useSelection(componentTree || null, {
    onSelectionChange,
    onComponentUpdate,
    snapToGrid: settings.grid.snapEnabled,
    gridSize: settings.grid.size
  });

  // Initialize keyboard navigation
  useKeyboardNavigation({
    onKeyboardShortcut: selection.handleKeyboardShortcut,
    enabled: !isPanning && !isSelecting
  });

  // Handle component selection
  const handleComponentClick = useCallback((componentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    selection.select(componentId, event.ctrlKey || event.metaKey);
  }, [selection]);

  // Handle canvas mouse events
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (isPanning) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startPoint: Point = {
      x: (event.clientX - rect.left - 24) / settings.viewport.zoom - settings.viewport.x,
      y: (event.clientY - rect.top - 24) / settings.viewport.zoom - settings.viewport.y
    };

    setIsSelecting(true);
    setSelectionStartPoint(startPoint);
    selection.startSelectionBox(startPoint);
  }, [isPanning, settings.viewport.x, settings.viewport.y, settings.viewport.zoom, selection]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isSelecting || !selectionStartPoint) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentPoint: Point = {
      x: (event.clientX - rect.left - 24) / settings.viewport.zoom - settings.viewport.x,
      y: (event.clientY - rect.top - 24) / settings.viewport.zoom - settings.viewport.y
    };

    selection.updateSelectionBox(currentPoint);
  }, [isSelecting, selectionStartPoint, settings.viewport.x, settings.viewport.y, settings.viewport.zoom, selection]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStartPoint(null);
      selection.endSelectionBox();
    }
  }, [isSelecting, selection]);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      selection.clearSelection();
    }
  }, [selection]);

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

  // Render component tree with drag and drop
  const renderComponent = useCallback((node: ComponentTreeNode, depth = 0): React.ReactNode => {
    const isSelected = selection.isSelected(node.id);
    const componentBounds = selection.selectionManager?.getComponentBounds(node.id);
    
    return (
      <Draggable key={node.id} id={node.id} disabled={isPanning}>
        <Droppable id={`drop-${node.id}`} showDropZone={!isPanning}>
          <motion.div
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
            {/* Component content */}
            {externalRenderComponent ? (
              externalRenderComponent(node)
            ) : (
              <div className="p-4 bg-white rounded shadow-sm">
                <div className="text-xs text-gray-500 mb-2">{node.type}</div>
                <div className="font-medium">{node.props?.title || node.props?.content || `Component ${node.id}`}</div>
                {node.props?.description && (
                  <div className="text-sm text-gray-600 mt-1">{node.props.description}</div>
                )}
              </div>
            )}

            {/* Resize handles for selected components */}
            {isSelected && componentBounds && (
              <ResizeHandles
                boundingBox={componentBounds}
                viewport={settings.viewport}
                onResize={(newBounds) => {
                  onComponentUpdate?.(node.id, {
                    position: { x: newBounds.x, y: newBounds.y },
                    size: { width: newBounds.width, height: newBounds.height }
                  });
                }}
                snapToGrid={settings.grid.snapEnabled}
                gridSize={settings.grid.size}
              />
            )}
          </motion.div>
        </Droppable>
      </Draggable>
    );
  }, [selection, handleComponentClick, isPanning]);

  // Get sortable items for DnD
  const sortableItems = componentTree ? flattenComponentTree(componentTree).map(item => item.id) : [];

  return (
    <DragDropProvider
      componentTree={componentTree}
      onComponentTreeChange={onComponentTreeChange}
    >
      <DndProvider items={sortableItems}>
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
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
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
        
        {/* Selection box overlay */}
        {selection.selectionBox && (
          <SelectionBox
            selectionBox={selection.selectionBox}
            viewport={settings.viewport}
          />
        )}
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
      </DndProvider>
    </DragDropProvider>
  );
};