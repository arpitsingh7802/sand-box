import { Injectable, signal } from '@angular/core';
import { ToolType } from '@sand-box/whiteboard-domain';

@Injectable({ providedIn: 'root' })
export class ToolStore {
  private readonly activeToolState = signal<ToolType>('pan');
  private readonly selectedStrokeColor = signal<string>('#6466f1');
  private readonly selectedFillColor = signal<string>('#6466f1');

  readonly activeTool = this.activeToolState.asReadonly();
  readonly strokeColor = this.selectedStrokeColor.asReadonly();
  readonly fillColor = this.selectedFillColor.asReadonly();

  setTool(tool: ToolType): void {
    this.activeToolState.set(tool);
  }

  setStrokeColor(colorCode: string): void {
    this.selectedStrokeColor.set(colorCode);
  }

  setFillColor(colorCode: string): void {
    this.selectedFillColor.set(colorCode);
  }
}
