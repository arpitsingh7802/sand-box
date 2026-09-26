import { BaseShape } from './base.model';
import { Point } from './point.model';

export interface PenShape extends BaseShape {
  type: 'pen';
  points: Point[]; // World space points
}
