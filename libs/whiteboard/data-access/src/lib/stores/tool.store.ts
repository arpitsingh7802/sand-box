import { Injectable, signal } from '@angular/core';
import { DrawingStyle, ToolType } from '@sand-box/whiteboard-domain';

@Injectable({ providedIn: 'root' })
export class ToolStore {
  private readonly activeToolState = signal<ToolType>('pan');
  private readonly toolStyleState = signal<DrawingStyle>({
    strokeColor: '#6466f1',
    fillColor: '#6466f1',
  });

  readonly activeTool = this.activeToolState.asReadonly();
  readonly toolStyle = this.toolStyleState.asReadonly();

  setTool(tool: ToolType): void {
    this.activeToolState.set(tool);
  }

  setStrokeColor(colorCode: string): void {
    this.toolStyleState.update((style) => ({
      ...style,
      strokeColor: colorCode,
    }));
  }

  setFillColor(colorCode: string): void {
    this.toolStyleState.update((style) => ({
      ...style,
      fillColor: colorCode,
    }));
  }
}
