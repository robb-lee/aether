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
  private canvasRect: DOMRect | null = null;
  private rulerOffset = 24; // Consistent ruler offset

  constructor(initialViewport: Viewport = DEFAULT_VIEWPORT) {
    this.viewport = { ...initialViewport };
  }

  updateCanvasRect(rect: DOMRect): void {
    this.canvasRect = rect;
  }

  getRulerOffset(): number {
    return this.rulerOffset;
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

  screenToCanvas(screenX: number, screenY: number): Point {
    if (!this.canvasRect) {
      console.warn('ViewportManager: canvasRect not set. Call updateCanvasRect first.');
      return { x: 0, y: 0 };
    }

    // Convert screen coordinates to relative canvas coordinates
    // Account for the canvas position and ruler offset
    const relativeX = screenX - this.canvasRect.left - this.rulerOffset;
    const relativeY = screenY - this.canvasRect.top - this.rulerOffset;

    // Apply viewport transformation (pan and zoom)
    return {
      x: (relativeX - this.viewport.x) / this.viewport.zoom,
      y: (relativeY - this.viewport.y) / this.viewport.zoom
    };
  }

  // Keep old method signature for backward compatibility if needed
  screenToCanvasPoint(screenPoint: Point): Point {
    return this.screenToCanvas(screenPoint.x, screenPoint.y);
  }

  canvasToScreen(canvasPoint: Point): Point {
    if (!this.canvasRect) {
      console.warn('ViewportManager: canvasRect not set. Call updateCanvasRect first.');
      return { x: 0, y: 0 };
    }

    // Apply viewport transformation
    const transformedX = canvasPoint.x * this.viewport.zoom + this.viewport.x;
    const transformedY = canvasPoint.y * this.viewport.zoom + this.viewport.y;

    // Convert back to screen coordinates by adding canvas position and ruler offset
    return {
      x: transformedX + this.canvasRect.left + this.rulerOffset,
      y: transformedY + this.canvasRect.top + this.rulerOffset
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