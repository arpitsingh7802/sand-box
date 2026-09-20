import { Injectable, computed, signal } from '@angular/core';
import {
  HandlePosition,
  Point,
  Shape,
  ToolType,
  ViewportState,
  zoomAtPoint,
} from '@sand-box/whiteboard-domain';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardStore {
  // --- Viewport State ---
  private readonly viewportState = signal<ViewportState>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });

  private readonly activeToolState = signal<ToolType>('pan');
  private readonly isPanningState = signal<boolean>(false);

  // --- Shapes & Selection ---
  private readonly shapesState = signal<Shape[]>([]);
  private readonly selectedShapeIdState = signal<string | null>(null);
  private readonly activeDraftShapeState = signal<Shape | null>(null);

  // --- Color ---
  private readonly selectedColorCode = signal<string>('#ef4444');

  // --- Readonly Computed Exports ---
  readonly viewport = this.viewportState.asReadonly();
  readonly activeTool = this.activeToolState.asReadonly();
  readonly isPanning = this.isPanningState.asReadonly();
  readonly shapes = this.shapesState.asReadonly();
  readonly selectedShapeId = this.selectedShapeIdState.asReadonly();
  readonly activeDraftShape = this.activeDraftShapeState.asReadonly();
  readonly selectedColor = this.selectedColorCode.asReadonly();

  readonly selectedShape = computed(() => {
    const id = this.selectedShapeIdState();
    return this.shapesState().find((s) => s.id === id) || null;
  });

  readonly zoomPercentage = computed(() => Math.round(this.viewportState().zoom * 100));

  // --- Viewport Actions ---
  setTool(tool: ToolType): void {
    this.activeToolState.set(tool);
    if (tool !== 'select') {
      this.selectedShapeIdState.set(null);
    }
  }

  panBy(deltaX: number, deltaY: number): void {
    this.viewportState.update((current) => ({
      ...current,
      panX: current.panX + deltaX,
      panY: current.panY + deltaY,
    }));
  }

  zoomAt(focalPoint: Point, zoomDelta: number): void {
    this.viewportState.update((current) => zoomAtPoint(current, focalPoint, zoomDelta));
  }

  resetZoom(): void {
    this.viewportState.update((current) => ({
      ...current,
      zoom: 1,
      panX: 0,
      panY: 0,
    }));
  }

  setIsPanning(panning: boolean): void {
    this.isPanningState.set(panning);
  }

  // --- Shape & Drawing Actions ---
  setDraftShape(shape: Shape | null): void {
    this.activeDraftShapeState.set(shape);
  }

  commitDraftShape(): void {
    const draft = this.activeDraftShapeState();
    if (draft) {
      this.shapesState.update((shapes) => [...shapes, draft]);
      this.activeDraftShapeState.set(null);
    }
  }

  selectShape(shapeId: string | null): void {
    this.selectedShapeIdState.set(shapeId);
  }

  clearSelection(): void {
    this.selectedShapeIdState.set(null);
  }

  moveShape(shapeId: string, deltaWorldX: number, deltaWorldY: number): void {
    this.shapesState.update((shapes) =>
      shapes.map((shape) => {
        if (shape.id !== shapeId) return shape;

        if (shape.type === 'rectangle') {
          return {
            ...shape,
            x: shape.x + deltaWorldX,
            y: shape.y + deltaWorldY,
          };
        }

        if (shape.type === 'pen') {
          return {
            ...shape,
            points: shape.points.map((p) => ({
              x: p.x + deltaWorldX,
              y: p.y + deltaWorldY,
            })),
          };
        }

        return shape;
      }),
    );
  }

  resizeShape(shapeId: string, handle: HandlePosition, currentWorldPoint: Point): void {
    this.shapesState.update((shapes) =>
      shapes.map((shape) => {
        if (shape.id !== shapeId) return shape;

        if (shape.type === 'rectangle') {
          let x = shape.x;
          let y = shape.y;
          let width = shape.width;
          let height = shape.height;

          const right = x + width;
          const bottom = y + height;

          if (handle === 'br') {
            width = Math.max(10, currentWorldPoint.x - x);
            height = Math.max(10, currentWorldPoint.y - y);
          } else if (handle === 'bl') {
            const newX = Math.min(currentWorldPoint.x, right - 10);
            width = right - newX;
            x = newX;
            height = Math.max(10, currentWorldPoint.y - y);
          } else if (handle === 'tr') {
            const newY = Math.min(currentWorldPoint.y, bottom - 10);
            height = bottom - newY;
            y = newY;
            width = Math.max(10, currentWorldPoint.x - x);
          } else if (handle === 'tl') {
            const newX = Math.min(currentWorldPoint.x, right - 10);
            const newY = Math.min(currentWorldPoint.y, bottom - 10);
            width = right - newX;
            height = bottom - newY;
            x = newX;
            y = newY;
          }

          return { ...shape, x, y, width, height };
        }

        return shape;
      }),
    );
  }

  deleteSelectedShape(): void {
    const selectedId = this.selectedShapeIdState();
    if (selectedId) {
      this.shapesState.update((shapes) => shapes.filter((s) => s.id !== selectedId));
      this.selectedShapeIdState.set(null);
    }
  }

  // --- Color selection Actions ---
  setColorCode(colorCode: string): void {
    this.selectedColorCode.update(() => colorCode);
  }
}
