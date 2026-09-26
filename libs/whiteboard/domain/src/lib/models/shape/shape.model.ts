import { CircleShape } from './circle.model';
import { PenShape } from './pen.model';
import { RectangleShape } from './rectangle.model';

export type ShapeType = 'rectangle' | 'pen' | 'circle';

export type Shape = RectangleShape | PenShape | CircleShape;
