import { BaseShape } from './base.model';

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  x: number; // World X
  y: number; // World Y
  width: number;
  height: number;
}
