import { Point } from '../models/shape/point.model';
import { Shape } from '../models/shape/shape.model';

export function updateDraftShape(draft: Shape, startPoint: Point, currentPoint: Point): Shape {
  if (draft.type === 'rectangle') {
    return {
      ...draft,
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };
  }
  if (draft.type === 'circle') {
    const dx = startPoint.x - currentPoint.x;
    const dy = startPoint.y - currentPoint.y;
    return { ...draft, radius: Math.sqrt(dx * dx + dy * dy) };
  }
  if (draft.type === 'pen') {
    return { ...draft, points: [...draft.points, currentPoint] };
  }
  return draft;
}
