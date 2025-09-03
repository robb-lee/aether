import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BoundingBox, Point } from '../types';
import { ResizeHandle, ResizeState } from './types';

interface ResizeHandlesProps {
  boundingBox: BoundingBox;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  onResize?: (newBounds: BoundingBox) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  snapToGrid?: boolean;
  gridSize?: number;
  minWidth?: number;
  minHeight?: number;
}

const HANDLE_SIZE = 8;
const HANDLE_OFFSET = HANDLE_SIZE / 2;

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  boundingBox,
  viewport,
  onResize,
  onResizeStart,
  onResizeEnd,
  snapToGrid = true,
  gridSize = 24,
  minWidth = 50,
  minHeight = 30
}) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    handle: null,
    originalBounds: boundingBox,
    startPoint: { x: 0, y: 0 }
  });

  // Transform coordinates according to viewport
  const transformedBox = {
    x: (boundingBox.x + viewport.x) * viewport.zoom,
    y: (boundingBox.y + viewport.y) * viewport.zoom,
    width: boundingBox.width * viewport.zoom,
    height: boundingBox.height * viewport.zoom
  };

  // Define resize handles
  const handles: ResizeHandle[] = [
    { position: 'nw', x: transformedBox.x - HANDLE_OFFSET, y: transformedBox.y - HANDLE_OFFSET, cursor: 'nw-resize' },
    { position: 'n', x: transformedBox.x + transformedBox.width / 2 - HANDLE_OFFSET, y: transformedBox.y - HANDLE_OFFSET, cursor: 'n-resize' },
    { position: 'ne', x: transformedBox.x + transformedBox.width - HANDLE_OFFSET, y: transformedBox.y - HANDLE_OFFSET, cursor: 'ne-resize' },
    { position: 'e', x: transformedBox.x + transformedBox.width - HANDLE_OFFSET, y: transformedBox.y + transformedBox.height / 2 - HANDLE_OFFSET, cursor: 'e-resize' },
    { position: 'se', x: transformedBox.x + transformedBox.width - HANDLE_OFFSET, y: transformedBox.y + transformedBox.height - HANDLE_OFFSET, cursor: 'se-resize' },
    { position: 's', x: transformedBox.x + transformedBox.width / 2 - HANDLE_OFFSET, y: transformedBox.y + transformedBox.height - HANDLE_OFFSET, cursor: 's-resize' },
    { position: 'sw', x: transformedBox.x - HANDLE_OFFSET, y: transformedBox.y + transformedBox.height - HANDLE_OFFSET, cursor: 'sw-resize' },
    { position: 'w', x: transformedBox.x - HANDLE_OFFSET, y: transformedBox.y + transformedBox.height / 2 - HANDLE_OFFSET, cursor: 'w-resize' }
  ];

  const handleMouseDown = useCallback((handle: ResizeHandle, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const startPoint = {
      x: event.clientX,
      y: event.clientY
    };

    setResizeState({
      isResizing: true,
      handle,
      originalBounds: boundingBox,
      startPoint
    });

    onResizeStart?.();
  }, [boundingBox, onResizeStart]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!resizeState.isResizing || !resizeState.handle) return;

    const deltaX = (event.clientX - resizeState.startPoint.x) / viewport.zoom;
    const deltaY = (event.clientY - resizeState.startPoint.y) / viewport.zoom;

    let newBounds = { ...resizeState.originalBounds };

    // Calculate new bounds based on resize handle position
    switch (resizeState.handle.position) {
      case 'nw':
        newBounds.x += deltaX;
        newBounds.y += deltaY;
        newBounds.width -= deltaX;
        newBounds.height -= deltaY;
        break;
      case 'n':
        newBounds.y += deltaY;
        newBounds.height -= deltaY;
        break;
      case 'ne':
        newBounds.y += deltaY;
        newBounds.width += deltaX;
        newBounds.height -= deltaY;
        break;
      case 'e':
        newBounds.width += deltaX;
        break;
      case 'se':
        newBounds.width += deltaX;
        newBounds.height += deltaY;
        break;
      case 's':
        newBounds.height += deltaY;
        break;
      case 'sw':
        newBounds.x += deltaX;
        newBounds.width -= deltaX;
        newBounds.height += deltaY;
        break;
      case 'w':
        newBounds.x += deltaX;
        newBounds.width -= deltaX;
        break;
    }

    // Enforce minimum dimensions
    if (newBounds.width < minWidth) {
      if (['nw', 'w', 'sw'].includes(resizeState.handle.position)) {
        newBounds.x = resizeState.originalBounds.x + resizeState.originalBounds.width - minWidth;
      }
      newBounds.width = minWidth;
    }

    if (newBounds.height < minHeight) {
      if (['nw', 'n', 'ne'].includes(resizeState.handle.position)) {
        newBounds.y = resizeState.originalBounds.y + resizeState.originalBounds.height - minHeight;
      }
      newBounds.height = minHeight;
    }

    // Snap to grid
    if (snapToGrid) {
      newBounds.x = Math.round(newBounds.x / gridSize) * gridSize;
      newBounds.y = Math.round(newBounds.y / gridSize) * gridSize;
      newBounds.width = Math.round(newBounds.width / gridSize) * gridSize;
      newBounds.height = Math.round(newBounds.height / gridSize) * gridSize;
    }

    onResize?.(newBounds);
  }, [resizeState, viewport.zoom, snapToGrid, gridSize, minWidth, minHeight, onResize]);

  const handleMouseUp = useCallback(() => {
    if (resizeState.isResizing) {
      setResizeState(prev => ({
        ...prev,
        isResizing: false,
        handle: null
      }));
      onResizeEnd?.();
    }
  }, [resizeState.isResizing, onResizeEnd]);

  // Set up mouse event listeners
  React.useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizeState.isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="absolute pointer-events-none z-40">
      {handles.map((handle) => (
        <motion.div
          key={handle.position}
          className="absolute pointer-events-auto bg-blue-600 border-2 border-white shadow-md hover:bg-blue-700 transition-colors"
          style={{
            left: handle.x,
            top: handle.y,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            cursor: handle.cursor,
            borderRadius: '1px'
          }}
          onMouseDown={(e) => handleMouseDown(handle, e)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        />
      ))}
      
      {/* Resize feedback overlay */}
      {resizeState.isResizing && (
        <motion.div
          className="absolute pointer-events-none bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap"
          style={{
            left: transformedBox.x + transformedBox.width + 10,
            top: transformedBox.y,
            zIndex: 50
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {Math.round(boundingBox.width)} × {Math.round(boundingBox.height)}
        </motion.div>
      )}
    </div>
  );
};