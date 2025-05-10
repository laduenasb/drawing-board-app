import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.scss'],
})
export class DrawingCanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private isDrawing = signal(false);
  private lastX = signal(0);
  private lastY = signal(0);

  constructor(private drawingService: DrawingService) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasElement.nativeElement;
    this.context = canvas.getContext('2d')!;
    this.setCanvasSize();
    this.setupCanvas();

    // Register the canvas with the drawing service
    this.drawingService.registerCanvas(canvas);

    // Subscribe to color changes
    this.drawingService.currentColor$.subscribe((color) => {
      this.context.strokeStyle = color;
    });

    // Subscribe to line width changes
    this.drawingService.currentLineWidth$.subscribe((width) => {
      this.context.lineWidth = width;
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setCanvasSize();
    this.setupCanvas();
  }

  private setCanvasSize(): void {
    const canvas = this.canvasElement.nativeElement;
    const parent = canvas.parentElement as HTMLElement;

    // Set canvas size to match parent container
    canvas.width =
      parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth * 0.9;
    canvas.height =
      parent.clientHeight > 0 ? parent.clientHeight : window.innerHeight * 0.7;
  }

  private setupCanvas(): void {
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = this.drawingService.getCurrentColor();
    this.context.lineWidth = this.drawingService.getCurrentLineWidth();
  }

  // MOUSE EVENT HANDLERS
  onMouseDown(event: MouseEvent): void {
    this.isDrawing.set(true);
    const coords = this.getCoordinates(event);
    this.lastX.set(coords.x);
    this.lastY.set(coords.y);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing()) return;
    this.draw(event);
  }

  onMouseUp(): void {
    this.isDrawing.set(false);
  }

  onMouseOut(): void {
    this.isDrawing.set(false);
  }

  // TOUCH EVENT HANDLERS
  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1) {
      this.isDrawing.set(true);
      const coords = this.getTouchCoordinates(event.touches[0]);
      this.lastX.set(coords.x);
      this.lastY.set(coords.y);
    }
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (!this.isDrawing() || event.touches.length !== 1) return;
    this.drawTouch(event.touches[0]);
  }

  onTouchEnd(): void {
    this.isDrawing.set(false);
  }

  // DRAWING METHODS
  private draw(event: MouseEvent): void {
    const coords = this.getCoordinates(event);
    this.drawLine(this.lastX(), this.lastY(), coords.x, coords.y);
    this.lastX.set(coords.x);
    this.lastY.set(coords.y);
  }

  private drawTouch(touch: Touch): void {
    const coords = this.getTouchCoordinates(touch);
    this.drawLine(this.lastX(), this.lastY(), coords.x, coords.y);
    this.lastX.set(coords.x);
    this.lastY.set(coords.y);
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  // COORDINATE HELPERS
  private getCoordinates(event: MouseEvent): { x: number; y: number } {
    const canvas = this.canvasElement.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private getTouchCoordinates(touch: Touch): { x: number; y: number } {
    const canvas = this.canvasElement.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
}
