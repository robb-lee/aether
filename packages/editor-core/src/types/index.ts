export interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

export interface GridSettings {
  size: number;
  visible: boolean;
  snapEnabled: boolean;
  color: string;
}

export interface RulerSettings {
  visible: boolean;
  units: 'px' | 'rem' | 'em';
  color: string;
}

export interface CanvasSettings {
  viewport: Viewport;
  grid: GridSettings;
  rulers: RulerSettings;
  backgroundColor: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentTreeNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentTreeNode[];
  position?: Point;
  size?: { width: number; height: number };
}

export interface CanvasComponent {
  id: string;
  node: ComponentTreeNode;
  boundingBox: BoundingBox;
  selected: boolean;
  hovered: boolean;
}