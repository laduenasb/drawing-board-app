import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-drawing-toolbar',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './drawing-toolbar.component.html',
  styleUrls: ['./drawing-toolbar.component.scss'],
})
export class DrawingToolbarComponent {
  lineWidth = signal(5);
  selectedColor = signal('#000000');

  // Predefined color palette
  colors: string[] = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FF8800', // Orange
    '#8800FF', // Purple
  ];

  constructor(
    private drawingService: DrawingService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  /**
   * Sets the selected color and updates the drawing service
   * @param color The selected color
   */
  selectColor(color: string): void {
    this.selectedColor.set(color);
    this.drawingService.setColor(color);
  }

  /**
   * Updates the line width in the drawing service
   * @param event The range change event
   */
  onLineWidthChange(event: any): void {
    const width = event.detail.value;
    this.lineWidth.set(width);
    this.drawingService.setLineWidth(width);
  }

  /**
   * Shows a format selection dialog and saves the drawing
   */
  async saveDrawing(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Save Drawing',
      message: 'Select image format',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (format) => {
            this.exportDrawing(format || 'image/png');
          },
        },
      ],
      inputs: [
        {
          name: 'format',
          type: 'radio',
          label: 'PNG (Best Quality)',
          value: 'image/png',
          checked: true,
        },
        {
          name: 'format',
          type: 'radio',
          label: 'JPEG (Smaller Size)',
          value: 'image/jpeg',
        },
      ],
    });

    await alert.present();
  }

  /**
   * Exports the drawing using the selected format
   * @param format Image format (mime type)
   */
  private async exportDrawing(format: string): Promise<void> {
    const success = this.drawingService.saveCanvasAsImage(format);

    const toast = await this.toastController.create({
      message: success
        ? 'Drawing saved successfully!'
        : 'Failed to save drawing',
      duration: 2000,
      position: 'bottom',
      color: success ? 'success' : 'danger',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}
