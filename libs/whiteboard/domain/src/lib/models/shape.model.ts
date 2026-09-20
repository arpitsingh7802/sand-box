import { Point } from './viewport-state.model';

export type ToolType = 'select' | 'pan' | 'rectangle' | 'pen';

export type ShapeType = 'rectangle' | 'pen';

export type HandlePosition = 'tl' | 'tr' | 'bl' | 'br'; // Top-Left, Top-Right, Bottom-Left, Bottom-Right

export interface BaseShape {
  id: string;
  type: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  x: number; // World X
  y: number; // World Y
  width: number;
  height: number;
}

export interface PenShape extends BaseShape {
  type: 'pen';
  points: Point[]; // World space points
}

export type Shape = RectangleShape | PenShape;

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Returns the world-space bounding box for any shape.
 */
export function getShapeBoundingBox(shape: Shape): BoundingBox {
  if (shape.type === 'rectangle') {
    const minX = Math.min(shape.x, shape.x + shape.width);
    const maxX = Math.max(shape.x, shape.x + shape.width);
    const minY = Math.min(shape.y, shape.y + shape.height);
    const maxY = Math.max(shape.y, shape.y + shape.height);
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  const xs = shape.points.map((p) => p.x);
  const ys = shape.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Gets the 4 corner handle positions in world space for a selected shape's bounding box.
 */
export function getResizeHandles(shape: Shape): Record<HandlePosition, Point> {
  const box = getShapeBoundingBox(shape);
  return {
    tl: { x: box.minX, y: box.minY },
    tr: { x: box.maxX, y: box.minY },
    bl: { x: box.minX, y: box.maxY },
    br: { x: box.maxX, y: box.maxY },
  };
}

/**
 * Hit test to determine if a world point is clicking a specific handle.
 */
export function getHitHandle(
  worldPoint: Point,
  shape: Shape,
  zoom: number,
  handleRadiusScreen = 8,
): HandlePosition | null {
  const handles = getResizeHandles(shape);
  const handleRadiusWorld = handleRadiusScreen / zoom;

  for (const [pos, pt] of Object.entries(handles) as [HandlePosition, Point][]) {
    const dx = worldPoint.x - pt.x;
    const dy = worldPoint.y - pt.y;
    if (Math.sqrt(dx * dx + dy * dy) <= handleRadiusWorld) {
      return pos;
    }
  }

  return null;
}

/**
 * Checks if a world point lies inside a shape.
 */
export function isPointInShape(point: Point, shape: Shape): boolean {
  const box = getShapeBoundingBox(shape);

  if (shape.type === 'rectangle') {
    return point.x >= box.minX && point.x <= box.maxX && point.y >= box.minY && point.y <= box.maxY;
  }

  if (shape.type === 'pen') {
    const padding = Math.max(8, shape.strokeWidth);
    return (
      point.x >= box.minX - padding &&
      point.x <= box.maxX + padding &&
      point.y >= box.minY - padding &&
      point.y <= box.maxY + padding
    );
  }

  return false;
}
