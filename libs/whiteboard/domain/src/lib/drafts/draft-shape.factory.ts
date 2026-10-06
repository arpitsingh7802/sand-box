import { Point } from '../models/shape/point.model';
import { Shape } from '../models/shape/shape.model';
import { DrawingStyle } from '../models/tool/drawing-style.model';
import { ToolType } from '../models/tool/tool-type';

export function createDraftShape(type: ToolType, startPoint: Point, style: DrawingStyle): Shape {
  const id = crypto.randomUUID();
  switch (type) {
    case 'rectangle':
      return {
        id,
        type: 'rectangle',
        x: startPoint.x,
        y: startPoint.y,
        width: 0,
        height: 0,
        strokeColor: style.strokeColor,
        strokeWidth: 2,
        fillColor: style.fillColor,
      };
    case 'circle':
      return {
        id,
        type: 'circle',
        x: startPoint.x,
        y: startPoint.y,
        radius: 0,
        strokeColor: style.strokeColor,
        strokeWidth: 2,
        fillColor: style.fillColor,
      };
    case 'pen':
      return {
        id,
        type: 'pen',
        points: [startPoint],
        strokeColor: style.strokeColor,
        strokeWidth: 3,
      };
    default:
      return {} as Shape;
  }
}
