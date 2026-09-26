import { CircleShape } from '../shape/circle.model';
import { Point } from '../shape/point.model';
import { RectangleShape } from '../shape/rectangle.model';
import { Shape } from '../shape/shape.model';
import { HandlePosition } from './interaction.model';

export function resizeShape(shape: Shape, handle: HandlePosition, currentWorldPoint: Point): Shape {
  switch (shape.type) {
    case 'rectangle':
      return _resizeRectangle(shape, handle, currentWorldPoint);
    case 'circle':
      return _resizeCircle(shape, handle, currentWorldPoint);
    default:
      return shape;
  }
}

function _resizeRectangle(
  shape: RectangleShape,
  handle: HandlePosition,
  currentWorldPoint: Point,
): RectangleShape {
  let x = shape.x;
  let y = shape.y;
  let width = shape.width;
  let height = shape.height;

  const right = x + width;
  const bottom = y + height;

  if (handle === 'br') {
    width = Math.max(10, currentWorldPoint.x - x);
    height = Math.max(10, currentWorldPoint.y - y);
  } else if (handle === 'bl') {
    const newX = Math.min(currentWorldPoint.x, right - 10);
    width = right - newX;
    x = newX;
    height = Math.max(10, currentWorldPoint.y - y);
  } else if (handle === 'tr') {
    const newY = Math.min(currentWorldPoint.y, bottom - 10);
    height = bottom - newY;
    y = newY;
    width = Math.max(10, currentWorldPoint.x - x);
  } else if (handle === 'tl') {
    const newX = Math.min(currentWorldPoint.x, right - 10);
    const newY = Math.min(currentWorldPoint.y, bottom - 10);
    width = right - newX;
    height = bottom - newY;
    x = newX;
    y = newY;
  }

  return { ...shape, x, y, width, height };
}

function _resizeCircle(
  shape: CircleShape,
  handle: HandlePosition,
  currentWorldPoint: Point,
): CircleShape {
  let radius = shape.radius;
  radius = Math.max(10, currentWorldPoint.x - radius);
  return { ...shape, radius };
}
