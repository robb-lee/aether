import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  showDropZone?: boolean;
  accept?: string[]; // Types of components this can accept
}

export const Droppable: React.FC<DroppableProps> = ({
  id,
  children,
  disabled = false,
  className = '',
  showDropZone = true,
  accept = [],
}) => {
  const {
    isOver,
    setNodeRef,
    active,
  } = useDroppable({
    id,
    disabled,
  });

  const canAccept = accept.length === 0 || 
    (active?.data.current?.type && accept.includes(active.data.current.type));

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'relative transition-all duration-200',
        isOver && canAccept && showDropZone && [
          'bg-blue-50 border-2 border-blue-300 border-dashed',
          'dark:bg-blue-950 dark:border-blue-600'
        ],
        isOver && !canAccept && showDropZone && [
          'bg-red-50 border-2 border-red-300 border-dashed',
          'dark:bg-red-950 dark:border-red-600'
        ],
        className
      )}
    >
      {children}
      
      {/* Drop zone indicator */}
      {isOver && showDropZone && (
        <div
          className={clsx(
            'absolute inset-0 pointer-events-none',
            'flex items-center justify-center',
            'text-sm font-medium',
            canAccept ? [
              'text-blue-600 dark:text-blue-400',
              'bg-blue-100/50 dark:bg-blue-900/50'
            ] : [
              'text-red-600 dark:text-red-400',
              'bg-red-100/50 dark:bg-red-900/50'
            ]
          )}
        >
          {canAccept ? 'Drop here' : 'Cannot drop here'}
        </div>
      )}
      
      {/* Insertion line indicator */}
      {isOver && canAccept && (
        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0',
            'h-1 bg-green-500',
            'animate-pulse'
          )}
        />
      )}
    </div>
  );
};