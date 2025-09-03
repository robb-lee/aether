import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const DEFAULT_PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#6B7280', // Gray
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presetColors = DEFAULT_PRESET_COLORS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (color: string) => {
    setTempColor(color);
    onChange(color);
  };

  return (
    <div className="space-y-1" ref={pickerRef}>
      {label && (
        <label className="text-xs text-gray-600">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-mono">{value}</span>
          </div>
          <Palette className="w-4 h-4 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg border z-50 w-64">
            {/* Color input */}
            <div className="mb-4">
              <input
                type="color"
                value={tempColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-32 rounded cursor-pointer"
              />
            </div>

            {/* Preset colors */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2">Preset Colors</p>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-10 h-10 rounded border-2 transition-all ${
                      color === value ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Hex input */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Hex Value</label>
              <input
                type="text"
                value={tempColor}
                onChange={(e) => {
                  const hex = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                    setTempColor(hex);
                    if (hex.length === 7) {
                      handleColorChange(hex);
                    }
                  }
                }}
                placeholder="#000000"
                className="w-full px-3 py-1 text-sm border rounded-md font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};