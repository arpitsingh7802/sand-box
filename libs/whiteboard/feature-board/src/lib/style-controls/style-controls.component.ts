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
import { ToolStore } from '@sand-box/whiteboard-data-access';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'lib-wb-style-controls',
  host: {
    class: 'flex flex-wrap items-center gap-2',
  },
  imports: [CommonModule, ColorPickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1.5">
        <p-colorpicker name="strokeColor" [(ngModel)]="strokeColor" required inputId="sp-hex" />
        <span class="text-xs sm:text-sm">Stroke</span>
      </div>

      <div class="flex items-center gap-1.5">
        <p-colorpicker name="fillColor" [(ngModel)]="fillColor" required inputId="fp-hex" />
        <span class="text-xs sm:text-sm">Fill</span>
      </div>
    </div>
  `,
})
export class StyleControlsComponent {
  readonly toolStore = inject(ToolStore);

  strokeColor = signal<string | null>(this.toolStore.toolStyle().strokeColor);
  fillColor = signal<string | null>(this.toolStore.toolStyle().fillColor);
  // debounced() returns an ExperimentalPendingResult wrapper
  private readonly debouncedStrokeColor = debounced(this.strokeColor, 500);
  private readonly debouncedFillColor = debounced(this.fillColor, 500);

  constructor() {
    this.setupStrokeColorSyncEffect();
    this.setupFillColorSyncEffect();
  }
  private setupStrokeColorSyncEffect(): void {
    effect(() => {
      const status = this.debouncedStrokeColor.status();
      const value = this.debouncedStrokeColor.value();

      if (status === 'resolved' && value !== null) {
        this.toolStore.setStrokeColor(value);
      }
    });
  }
  private setupFillColorSyncEffect(): void {
    effect(() => {
      const status = this.debouncedFillColor.status();
      const value = this.debouncedFillColor.value();

      if (status === 'resolved' && value !== null) {
        this.toolStore.setFillColor(value);
      }
    });
  }
}
