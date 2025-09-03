import React, { useState } from 'react';
import { Link, Unlink } from 'lucide-react';

interface SpacingValue {
  top: string | number;
  right: string | number;
  bottom: string | number;
  left: string | number;
}

interface SpacingControlProps {
  value: SpacingValue | string | number;
  onChange: (value: SpacingValue | string) => void;
  label?: string;
  type?: 'padding' | 'margin';
  units?: string[];
}

const DEFAULT_UNITS = ['px', 'rem', '%', 'auto'];

export const SpacingControl: React.FC<SpacingControlProps> = ({
  value,
  onChange,
  label,
  type = 'padding',
  units = DEFAULT_UNITS,
}) => {
  const [linked, setLinked] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('px');

  // Parse value to spacing object
  const parseValue = (val: SpacingValue | string | number): SpacingValue => {
    if (typeof val === 'object' && val !== null) {
      return val;
    }
    
    const strVal = String(val);
    const parts = strVal.split(' ').filter(Boolean);
    
    if (parts.length === 1) {
      const v = parts[0];
      return { top: v, right: v, bottom: v, left: v };
    } else if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    } else if (parts.length === 3) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    } else if (parts.length === 4) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    }
    
    return { top: '0', right: '0', bottom: '0', left: '0' };
  };

  const spacing = parseValue(value);

  const handleChange = (side: keyof SpacingValue, val: string) => {
    const numVal = val.replace(/[^0-9.-]/g, '');
    const newValue = numVal ? `${numVal}${selectedUnit}` : '0';

    if (linked) {
      onChange({
        top: newValue,
        right: newValue,
        bottom: newValue,
        left: newValue,
      });
    } else {
      onChange({
        ...spacing,
        [side]: newValue,
      });
    }
  };

  const formatSpacing = (sp: SpacingValue): string => {
    if (sp.top === sp.right && sp.right === sp.bottom && sp.bottom === sp.left) {
      return String(sp.top);
    }
    if (sp.top === sp.bottom && sp.left === sp.right) {
      return `${sp.top} ${sp.right}`;
    }
    if (sp.left === sp.right) {
      return `${sp.top} ${sp.right} ${sp.bottom}`;
    }
    return `${sp.top} ${sp.right} ${sp.bottom} ${sp.left}`;
  };

  const extractNumber = (val: string | number): string => {
    return String(val).replace(/[^0-9.-]/g, '') || '0';
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-600">{label}</label>
          <div className="flex items-center space-x-1">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs border rounded px-1 py-0.5"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setLinked(!linked)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title={linked ? 'Unlink values' : 'Link values'}
            >
              {linked ? (
                <Link className="w-3 h-3 text-blue-600" />
              ) : (
                <Unlink className="w-3 h-3 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      )}

      {linked ? (
        // Linked input
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={extractNumber(spacing.top)}
            onChange={(e) => handleChange('top', e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded-md"
            placeholder="0"
          />
          <span className="text-xs text-gray-500">All sides</span>
        </div>
      ) : (
        // Individual inputs
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Top</label>
            <input
              type="number"
              value={extractNumber(spacing.top)}
              onChange={(e) => handleChange('top', e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded-md"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Right</label>
            <input
              type="number"
              value={extractNumber(spacing.right)}
              onChange={(e) => handleChange('right', e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded-md"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Bottom</label>
            <input
              type="number"
              value={extractNumber(spacing.bottom)}
              onChange={(e) => handleChange('bottom', e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded-md"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Left</label>
            <input
              type="number"
              value={extractNumber(spacing.left)}
              onChange={(e) => handleChange('left', e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded-md"
              placeholder="0"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
        {type}: {formatSpacing(spacing)}
      </div>
    </div>
  );
};