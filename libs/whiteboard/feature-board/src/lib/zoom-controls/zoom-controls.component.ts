import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhiteboardStore } from '@sand-box/whiteboard-data-access';

@Component({
  selector: 'lib-wb-zoom-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed bottom-6 right-6 flex items-center gap-2 bg-neutral-900/90 text-white px-3 py-1.5 rounded-lg border border-neutral-700 shadow-lg backdrop-blur text-sm"
    >
      <button
        (click)="zoomOut()"
        class="hover:bg-neutral-800 px-2 py-1 rounded cursor-pointer transition-colors"
        title="Zoom Out"
      >
        -
      </button>
      <button
        (click)="store.resetZoom()"
        class="font-mono min-w-[3rem] text-center hover:bg-neutral-800 px-2 py-1 rounded cursor-pointer transition-colors"
        title="Reset Zoom"
      >
        {{ store.zoomPercentage() }}%
      </button>
      <button
        (click)="zoomIn()"
        class="hover:bg-neutral-800 px-2 py-1 rounded cursor-pointer transition-colors"
        title="Zoom In"
      >
        +
      </button>
    </div>
  `,
})
export class ZoomControlsComponent {
  readonly store = inject(WhiteboardStore);

  zoomIn(): void {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.store.zoomAt(center, 1.2);
  }

  zoomOut(): void {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.store.zoomAt(center, 0.8);
  }
}
