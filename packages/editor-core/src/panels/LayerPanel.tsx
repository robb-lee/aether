import React, { useState } from 'react';
import { ComponentTreeNode } from '../types';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface LayerPanelProps {
  componentTree: ComponentTreeNode | null;
  selectedIds: string[];
  onSelectComponent: (componentId: string, multiSelect: boolean) => void;
  onToggleVisibility?: (componentId: string) => void;
  onToggleLock?: (componentId: string) => void;
}

interface LayerItemProps {
  node: ComponentTreeNode;
  depth: number;
  selectedIds: string[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelectComponent: (componentId: string, multiSelect: boolean) => void;
  onToggleVisibility?: (componentId: string) => void;
  onToggleLock?: (componentId: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  node,
  depth,
  selectedIds,
  expandedIds,
  onToggleExpand,
  onSelectComponent,
  onToggleVisibility,
  onToggleLock
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.includes(node.id);
  const isVisible = node.props?.visible !== false;
  const isLocked = node.props?.locked === true;

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={(e) => onSelectComponent(node.id, e.ctrlKey || e.metaKey)}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand(node.id);
          }}
          className="w-4 h-4 mr-1 flex items-center justify-center"
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )
          )}
        </button>

        {/* Component name */}
        <span className={`flex-1 text-sm ${isSelected ? 'font-medium' : ''}`}>
          {node.props?.title || node.type || 'Component'}
        </span>

        {/* Visibility toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility?.(node.id);
          }}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded"
        >
          {isVisible ? (
            <Eye className="w-3 h-3 text-gray-500" />
          ) : (
            <EyeOff className="w-3 h-3 text-gray-400" />
          )}
        </button>

        {/* Lock toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock?.(node.id);
          }}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded"
        >
          {isLocked ? (
            <Lock className="w-3 h-3 text-gray-500" />
          ) : (
            <Unlock className="w-3 h-3 text-gray-400" />
          )}
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <LayerItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelectComponent={onSelectComponent}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayerPanel: React.FC<LayerPanelProps> = ({
  componentTree,
  selectedIds,
  onSelectComponent,
  onToggleVisibility,
  onToggleLock
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  if (!componentTree) {
    return (
      <div className="p-4 text-gray-500">
        <p className="text-sm">No components to display</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-gray-900">Layers</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <LayerItem
          node={componentTree}
          depth={0}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onToggleExpand={handleToggleExpand}
          onSelectComponent={onSelectComponent}
          onToggleVisibility={onToggleVisibility}
          onToggleLock={onToggleLock}
        />
      </div>
    </div>
  );
};