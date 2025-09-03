import React from 'react';
import { RulerSettings, Viewport } from '../types';

interface RulersProps {
  viewport: Viewport;
  settings: RulerSettings;
}

export const Rulers: React.FC<RulersProps> = ({ viewport, settings }) => {
  if (!settings.visible) return null;

  const rulerSize = 24; // Height/width of ruler in pixels
  const tickSize = 8;
  const majorTickSize = 12;

  // Calculate scale based on zoom level
  const scale = viewport.zoom;
  const unit = settings.units === 'px' ? 1 : settings.units === 'rem' ? 16 : 16;
  
  // Determine tick spacing based on zoom level
  const getTickSpacing = () => {
    const baseSpacing = 50 * unit; // Base spacing in pixels
    const scaledSpacing = baseSpacing * scale;
    
    // Adjust spacing to keep reasonable tick density
    if (scaledSpacing < 20) return baseSpacing * 4;
    if (scaledSpacing < 50) return baseSpacing * 2;
    if (scaledSpacing > 200) return baseSpacing / 2;
    return baseSpacing;
  };

  const tickSpacing = getTickSpacing();
  const majorTickSpacing = tickSpacing * 5;

  // Calculate ruler offset
  const offsetX = viewport.x % (tickSpacing * scale);
  const offsetY = viewport.y % (tickSpacing * scale);

  // Horizontal ruler
  const horizontalTicks = Math.ceil(viewport.width / (tickSpacing * scale)) + 2;
  const horizontalRuler = Array.from({ length: horizontalTicks }, (_, i) => {
    const x = offsetX + i * tickSpacing * scale;
    const canvasX = (x - viewport.x) / scale;
    const isMajor = Math.abs(canvasX % majorTickSpacing) < 1;
    const value = Math.round(canvasX / unit);

    return (
      <g key={`h-${i}`}>
        <line
          x1={x}
          y1={rulerSize - (isMajor ? majorTickSize : tickSize)}
          x2={x}
          y2={rulerSize}
          stroke={settings.color}
          strokeWidth={0.5}
        />
        {isMajor && (
          <text
            x={x}
            y={rulerSize - majorTickSize - 2}
            fontSize={10}
            fill={settings.color}
            textAnchor="middle"
            className="select-none"
          >
            {value}{settings.units}
          </text>
        )}
      </g>
    );
  });

  // Vertical ruler
  const verticalTicks = Math.ceil(viewport.height / (tickSpacing * scale)) + 2;
  const verticalRuler = Array.from({ length: verticalTicks }, (_, i) => {
    const y = offsetY + i * tickSpacing * scale;
    const canvasY = (y - viewport.y) / scale;
    const isMajor = Math.abs(canvasY % majorTickSpacing) < 1;
    const value = Math.round(canvasY / unit);

    return (
      <g key={`v-${i}`}>
        <line
          x1={rulerSize - (isMajor ? majorTickSize : tickSize)}
          y1={y}
          x2={rulerSize}
          y2={y}
          stroke={settings.color}
          strokeWidth={0.5}
        />
        {isMajor && (
          <text
            x={rulerSize - majorTickSize - 2}
            y={y}
            fontSize={10}
            fill={settings.color}
            textAnchor="middle"
            className="select-none"
            transform={`rotate(-90, ${rulerSize - majorTickSize - 2}, ${y})`}
          >
            {value}{settings.units}
          </text>
        )}
      </g>
    );
  });

  return (
    <>
      {/* Horizontal Ruler */}
      <div 
        className="absolute top-0 left-6 right-0 bg-gray-100 border-b border-gray-300"
        style={{ height: rulerSize, zIndex: 10 }}
      >
        <svg
          width={viewport.width - rulerSize}
          height={rulerSize}
          className="overflow-visible"
        >
          {horizontalRuler}
        </svg>
      </div>

      {/* Vertical Ruler */}
      <div 
        className="absolute top-6 left-0 bottom-0 bg-gray-100 border-r border-gray-300"
        style={{ width: rulerSize, zIndex: 10 }}
      >
        <svg
          width={rulerSize}
          height={viewport.height - rulerSize}
          className="overflow-visible"
        >
          {verticalRuler}
        </svg>
      </div>

      {/* Corner piece */}
      <div 
        className="absolute top-0 left-0 bg-gray-200 border-r border-b border-gray-300"
        style={{ width: rulerSize, height: rulerSize, zIndex: 11 }}
      />
    </>
  );
};