import { ShapeType } from './shape.model';

export interface BaseShape {
  id: string;
  type: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}
