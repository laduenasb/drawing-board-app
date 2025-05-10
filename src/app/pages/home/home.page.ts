import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DrawingCanvasComponent } from '../../components/drawing-canvas/drawing-canvas.component';
import { DrawingToolbarComponent } from '../../components/drawing-toolbar/drawing-toolbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    DrawingCanvasComponent,
    DrawingToolbarComponent,
  ],
})
export class HomePage {
  constructor() {}
}
