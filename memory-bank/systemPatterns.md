# System Patterns

## Component Design Patterns

### Standalone Components
The application utilizes Angular's standalone components approach, which:
- Eliminates the need for NgModules for simple components
- Allows direct importing of dependencies
- Creates more modular and self-contained components
- Simplifies testing and maintenance

Example from DrawingCanvasComponent:
```typescript
@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.scss'],
})
```

### Container-Presenter Pattern
The application implements a variation of the Container-Presenter pattern:
- DrawingCanvas: Presenter component focused on user interactions
- DrawingToolbar: Presenter component managing user inputs
- DrawingService: Acts as a state container connecting presenters

## State Management

### Observable-Based Communication
The application uses RxJS observables for cross-component communication:
- BehaviorSubjects store current state values
- Components subscribe to state changes
- Components emit state changes through service methods

Example:
```typescript
// In DrawingService
private colorSubject = new BehaviorSubject<string>('#000000');
currentColor$: Observable<string> = this.colorSubject.asObservable();

// In Component
this.drawingService.currentColor$.subscribe((color) => {
  this.context.strokeStyle = color;
});
```

### Signal Pattern
The application leverages Angular Signals for reactive internal component state:
```typescript
private isDrawing = signal(false);
private lastX = signal(0);
private lastY = signal(0);
```

## Event Handling Architecture

### Event Delegation
The application implements an event-driven architecture with delegated responsibilities:
- Canvas component captures raw input events
- Events are processed and transformed into drawing operations
- Coordinate conversion handles differences between device types

### Cross-Device Compatibility
The system implements parallel event handling systems:
- Mouse events: mousedown, mousemove, mouseup, mouseout
- Touch events: touchstart, touchmove, touchend

## Service Patterns

### Singleton Service
The DrawingService is implemented as a singleton at the root level:
```typescript
@Injectable({
  providedIn: 'root',
})
export class DrawingService { ... }
```

### Mediator Pattern
The DrawingService acts as a mediator between components:
- Coordinates actions between toolbar and canvas
- Centralizes state management logic
- Provides unified interface for operations

## UI Patterns

### Responsive Canvas
The canvas implements a responsive design pattern:
- Dynamically adjusts to container size
- Handles window resize events
- Preserves drawing context during resize operations

### Customization Controls
The toolbar implements common UI patterns:
- Color palette with selection indicator
- Range slider for line width adjustment
- Action buttons with confirmation dialogs

## Export Patterns

### Temporary Canvas Technique
For image export, the system:
- Creates a temporary canvas
- Adds a white background layer
- Copies the original drawing on top
- Converts to desired format
- Triggers download

This pattern ensures exported images have proper backgrounds while preserving the transparent drawing surface during use. 
