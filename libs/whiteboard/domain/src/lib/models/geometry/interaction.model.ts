export type HandlePosition = 'tl' | 'tr' | 'bl' | 'br'; // Top-Left, Top-Right, Bottom-Left, Bottom-Right

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
