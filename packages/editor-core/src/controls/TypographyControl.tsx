import React from 'react';
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TypographySettings {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textDecoration?: string;
  lineHeight?: string | number;
  letterSpacing?: string;
  textAlign?: string;
  color?: string;
}

interface TypographyControlProps {
  value: TypographySettings;
  onChange: (value: TypographySettings) => void;
  label?: string;
}

const FONT_FAMILIES = [
  { label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Sans Serif', value: 'Inter, Arial, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: 'Monaco, "Courier New", monospace' },
  { label: 'Display', value: '"Playfair Display", Georgia, serif' },
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px'];
const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Black', value: '900' },
];
const LINE_HEIGHTS = ['1', '1.25', '1.5', '1.75', '2'];
const LETTER_SPACINGS = ['-0.02em', '0', '0.02em', '0.05em', '0.1em'];

export const TypographyControl: React.FC<TypographyControlProps> = ({
  value,
  onChange,
  label,
}) => {
  const handleChange = (key: keyof TypographySettings, val: string | number) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const toggleStyle = (style: 'italic' | 'underline' | 'bold') => {
    if (style === 'italic') {
      handleChange('fontStyle', value.fontStyle === 'italic' ? 'normal' : 'italic');
    } else if (style === 'underline') {
      handleChange('textDecoration', value.textDecoration === 'underline' ? 'none' : 'underline');
    } else if (style === 'bold') {
      handleChange('fontWeight', value.fontWeight === '700' || value.fontWeight === 700 ? '400' : '700');
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-gray-500" />
          <label className="text-xs text-gray-600">{label}</label>
        </div>
      )}

      {/* Font Family */}
      <div>
        <label className="text-xs text-gray-600">Font Family</label>
        <select
          value={value.fontFamily || FONT_FAMILIES[0].value}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full mt-1 px-2 py-1 text-sm border rounded-md"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-600">Size</label>
          <select
            value={value.fontSize || '16px'}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full mt-1 px-2 py-1 text-sm border rounded-md"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Weight</label>
          <select
            value={value.fontWeight || '400'}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
            className="w-full mt-1 px-2 py-1 text-sm border rounded-md"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight.label} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Style Buttons */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => toggleStyle('bold')}
          className={`p-1.5 rounded transition-colors ${
            value.fontWeight === '700' || value.fontWeight === 700
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100'
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleStyle('italic')}
          className={`p-1.5 rounded transition-colors ${
            value.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleStyle('underline')}
          className={`p-1.5 rounded transition-colors ${
            value.textDecoration === 'underline' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => handleChange('textAlign', 'left')}
          className={`p-1.5 rounded transition-colors ${
            value.textAlign === 'left' || !value.textAlign ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleChange('textAlign', 'center')}
          className={`p-1.5 rounded transition-colors ${
            value.textAlign === 'center' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleChange('textAlign', 'right')}
          className={`p-1.5 rounded transition-colors ${
            value.textAlign === 'right' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleChange('textAlign', 'justify')}
          className={`p-1.5 rounded transition-colors ${
            value.textAlign === 'justify' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-600">Line Height</label>
          <select
            value={value.lineHeight || '1.5'}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            className="w-full mt-1 px-2 py-1 text-sm border rounded-md"
          >
            {LINE_HEIGHTS.map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Letter Spacing</label>
          <select
            value={value.letterSpacing || '0'}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
            className="w-full mt-1 px-2 py-1 text-sm border rounded-md"
          >
            {LETTER_SPACINGS.map((spacing) => (
              <option key={spacing} value={spacing}>
                {spacing}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};