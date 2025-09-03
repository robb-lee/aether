import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  showHandle?: boolean;
}

export const Draggable: React.FC<DraggableProps> = ({
  id,
  children,
  disabled = false,
  className = '',
  showHandle = true,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group relative',
        isDragging && 'opacity-50 z-50',
        !disabled && 'cursor-grab active:cursor-grabbing',
        className
      )}
      {...attributes}
    >
      {showHandle && !disabled && (
        <div
          {...listeners}
          className={clsx(
            'absolute -left-8 top-1/2 -translate-y-1/2',
            'w-6 h-6 bg-blue-500 rounded-md shadow-lg',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'cursor-grab active:cursor-grabbing',
            'z-10'
          )}
          aria-label="Drag handle"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-white"
          >
            <circle cx="3" cy="3" r="1" fill="currentColor" />
            <circle cx="9" cy="3" r="1" fill="currentColor" />
            <circle cx="3" cy="6" r="1" fill="currentColor" />
            <circle cx="9" cy="6" r="1" fill="currentColor" />
            <circle cx="3" cy="9" r="1" fill="currentColor" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
          </svg>
        </div>
      )}
      
      <div
        className={clsx(
          'relative',
          isDragging && 'pointer-events-none',
          !disabled && 'hover:ring-2 hover:ring-blue-300'
        )}
      >
        {children}
      </div>
    </div>
  );
};