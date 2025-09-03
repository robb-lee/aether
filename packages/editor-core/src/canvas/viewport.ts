import { Viewport, Point, BoundingBox } from '../types';

export const DEFAULT_VIEWPORT: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
  width: 1200,
  height: 800
};

export const ZOOM_LIMITS = {
  min: 0.1,
  max: 5
};

export const GRID_SIZES = [8, 16, 24, 32, 48, 64];

export class ViewportManager {
  private viewport: Viewport;

  constructor(initialViewport: Viewport = DEFAULT_VIEWPORT) {
    this.viewport = { ...initialViewport };
  }

  getViewport(): Viewport {
    return { ...this.viewport };
  }

  setViewport(viewport: Partial<Viewport>): void {
    this.viewport = { ...this.viewport, ...viewport };
  }

  zoom(delta: number, center?: Point): void {
    const newZoom = Math.max(
      ZOOM_LIMITS.min,
      Math.min(ZOOM_LIMITS.max, this.viewport.zoom + delta)
    );

    if (center) {
      const zoomRatio = newZoom / this.viewport.zoom;
      this.viewport.x = center.x - (center.x - this.viewport.x) * zoomRatio;
      this.viewport.y = center.y - (center.y - this.viewport.y) * zoomRatio;
    }

    this.viewport.zoom = newZoom;
  }

  pan(deltaX: number, deltaY: number): void {
    this.viewport.x += deltaX;
    this.viewport.y += deltaY;
  }

  screenToCanvas(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.viewport.x) / this.viewport.zoom,
      y: (screenPoint.y - this.viewport.y) / this.viewport.zoom
    };
  }

  canvasToScreen(canvasPoint: Point): Point {
    return {
      x: canvasPoint.x * this.viewport.zoom + this.viewport.x,
      y: canvasPoint.y * this.viewport.zoom + this.viewport.y
    };
  }

  getBoundingBoxInScreen(canvasBounds: BoundingBox): BoundingBox {
    const topLeft = this.canvasToScreen({ x: canvasBounds.x, y: canvasBounds.y });
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: canvasBounds.width * this.viewport.zoom,
      height: canvasBounds.height * this.viewport.zoom
    };
  }

  snapToGrid(point: Point, gridSize: number): Point {
    if (gridSize <= 0) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }

  centerViewport(target: BoundingBox): void {
    this.viewport.x = this.viewport.width / 2 - (target.x + target.width / 2) * this.viewport.zoom;
    this.viewport.y = this.viewport.height / 2 - (target.y + target.height / 2) * this.viewport.zoom;
  }

  fitToContent(contentBounds: BoundingBox, padding = 50): void {
    const availableWidth = this.viewport.width - padding * 2;
    const availableHeight = this.viewport.height - padding * 2;
    
    const scaleX = availableWidth / contentBounds.width;
    const scaleY = availableHeight / contentBounds.height;
    
    const newZoom = Math.min(scaleX, scaleY, ZOOM_LIMITS.max);
    this.viewport.zoom = Math.max(newZoom, ZOOM_LIMITS.min);
    
    this.centerViewport(contentBounds);
  }
}