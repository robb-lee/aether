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
import { DragOverlay } from './DragOverlay';
import { DropZone } from './DropZone';

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
  const [isDragging, setIsDragging] = useState(false);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<Point | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Reset drag state helper function
  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setDraggedType(null);
    setDragPosition(null);
  }, []);

  // Initialize viewport manager
  useEffect(() => {
    if (!viewportManagerRef.current) {
      viewportManagerRef.current = new ViewportManager(settings.viewport);
    }
  }, []);

  // Clean up drag state on unmount and setup ResizeObserver
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement || !viewportManagerRef.current) return;

    // Update canvas rect immediately
    const updateCanvasRect = () => {
      const rect = canvasElement.getBoundingClientRect();
      viewportManagerRef.current?.updateCanvasRect(rect);
    };

    // Initial update
    updateCanvasRect();

    // Setup ResizeObserver to update rect on size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasRect();
    });

    resizeObserver.observe(canvasElement);

    // Also update on window resize
    const handleWindowResize = () => {
      updateCanvasRect();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      // Reset drag state when component unmounts
      resetDragState();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [resetDragState]);

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

    const rulerOffset = viewportManagerRef.current.getRulerOffset();
    const center: Point = {
      x: event.clientX - rect.left - rulerOffset,
      y: event.clientY - rect.top - rulerOffset
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
    console.log('Component clicked:', componentId);
    selection.select(componentId, event.ctrlKey || event.metaKey);
  }, [selection]);

  // Helper function to transform screen coordinates to canvas coordinates
  // Uses ViewportManager for consistent coordinate transformation
  const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
    if (!viewportManagerRef.current) {
      return { x: 0, y: 0 };
    }
    return viewportManagerRef.current.screenToCanvas(screenX, screenY);
  }, []);

  // Handle canvas mouse events
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (isPanning) return;

    const startPoint = screenToCanvas(event.clientX, event.clientY);

    setIsSelecting(true);
    setSelectionStartPoint(startPoint);
    selection.startSelectionBox(startPoint);
  }, [isPanning, screenToCanvas, selection]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isSelecting || !selectionStartPoint) return;

    const currentPoint = screenToCanvas(event.clientX, event.clientY);

    selection.updateSelectionBox(currentPoint);
  }, [isSelecting, selectionStartPoint, screenToCanvas, selection]);

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
  
  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    
    // Update drag position for overlay
    setDragPosition({ x: event.clientX, y: event.clientY });
  }, []);
  
  // Handle drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const componentType = event.dataTransfer.getData('componentType');
    if (!componentType) return;
    
    // Calculate drop position using proper coordinate transformation
    const dropPosition = screenToCanvas(event.clientX, event.clientY);
    
    // Apply grid snap if enabled
    let finalPosition = dropPosition;
    if (settings.grid.snapEnabled) {
      finalPosition = {
        x: Math.round(dropPosition.x / settings.grid.size) * settings.grid.size,
        y: Math.round(dropPosition.y / settings.grid.size) * settings.grid.size
      };
    }
    
    // Notify parent to add component at drop position
    if (onComponentUpdate) {
      onComponentUpdate('__ADD_COMPONENT__', {
        type: componentType,
        position: finalPosition
      });
    }
    
    // Reset drag state
    resetDragState();
  }, [screenToCanvas, onComponentUpdate, settings.grid.snapEnabled, settings.grid.size, resetDragState]);
  
  // Handle drag enter
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // Check if this is a component drag (we can't access the actual data during drag)
    if (event.dataTransfer.types.includes('text/plain')) {
      setIsDragging(true);
      // We'll get the actual type during drop
      setDraggedType('component');
    }
  }, []);
  
  // Handle drag leave
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // Only reset if leaving the canvas entirely
    if (event.currentTarget === event.target) {
      resetDragState();
    }
  }, [resetDragState]);
  
  // Handle drag end (when drag is cancelled or finished)
  const handleDragEnd = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // Always reset drag state when drag ends
    resetDragState();
  }, [resetDragState]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        setIsPanning(true);
      }
      // ESC key to cancel drag operation
      if (event.code === 'Escape' && isDragging) {
        event.preventDefault();
        resetDragState();
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
  }, [isDragging, resetDragState]);

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
            width: '100%',
            height: '100%',
            backgroundColor: settings.backgroundColor,
            cursor: isPanning ? 'grabbing' : 'default'
          }}
          onWheel={handleZoom}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
        >
      {/* Rulers */}
      <Rulers viewport={settings.viewport} settings={settings.rulers} />
      
      {/* Canvas content area */}
      <motion.div
        className="absolute"
        style={{
          left: 24, // Offset for vertical ruler
          top: 24,  // Offset for horizontal ruler
          right: 0,
          bottom: 0
        }}
        drag={isPanning}
        onPan={handlePan}
        dragMomentum={false}
        dragElastic={0}
      >
        {/* Grid */}
        <Grid 
          viewport={settings.viewport} 
          settings={settings.grid} 
        />
        
        {/* Component rendering area (scaled with viewport) */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${settings.viewport.x}px, ${settings.viewport.y}px) scale(${settings.viewport.zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {componentTree && renderComponent(componentTree)}

          {/* Overlay layer above site content */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10000 }}>
            {/* Selection box overlay (shares transform via parent container) */}
            {selection.selectionBox && (
              <SelectionBox selectionBox={selection.selectionBox} />
            )}
          </div>
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
      
      {/* Drag overlay */}
      <DragOverlay
        isDragging={isDragging}
        draggedType={draggedType || undefined}
        position={dragPosition || undefined}
      />
        </div>
      </DndProvider>
    </DragDropProvider>
  );
};
