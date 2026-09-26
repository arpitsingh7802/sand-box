import { CircleShape } from '../shape/circle.model';
import { PenShape } from '../shape/pen.model';
import { Point } from '../shape/point.model';
import { Shape } from '../shape/shape.model';
import { getShapeBoundingBox } from './bounding-box';
import { BoundingBox, HandlePosition } from './interaction.model';
import { getResizeHandles } from './resize-handles';

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
  switch (shape.type) {
    case 'pen':
      return isPointInPen(point, shape, box);
    case 'rectangle':
      return isPointInRectangle(point, box);
    case 'circle':
      return isPointInCircle(point, shape);
    default:
      return false;
  }
}
function isPointInPen(point: Point, shape: PenShape, box: BoundingBox): boolean {
  const padding = Math.max(8, shape.strokeWidth);
  return (
    point.x >= box.minX - padding &&
    point.x <= box.maxX + padding &&
    point.y >= box.minY - padding &&
    point.y <= box.maxY + padding
  );
}
function isPointInRectangle(point: Point, box: BoundingBox): boolean {
  return point.x >= box.minX && point.x <= box.maxX && point.y >= box.minY && point.y <= box.maxY;
}
function isPointInCircle(point: Point, shape: CircleShape): boolean {
  const dx = point.x - shape.x;
  const dy = point.y - shape.y;
  return dx * dx + dy * dy <= shape.radius * shape.radius;
}
