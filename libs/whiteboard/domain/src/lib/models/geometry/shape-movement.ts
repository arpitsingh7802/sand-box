import { CircleShape } from '../shape/circle.model';
import { PenShape } from '../shape/pen.model';
import { Point } from '../shape/point.model';
import { RectangleShape } from '../shape/rectangle.model';
import { Shape } from '../shape/shape.model';

export function moveShape(shape: Shape, delta: Point): Shape {
  switch (shape.type) {
    case 'pen':
      return _movePen(shape, delta);
    case 'rectangle':
      return _moveRectangle(shape, delta);
    case 'circle':
      return _moveCircle(shape, delta);
    default:
      return shape;
  }
}
// Private move helper
function _movePen(shape: PenShape, delta: Point): PenShape {
  return {
    ...shape,
    points: shape.points.map((p) => ({
      x: p.x + delta.x,
      y: p.y + delta.y,
    })),
  };
}
function _moveRectangle(shape: RectangleShape, delta: Point): RectangleShape {
  return {
    ...shape,
    x: shape.x + delta.x,
    y: shape.y + delta.y,
  };
}
function _moveCircle(shape: CircleShape, delta: Point): CircleShape {
  return {
    ...shape,
    x: shape.x + delta.x,
    y: shape.y + delta.y,
  };
}
