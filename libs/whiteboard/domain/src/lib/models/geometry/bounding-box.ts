import { CircleShape } from '../shape/circle.model';
import { PenShape } from '../shape/pen.model';
import { RectangleShape } from '../shape/rectangle.model';
import { Shape } from '../shape/shape.model';
import { BoundingBox } from './interaction.model';

/**
 * Returns the world-space bounding box for any shape.
 */
export function getShapeBoundingBox(shape: Shape): BoundingBox {
  switch (shape.type) {
    case 'pen':
      return _getPenBoundingBox(shape);
    case 'rectangle':
      return _getRectangleBoundingBox(shape);
    case 'circle':
      return _getCircleBoundingBox(shape);
  }
}
function _getPenBoundingBox(shape: PenShape) {
  const xs = shape.points.map((p) => p.x);
  const ys = shape.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
function _getRectangleBoundingBox(shape: RectangleShape) {
  const minX = Math.min(shape.x, shape.x + shape.width);
  const maxX = Math.max(shape.x, shape.x + shape.width);
  const minY = Math.min(shape.y, shape.y + shape.height);
  const maxY = Math.max(shape.y, shape.y + shape.height);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
function _getCircleBoundingBox(shape: CircleShape) {
  const minX = shape.x - shape.radius;
  const maxX = shape.x + shape.radius;
  const minY = shape.y - shape.radius;
  const maxY = shape.y + shape.radius;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
