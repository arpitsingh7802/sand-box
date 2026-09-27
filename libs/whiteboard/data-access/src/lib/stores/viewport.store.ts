import { Injectable, computed, signal } from '@angular/core';
import { Point, ViewportState, zoomAtPoint } from '@sand-box/whiteboard-domain';

@Injectable({ providedIn: 'root' })
export class ViewportStore {
  private readonly viewportState = signal<ViewportState>({ panX: 0, panY: 0, zoom: 1 });
  private readonly isPanningState = signal<boolean>(false);

  readonly viewport = this.viewportState.asReadonly();
  readonly isPanning = this.isPanningState.asReadonly();
  readonly zoomPercentage = computed(() => Math.round(this.viewportState().zoom * 100));

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
    this.viewportState.update(() => ({ zoom: 1, panX: 0, panY: 0 }));
  }

  setIsPanning(panning: boolean): void {
    this.isPanningState.set(panning);
  }
}
