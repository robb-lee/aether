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

export interface ComponentStyles {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number;
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    textDecoration?: string;
    lineHeight?: string | number;
    letterSpacing?: string;
    textAlign?: string;
  };
}

export interface ResponsiveSettings {
  mobile?: Partial<ComponentStyles>;
  tablet?: Partial<ComponentStyles>;
  desktop?: Partial<ComponentStyles>;
}

export interface AnimationSettings {
  type?: 'none' | 'fade' | 'slide' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface ComponentTreeNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentTreeNode[];
  position?: Point;
  size?: { width: number; height: number };
  styles?: ComponentStyles;
  responsive?: ResponsiveSettings;
  animations?: AnimationSettings;
}

export interface CanvasComponent {
  id: string;
  node: ComponentTreeNode;
  boundingBox: BoundingBox;
  selected: boolean;
  hovered: boolean;
}