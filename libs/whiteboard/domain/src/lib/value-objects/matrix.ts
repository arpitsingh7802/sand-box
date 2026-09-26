import { Point } from '../models/shape/point.model';
import { DEFAULT_ZOOM_LIMITS, ViewportState, ZoomLimits } from '../models/viewport-state.model';

/**
 * Converts screen/pixel coordinates (e.g. mouse event offset) into world space coordinates.
 * WorldX = (ScreenX - PanX) / Zoom
 */
export function screenToWorld(screenPoint: Point, viewport: ViewportState): Point {
  return {
    x: (screenPoint.x - viewport.panX) / viewport.zoom,
    y: (screenPoint.y - viewport.panY) / viewport.zoom,
  };
}

/**
 * Converts world space coordinates into screen/pixel coordinates for rendering.
 * ScreenX = (WorldX * Zoom) + PanX
 */
export function worldToScreen(worldPoint: Point, viewport: ViewportState): Point {
  return {
    x: worldPoint.x * viewport.zoom + viewport.panX,
    y: worldPoint.y * viewport.zoom + viewport.panY,
  };
}

/**
 * Computes a new ViewportState zoomed relative to a focal screen point (e.g. cursor position).
 * Keeps the world point under the cursor stationary while adjusting pan and zoom.
 */
export function zoomAtPoint(
  viewport: ViewportState,
  focalScreenPoint: Point,
  zoomDelta: number,
  limits: ZoomLimits = DEFAULT_ZOOM_LIMITS,
): ViewportState {
  const newZoom = Math.min(limits.maxZoom, Math.max(limits.minZoom, viewport.zoom * zoomDelta));

  if (newZoom === viewport.zoom) {
    return viewport;
  }

  // World point before zoom under the focal position
  const worldPoint = screenToWorld(focalScreenPoint, viewport);

  // Adjust pan so the world point remains under focalScreenPoint at newZoom
  const newPanX = focalScreenPoint.x - worldPoint.x * newZoom;
  const newPanY = focalScreenPoint.y - worldPoint.y * newZoom;

  return {
    panX: newPanX,
    panY: newPanY,
    zoom: newZoom,
  };
}
