import React, { useRef, useEffect, useState } from 'react';
import { GridSettings, Viewport } from '../types';

interface GridProps {
  viewport: Viewport;
  settings: GridSettings;
}

export const Grid: React.FC<GridProps> = ({ viewport, settings }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!settings.visible) return null;

  const gridSize = settings.size * viewport.zoom;
  const minGridSize = 8; // Minimum grid size in pixels

  // Don't render grid if it's too small to see
  if (gridSize < minGridSize) return null;

  const startX = -((viewport.x % gridSize) + gridSize) % gridSize;
  const startY = -((viewport.y % gridSize) + gridSize) % gridSize;

  const linesX = Math.ceil(size.width / gridSize) + 1;
  const linesY = Math.ceil(size.height / gridSize) + 1;

  const horizontalLines = Array.from({ length: linesY }, (_, i) => (
    <line
      key={`h-${i}`}
      x1={0}
      y1={startY + i * gridSize}
      x2={size.width}
      y2={startY + i * gridSize}
      stroke={settings.color}
      strokeWidth={0.5}
      opacity={0.3}
    />
  ));

  const verticalLines = Array.from({ length: linesX }, (_, i) => (
    <line
      key={`v-${i}`}
      x1={startX + i * gridSize}
      y1={0}
      x2={startX + i * gridSize}
      y2={size.height}
      stroke={settings.color}
      strokeWidth={0.5}
      opacity={0.3}
    />
  ));

  // Add major grid lines every 5th line
  const majorGridSize = gridSize * 5;
  const majorStartX = -((viewport.x % majorGridSize) + majorGridSize) % majorGridSize;
  const majorStartY = -((viewport.y % majorGridSize) + majorGridSize) % majorGridSize;

  const majorLinesX = Math.ceil(size.width / majorGridSize) + 1;
  const majorLinesY = Math.ceil(size.height / majorGridSize) + 1;

  const majorHorizontalLines = Array.from({ length: majorLinesY }, (_, i) => (
    <line
      key={`mh-${i}`}
      x1={0}
      y1={majorStartY + i * majorGridSize}
      x2={size.width}
      y2={majorStartY + i * majorGridSize}
      stroke={settings.color}
      strokeWidth={1}
      opacity={0.5}
    />
  ));

  const majorVerticalLines = Array.from({ length: majorLinesX }, (_, i) => (
    <line
      key={`mv-${i}`}
      x1={majorStartX + i * majorGridSize}
      y1={0}
      x2={majorStartX + i * majorGridSize}
      y2={size.height}
      stroke={settings.color}
      strokeWidth={1}
      opacity={0.5}
    />
  ));

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      style={{ zIndex: 1 }}
    >
      {/* Minor grid lines */}
      {horizontalLines}
      {verticalLines}
      
      {/* Major grid lines */}
      {majorHorizontalLines}
      {majorVerticalLines}
    </svg>
  );
};