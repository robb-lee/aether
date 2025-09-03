import { useDroppable as useDnDKitDroppable } from '@dnd-kit/core';

interface UseDroppableOptions {
  id: string;
  data?: {
    accepts?: string[];
    [key: string]: any;
  };
  disabled?: boolean;
}

export const useDroppable = ({ id, data, disabled = false }: UseDroppableOptions) => {
  const {
    isOver,
    setNodeRef,
    active,
  } = useDnDKitDroppable({
    id,
    data,
    disabled,
  });

  // Check if the current dragging item can be dropped here
  const canAccept = !data?.accepts || 
    !active?.data.current?.type ||
    data.accepts.includes(active.data.current.type);

  return {
    setNodeRef,
    isOver,
    canAccept,
    // Additional computed properties
    dropZoneProps: {
      'data-droppable': true,
      'data-over': isOver,
      'data-can-accept': canAccept,
    },
    dropZoneStyle: {
      backgroundColor: isOver ? (canAccept ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'transparent',
      borderColor: isOver ? (canAccept ? '#3b82f6' : '#ef4444') : 'transparent',
      borderWidth: isOver ? '2px' : '0px',
      borderStyle: 'dashed',
    },
  };
};