import { useSortable as useDnDKitSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentTreeNode } from '../../types';

interface UseSortableOptions {
  id: string;
  data?: {
    type: string;
    component: ComponentTreeNode;
    index: number;
    [key: string]: any;
  };
  disabled?: boolean;
}

export const useSortable = ({ id, data, disabled = false }: UseSortableOptions) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useDnDKitSortable({
    id,
    data,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    style,
    // Additional computed properties
    sortableProps: {
      ...attributes,
      style,
    },
    dragHandleProps: {
      ...listeners,
      'aria-label': `Drag to reorder ${data?.component?.type || 'component'}`,
    },
    wrapperStyle: {
      opacity: isDragging ? 0.3 : 1,
      cursor: isDragging ? 'grabbing' : disabled ? 'default' : 'grab',
      zIndex: isDragging ? 999 : 'auto',
    },
  };
};