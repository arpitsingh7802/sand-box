import { Point } from '../shape/point.model';
import { Shape } from '../shape/shape.model';
import { getShapeBoundingBox } from './bounding-box';
import { HandlePosition } from './interaction.model';

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
