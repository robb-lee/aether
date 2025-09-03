import { useDraggable as useDnDKitDraggable } from '@dnd-kit/core';
import { ComponentTreeNode } from '../../types';

interface UseDraggableOptions {
  id: string;
  data?: {
    type: string;
    component: ComponentTreeNode;
    [key: string]: any;
  };
  disabled?: boolean;
}

export const useDraggable = ({ id, data, disabled = false }: UseDraggableOptions) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDnDKitDraggable({
    id,
    data,
    disabled,
  });

  return {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    // Additional computed properties
    dragHandleProps: {
      ...attributes,
      ...listeners,
    },
    dragStyle: {
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : disabled ? 'default' : 'grab',
    },
  };
};