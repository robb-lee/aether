import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DragOverlayProps {
  isDragging: boolean;
  draggedType?: string;
  position?: { x: number; y: number };
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ 
  isDragging, 
  draggedType,
  position 
}) => {
  return (
    <AnimatePresence>
      {isDragging && draggedType && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed z-50"
          style={{
            left: position.x - 50,
            top: position.y - 20,
          }}
        >
          <div className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg">
            <div className="text-sm font-medium">
              {formatComponentName(draggedType)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function formatComponentName(type: string): string {
  // Convert component type to readable name
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}