# Technical Context

## Framework and Libraries
- **Angular 19.2.0**: Core framework for building the application
- **Ionic 8.5.6**: UI component library providing mobile-first components
- **RxJS 7.8.0**: Reactive extensions library for managing asynchronous data streams
- **TypeScript 5.7.2**: Typed superset of JavaScript enhancing developer experience

## Application Architecture
The application follows Angular's component-based architecture with a service-oriented approach:

### Components
1. **Drawing Canvas Component**
   - Standalone Angular component
   - Manages canvas initialization and resizing
   - Handles mouse and touch events
   - Implements drawing mechanics using HTML5 Canvas API
   - Uses Angular Signals for reactive state management

2. **Drawing Toolbar Component**
   - Standalone Angular component
   - Provides UI controls for color selection
   - Includes line width adjustment slider
   - Offers drawing export functionality

### Services
1. **Drawing Service**
   - Singleton service provided at root level
   - Acts as a state manager between components
   - Provides BehaviorSubjects for reactive state updates
   - Handles canvas registration and export functionality

## Design Patterns
- **Observer Pattern**: Using RxJS Observables for state management
- **Dependency Injection**: Angular's built-in DI system for service management
- **Singleton Pattern**: Service instances shared across components
- **Signal Pattern**: Using Angular Signals for reactive UI state

## Key Technical Implementations
1. **Canvas Management**
   - Dynamic resizing based on container size
   - Context configuration with line styling parameters
   - Direct pixel manipulation through the Canvas API

2. **Event Handling**
   - Mouse events: mousedown, mousemove, mouseup, mouseout
   - Touch events: touchstart, touchmove, touchend
   - Coordinate translation for accurate drawing

3. **Reactive State**
   - Color state shared between toolbar and canvas
   - Line width synchronization using observables
   - Drawing state managed through signals

4. **Image Export**
   - Canvas to DataURL conversion
   - Format selection (PNG/JPEG)
   - Background preservation techniques
   - Automatic download implementation 
