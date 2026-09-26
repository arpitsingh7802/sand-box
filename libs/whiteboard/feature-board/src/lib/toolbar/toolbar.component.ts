import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  debounced,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WhiteboardStore } from '@sand-box/whiteboard-data-access';
import { Tool } from '@sand-box/whiteboard-domain';
import { ColorPickerModule } from 'primeng/colorpicker';
@Component({
  selector: 'lib-wb-toolbar',
  imports: [CommonModule, ColorPickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/90 border border-neutral-700/80 p-1.5 rounded-xl shadow-2xl backdrop-blur text-neutral-200 z-10"
    >
      @for (item of tools; track item.id) {
        <button
          (click)="store.setTool(item.id)"
          [class.bg-neutral-700]="store.activeTool() === item.id"
          [class.text-white]="store.activeTool() === item.id"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          [title]="item.label"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      }
      <div class="flex items-center gap-2">
        <p-colorpicker name="color" [(ngModel)]="color" required inputId="cp-hex" />
        <span>Color</span>
      </div>
    </div>
  `,
})
export class ToolbarComponent {
  readonly store = inject(WhiteboardStore);
  color = signal<string>('#6466f1');

  // debounced() returns an ExperimentalPendingResult wrapper
  private debouncedColor = debounced(this.color, 500);

  constructor() {
    // Effects must be placed in a construction context (constructor)
    effect(() => {
      // Check if the debounced value has resolved before updating the store
      if (this.debouncedColor.status() === 'resolved') {
        const color = this.debouncedColor.value();
        this.store.setColorCode(color);
      }
    });
  }
  readonly tools: Tool[] = [
    { id: 'pan', label: 'Hand (Pan)', icon: '✋' },
    { id: 'select', label: 'Select', icon: '👆' },
    { id: 'rectangle', label: 'Rectangle', icon: '⬜' },
    { id: 'pen', label: 'Pen', icon: '✏️' },
    { id: 'circle', label: 'Circle', icon: 'O' },
  ];
}
