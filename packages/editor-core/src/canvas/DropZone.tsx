import React from 'react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  isActive: boolean;
  isOver: boolean;
  canDrop: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  isActive, 
  isOver,
  canDrop,
  className = '',
  children
}) => {
  if (!isActive) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      {canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isOver ? 0.3 : 0.1,
            borderWidth: isOver ? 4 : 2
          }}
          transition={{ duration: 0.2 }}
          className={`
            absolute inset-0 pointer-events-none rounded-lg
            ${isOver 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-blue-400 bg-blue-400'
            }
          `}
        >
          {isOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                Drop here
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};