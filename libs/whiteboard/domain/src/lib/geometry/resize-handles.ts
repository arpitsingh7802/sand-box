import { BoundingBox } from '../models/geometry/bounding-box.model';
import { HandlePosition } from '../models/geometry/handle-position.type';
import { Point } from '../models/shape/point.model';
import { Shape } from '../models/shape/shape.model';
import { getShapeBoundingBox } from './bounding-box';

/**
 * Gets the handles in world space for a selected shape's bounding box.
 */
export function getResizeHandles(shape: Shape): Partial<Record<HandlePosition, Point>> {
  const box = getShapeBoundingBox(shape);
  switch (shape.type) {
    case 'rectangle':
      return _getRectangleResizeHandles(box);
    case 'circle':
      return _getCircleResizeHandles(box);
    default:
      return {};
  }
}
// Rectangles use the 4 corners
function _getRectangleResizeHandles(box: BoundingBox): Partial<Record<HandlePosition, Point>> {
  return {
    nw: { x: box.minX, y: box.minY },
    ne: { x: box.maxX, y: box.minY },
    sw: { x: box.minX, y: box.maxY },
    se: { x: box.maxX, y: box.maxY },
  };
}

// Circles use the 4 midpoints
function _getCircleResizeHandles(box: BoundingBox): Partial<Record<HandlePosition, Point>> {
  const midX = (box.minX + box.maxX) / 2;
  const midY = (box.minY + box.maxY) / 2;
  return {
    n: { x: midX, y: box.minY },
    s: { x: midX, y: box.maxY },
    w: { x: box.minX, y: midY },
    e: { x: box.maxX, y: midY },
  };
}
