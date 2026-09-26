import { computed, Injectable, signal } from '@angular/core';
import {
  HandlePosition,
  moveShape,
  Point,
  resizeShape,
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

  moveShape(deltaWorldX: number, deltaWorldY: number): void {
    this.shapesState.update((shapes) =>
      shapes.map((shape) =>
        shape.id === this.selectedShapeId()
          ? moveShape(shape, { x: deltaWorldX, y: deltaWorldY })
          : shape,
      ),
    );
  }

  resizeShape(handle: HandlePosition, currentWorldPoint: Point): void {
    this.shapesState.update((shapes) =>
      shapes.map((shape) =>
        shape.id === this.selectedShapeId() ? resizeShape(shape, handle, currentWorldPoint) : shape,
      ),
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
