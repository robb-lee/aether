// Canvas components
export { Canvas } from './canvas/Canvas';
export { Grid } from './canvas/Grid';
export { Rulers } from './canvas/Rulers';
export { ViewportManager, DEFAULT_VIEWPORT, ZOOM_LIMITS, GRID_SIZES } from './canvas/viewport';

// Types
export type {
  Viewport,
  GridSettings,
  RulerSettings,
  CanvasSettings,
  Point,
  BoundingBox,
  ComponentTreeNode,
  CanvasComponent
} from './types';