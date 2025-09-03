import React from 'react';
import { motion } from 'framer-motion';
import { SelectionBox as SelectionBoxType } from './types';

interface SelectionBoxProps {
  selectionBox: SelectionBoxType;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ 
  selectionBox
}) => {
  if (!selectionBox) return null;

  const { boundingBox } = selectionBox;
  
  // Use canvas coordinates directly (parent container already handles viewport transformation)
  const transformedBox = {
    left: boundingBox.x,
    top: boundingBox.y,
    width: boundingBox.width,
    height: boundingBox.height
  };

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{
        left: transformedBox.left,
        top: transformedBox.top,
        width: transformedBox.width,
        height: transformedBox.height,
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '2px'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      {/* Selection box corners for visual enhancement */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-600 rounded-sm" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-sm" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-600 rounded-sm" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-600 rounded-sm" />
    </motion.div>
  );
};