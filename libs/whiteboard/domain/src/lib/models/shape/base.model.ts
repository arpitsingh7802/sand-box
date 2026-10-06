import { ShapeType } from './shape.type';

export interface BaseShape {
  id: string;
  type: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}
