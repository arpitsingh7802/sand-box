export type HandlePosition =
  | 'n' // North (Top Mid)
  | 's' // South (Bottom Mid)
  | 'e' // East (Right Mid)
  | 'w' // West (Left Mid)
  | 'nw' // North-West (Top-Left Corner)
  | 'ne' // North-East (Top-Right Corner)
  | 'sw' // South-West (Bottom-Left Corner)
  | 'se'; // South-East (Bottom-Right Corner)

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
