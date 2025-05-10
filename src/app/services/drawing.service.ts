import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  // Default color and line width values
  private colorSubject = new BehaviorSubject<string>('#000000');
  private lineWidthSubject = new BehaviorSubject<number>(5);

  // Canvas reference for image export
  private canvasSubject = new BehaviorSubject<HTMLCanvasElement | null>(null);

  // Observable streams for components to subscribe to
  currentColor$: Observable<string> = this.colorSubject.asObservable();
  currentLineWidth$: Observable<number> = this.lineWidthSubject.asObservable();
  canvas$: Observable<HTMLCanvasElement | null> =
    this.canvasSubject.asObservable();

  constructor() {}

  /**
   * Updates the current drawing color
   * @param color The color hex string
   */
  setColor(color: string): void {
    this.colorSubject.next(color);
  }

  /**
   * Updates the current line width
   * @param width The line width in pixels
   */
  setLineWidth(width: number): void {
    this.lineWidthSubject.next(width);
  }

  /**
   * Gets the current drawing color
   * @returns The current color as a hex string
   */
  getCurrentColor(): string {
    return this.colorSubject.getValue();
  }

  /**
   * Gets the current line width
   * @returns The current line width in pixels
   */
  getCurrentLineWidth(): number {
    return this.lineWidthSubject.getValue();
  }

  /**
   * Registers the canvas element with the service
   * @param canvas The canvas element to register
   */
  registerCanvas(canvas: HTMLCanvasElement): void {
    this.canvasSubject.next(canvas);
  }

  /**
   * Gets the current canvas element
   * @returns The current canvas element or null
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvasSubject.getValue();
  }

  /**
   * Saves the current canvas as an image and triggers download
   * @param format Image format (default: 'image/png')
   * @param fileName Optional custom filename
   * @returns True if save was successful, false otherwise
   */
  saveCanvasAsImage(format: string = 'image/png', fileName?: string): boolean {
    const canvas = this.getCanvas();
    if (!canvas) return false;

    try {
      // Create a temporary canvas to add white background
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d')!;

      // Match dimensions of the original canvas
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Fill with white background
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content on top
      tempCtx.drawImage(canvas, 0, 0);

      // Convert canvas to data URL
      const dataUrl = tempCanvas.toDataURL(format);

      // Create download link
      const downloadLink = document.createElement('a');

      // Generate filename with timestamp if not provided
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = format === 'image/png' ? 'png' : 'jpg';
      const defaultFileName = `drawing-${timestamp}.${extension}`;

      // Set link attributes
      downloadLink.download = fileName || defaultFileName;
      downloadLink.href = dataUrl;

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      return true;
    } catch (error) {
      console.error('Error saving canvas as image:', error);
      return false;
    }
  }
}
