import { computed, Injectable, signal } from '@angular/core';
import { HandlePosition, moveShape, Point, resizeShape, Shape } from '@sand-box/whiteboard-domain';

@Injectable({ providedIn: 'root' })
export class ShapeStore {
  private readonly shapesState = signal<Shape[]>([]);
  private readonly selectedShapeIdState = signal<string | null>(null);
  private readonly activeDraftShapeState = signal<Shape | null>(null);

  readonly shapes = this.shapesState.asReadonly();
  readonly selectedShapeId = this.selectedShapeIdState.asReadonly();
  readonly activeDraftShape = this.activeDraftShapeState.asReadonly();

  readonly selectedShape = computed(() => {
    const id = this.selectedShapeIdState();
    return this.shapesState().find((s) => s.id === id) || null;
  });

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
    const selectedId = this.selectedShapeId();
    if (!selectedId) return;

    this.shapesState.update((shapes) =>
      shapes.map((shape) =>
        shape.id === selectedId ? moveShape(shape, { x: deltaWorldX, y: deltaWorldY }) : shape,
      ),
    );
  }

  resizeShape(handle: HandlePosition, currentWorldPoint: Point): void {
    const selectedId = this.selectedShapeId();
    if (!selectedId) return;

    this.shapesState.update((shapes) =>
      shapes.map((shape) =>
        shape.id === selectedId ? resizeShape(shape, handle, currentWorldPoint) : shape,
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
}
