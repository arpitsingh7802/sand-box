import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ZoomControlsComponent } from '../zoom-controls/zoom-controls.component';

@Component({
  selector: 'lib-wb-whiteboard',
  imports: [CanvasComponent, ZoomControlsComponent, ToolbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none">
      <lib-wb-toolbar></lib-wb-toolbar>
      <lib-wb-canvas class="block w-full h-full" />
      <lib-wb-zoom-controls />
    </div>
  `,
})
export class WhiteboardComponent {}
