import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { WhiteboardStore } from '@sand-box/whiteboard-data-access';
import {
  getHitHandle,
  getResizeHandles,
  getShapeBoundingBox,
  HandlePosition,
  isPointInShape,
  PenShape,
  Point,
  RectangleShape,
  screenToWorld,
  Shape,
  worldToScreen,
} from '@sand-box/whiteboard-domain';

type DragMode = 'none' | 'drawing' | 'moving' | 'resizing';

@Component({
  selector: 'lib-wb-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #canvasRef
      class="w-full h-full block select-none"
      [class.cursor-grab]="store.activeTool() === 'pan' && !store.isPanning()"
      [class.cursor-grabbing]="store.activeTool() === 'pan' && store.isPanning()"
      [class.cursor-crosshair]="store.activeTool() === 'rectangle' || store.activeTool() === 'pen'"
      [class.cursor-move]="dragMode === 'moving'"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseUp()"
      (mouseleave)="onMouseUp()"
      (wheel)="onWheel($event)"
    ></canvas>
  `,
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly store = inject(WhiteboardStore);
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private resizeObserver!: ResizeObserver;

  dragMode: DragMode = 'none';
  private activeHandle: HandlePosition | null = null;
  private lastWorldPoint: Point | null = null;
  private startWorldPoint: Point | null = null;

  constructor() {
    effect(() => {
      // Re-render when viewport, shapes, selection, or draft changes
      this.store.viewport();
      this.store.shapes();
      this.store.selectedShapeId();
      this.store.activeDraftShape();
      this.scheduleRender();
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      this.ctx = context;
    }

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(canvas.parentElement || canvas);

    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.store.deleteSelectedShape();
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.scheduleRender();
  }

  // --- Pointer Interactions ---
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const screenPoint: Point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const viewport = this.store.viewport();
    const worldPoint = screenToWorld(screenPoint, viewport);
    const activeTool = this.store.activeTool();

    if (activeTool === 'pan' || event.button === 1) {
      this.store.setIsPanning(true);
      return;
    }

    if (activeTool === 'select') {
      const selectedShape = this.store.selectedShape();

      // 1. Check if clicking on a resize handle of currently selected shape
      if (selectedShape) {
        const hitHandle = getHitHandle(worldPoint, selectedShape, viewport.zoom);
        if (hitHandle) {
          this.dragMode = 'resizing';
          this.activeHandle = hitHandle;
          this.lastWorldPoint = worldPoint;
          return;
        }
      }

      // 2. Check if clicking on an existing shape
      const shapes = this.store.shapes();
      const hitShape = [...shapes].reverse().find((s) => isPointInShape(worldPoint, s));

      if (hitShape) {
        this.store.selectShape(hitShape.id);
        this.dragMode = 'moving';
        this.lastWorldPoint = worldPoint;
      } else {
        this.store.clearSelection();
        this.dragMode = 'none';
      }
      return;
    }

    // 3. Drawing tools
    if (activeTool === 'rectangle') {
      this.dragMode = 'drawing';
      this.startWorldPoint = worldPoint;
      const newRect: RectangleShape = {
        id: crypto.randomUUID(),
        type: 'rectangle',
        x: worldPoint.x,
        y: worldPoint.y,
        width: 0,
        height: 0,
        strokeColor: this.store.selectedColor(),
        strokeWidth: 2,
        fillColor: 'rgba(59, 130, 246, 0.15)',
      };
      this.store.setDraftShape(newRect);
      return;
    }

    if (activeTool === 'pen') {
      this.dragMode = 'drawing';
      const newPen: PenShape = {
        id: crypto.randomUUID(),
        type: 'pen',
        points: [worldPoint],
        strokeColor: this.store.selectedColor(),
        strokeWidth: 3,
      };
      this.store.setDraftShape(newPen);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.store.isPanning()) {
      this.store.panBy(event.movementX, event.movementY);
      return;
    }

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const screenPoint: Point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const viewport = this.store.viewport();
    const currentWorldPoint = screenToWorld(screenPoint, viewport);

    if (this.dragMode === 'moving' && this.lastWorldPoint) {
      const selectedId = this.store.selectedShapeId();
      if (selectedId) {
        const deltaX = currentWorldPoint.x - this.lastWorldPoint.x;
        const deltaY = currentWorldPoint.y - this.lastWorldPoint.y;
        this.store.moveShape(selectedId, deltaX, deltaY);
        this.lastWorldPoint = currentWorldPoint;
      }
      return;
    }

    if (this.dragMode === 'resizing' && this.activeHandle && this.lastWorldPoint) {
      const selectedId = this.store.selectedShapeId();
      if (selectedId) {
        this.store.resizeShape(selectedId, this.activeHandle, currentWorldPoint);
        this.lastWorldPoint = currentWorldPoint;
      }
      return;
    }

    if (this.dragMode === 'drawing') {
      const draft = this.store.activeDraftShape();
      if (draft?.type === 'rectangle' && this.startWorldPoint) {
        const updatedRect: RectangleShape = {
          ...draft,
          x: Math.min(this.startWorldPoint.x, currentWorldPoint.x),
          y: Math.min(this.startWorldPoint.y, currentWorldPoint.y),
          width: Math.abs(currentWorldPoint.x - this.startWorldPoint.x),
          height: Math.abs(currentWorldPoint.y - this.startWorldPoint.y),
        };
        this.store.setDraftShape(updatedRect);
      } else if (draft?.type === 'pen') {
        const updatedPen: PenShape = {
          ...draft,
          points: [...draft.points, currentWorldPoint],
        };
        this.store.setDraftShape(updatedPen);
      }
    }
  }

  onMouseUp(): void {
    if (this.store.isPanning()) {
      this.store.setIsPanning(false);
    }

    if (this.dragMode === 'drawing') {
      this.store.commitDraftShape();
    }

    this.dragMode = 'none';
    this.activeHandle = null;
    this.lastWorldPoint = null;
    this.startWorldPoint = null;
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const focalPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const zoomFactor = Math.pow(0.999, event.deltaY);
    this.store.zoomAt(focalPoint, zoomFactor);
  }

  // --- Render Loop ---
  private scheduleRender(): void {
    if (this.animationFrameId !== null) return;
    this.animationFrameId = requestAnimationFrame(() => {
      this.render();
      this.animationFrameId = null;
    });
  }

  private render(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const viewport = this.store.viewport();
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Background
    this.ctx.fillStyle = '#1e1e24';
    this.ctx.fillRect(0, 0, width, height);

    // Grid
    this.drawGrid(width, height, viewport);

    // Render Committed Shapes
    for (const shape of this.store.shapes()) {
      this.drawShape(shape, viewport, shape.id === this.store.selectedShapeId());
    }

    // Render Draft Shape
    const draft = this.store.activeDraftShape();
    if (draft) {
      this.drawShape(draft, viewport, false);
    }

    // Render Origin Marker (World 0,0)
    const origin = worldToScreen({ x: 0, y: 0 }, viewport);
    this.ctx.beginPath();
    this.ctx.arc(origin.x, origin.y, 5 * viewport.zoom, 0, Math.PI * 2);
    this.ctx.fillStyle = this.store.selectedColor();
    this.ctx.fill();
  }

  private drawShape(
    shape: Shape,
    viewport: { panX: number; panY: number; zoom: number },
    isSelected: boolean,
  ): void {
    this.ctx.save();

    if (shape.type === 'rectangle') {
      const topLeft = worldToScreen({ x: shape.x, y: shape.y }, viewport);
      const scaledWidth = shape.width * viewport.zoom;
      const scaledHeight = shape.height * viewport.zoom;

      if (shape.fillColor) {
        this.ctx.fillStyle = shape.fillColor;
        this.ctx.fillRect(topLeft.x, topLeft.y, scaledWidth, scaledHeight);
      }

      this.ctx.strokeStyle = shape.strokeColor;
      this.ctx.lineWidth = shape.strokeWidth * viewport.zoom;
      this.ctx.strokeRect(topLeft.x, topLeft.y, scaledWidth, scaledHeight);
    } else if (shape.type === 'pen' && shape.points.length > 0) {
      this.ctx.strokeStyle = shape.strokeColor;
      this.ctx.lineWidth = shape.strokeWidth * viewport.zoom;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.ctx.beginPath();
      const firstScreen = worldToScreen(shape.points[0], viewport);
      this.ctx.moveTo(firstScreen.x, firstScreen.y);

      for (let i = 1; i < shape.points.length; i++) {
        const screenPt = worldToScreen(shape.points[i], viewport);
        this.ctx.lineTo(screenPt.x, screenPt.y);
      }
      this.ctx.stroke();
    }

    // Render Bounding Box & Handles when Selected
    if (isSelected) {
      this.drawSelectionOutlineAndHandles(shape, viewport);
    }

    this.ctx.restore();
  }

  private drawSelectionOutlineAndHandles(
    shape: Shape,
    viewport: { panX: number; panY: number; zoom: number },
  ): void {
    const box = getShapeBoundingBox(shape);
    const minScreen = worldToScreen({ x: box.minX, y: box.minY }, viewport);
    const maxScreen = worldToScreen({ x: box.maxX, y: box.maxY }, viewport);
    const padding = 6;

    const rectX = minScreen.x - padding;
    const rectY = minScreen.y - padding;
    const rectWidth = maxScreen.x - minScreen.x + padding * 2;
    const rectHeight = maxScreen.y - minScreen.y + padding * 2;

    // Dotted Bounding Line
    this.ctx.strokeStyle = '#60a5fa';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([6, 4]);
    this.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    this.ctx.setLineDash([]);

    // Corner Handles (Only show resize handles for rectangles)
    if (shape.type === 'rectangle') {
      const handles = getResizeHandles(shape);
      const handleRadius = 5;

      for (const pt of Object.values(handles)) {
        const handleScreen = worldToScreen(pt, viewport);
        this.ctx.beginPath();
        this.ctx.arc(handleScreen.x, handleScreen.y, handleRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }
  }

  private drawGrid(
    width: number,
    height: number,
    viewport: { panX: number; panY: number; zoom: number },
  ): void {
    const baseGridSize = 50;
    const scaledGridSize = baseGridSize * viewport.zoom;

    if (scaledGridSize < 8) return;

    this.ctx.strokeStyle = '#2d2d38';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    const startX = (viewport.panX % scaledGridSize) - scaledGridSize;
    const startY = (viewport.panY % scaledGridSize) - scaledGridSize;

    for (let x = startX; x < width + scaledGridSize; x += scaledGridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }

    for (let y = startY; y < height + scaledGridSize; y += scaledGridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }

    this.ctx.stroke();
  }
}
