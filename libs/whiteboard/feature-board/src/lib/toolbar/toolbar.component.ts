import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToolStore } from '@sand-box/whiteboard-data-access';
import { TOOL_GROUPS } from '@sand-box/whiteboard-domain';
import { ColorPickerModule } from 'primeng/colorpicker';
import { StyleControlsComponent } from '../style-controls/style-controls.component';
@Component({
  selector: 'lib-wb-toolbar',
  imports: [CommonModule, ColorPickerModule, FormsModule, StyleControlsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="
        fixed top-6 left-1/2 -translate-x-1/2
        flex flex-wrap items-center justify-center gap-1
        max-w-[calc(100vw-2rem)]
        bg-neutral-900/90 border border-neutral-700/80
        p-1.5 rounded-xl shadow-2xl backdrop-blur
        text-neutral-200 z-10
        "
    >
      @for (group of toolGroups; track group.id) {
        <div class="flex items-center gap-1">
          @for (tool of group.tools; track tool.id) {
            <button
              (click)="toolStore.setTool(tool.id)"
              [class.bg-neutral-700]="toolStore.activeTool() === tool.id"
              [class.text-white]="toolStore.activeTool() === tool.id"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              [title]="tool.label"
            >
              <span>{{ tool.icon }}</span>
              <span>{{ tool.label }}</span>
            </button>
          }
        </div>

        @if (!$last) {
          <div class="h-6 w-px bg-neutral-700"></div>
        }
      }
      <lib-wb-style-controls></lib-wb-style-controls>
    </div>
  `,
})
export class ToolbarComponent {
  readonly toolStore = inject(ToolStore);
  readonly toolGroups = TOOL_GROUPS;
}
