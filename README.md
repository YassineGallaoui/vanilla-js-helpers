# Vanilla JS Helpers

A collection of vanilla JavaScript utilities including a custom grid system, stats overlay, and client-side router. Perfect for vanilla JS projects that need lightweight, dependency-free solutions.

## Features

- 🎯 **Custom Router**: Client-side routing with smooth transitions
- 📊 **Stats Overlay**: Real-time display of viewport dimensions, aspect ratio, and FPS
- 📐 **Grid System**: Responsive CSS grid with overlay for development
- 🚀 **Zero Dependencies**: Pure vanilla JavaScript and CSS
- 📦 **ES Modules**: Modern module system support
- 🎨 **Dark Mode**: Automatic dark/light theme support

## Installation

```bash
npm install yg-vanilla-js-helpers
```

## Quick Start

```javascript
import { router, grid, stats } from 'yg-vanilla-js-helpers';

document.addEventListener('DOMContentLoaded', () => {
  router.init();
  grid.init();
  stats.init();
});
```

## More about it

### Router

The router provides client-side navigation with smooth page transitions.

#### Methods

- `router.init()` - Initialize the router
- `router.navigate(path)` - Navigate to a specific path

#### Features

- Automatic link interception for `<a href="...">` elements
- Browser back/forward button support
- Smooth page transitions with CSS animations
- Automatic content wrapping and management

#### Example

```javascript
import { router } from 'yg-vanilla-js-helpers';

// Initialize router
router.init();

// Programmatic navigation
router.navigate('/about');
```

### Grid System

A responsive CSS grid system with development overlay.

#### Methods

- `grid.init()` - Initialize the grid overlay functionality
- Returns a cleanup function for removing event listeners

#### Features

- Responsive breakpoints (4, 8, 12 columns)
- Visual grid overlay for development (press 'g' to toggle)
- CSS Grid based layout system
- Utility classes for columns, offsets, and sub-grids

#### CSS Classes

```css
/* Container */
.container

/* Columns */
.col-1 to .col-12
.sm-col-1 to .sm-col-4
.md-col-1 to .md-col-8
.lg-col-1 to .lg-col-12

/* Offsets */
.offset-1 to .offset-12
.sm-offset-1 to .sm-offset-4
.md-offset-1 to .md-offset-8
.lg-offset-1 to .lg-offset-12

/* Sub-grids */
.sub-grid
.sm-sub-grid
.md-sub-grid
.lg-sub-grid
```

#### Example

```html
<div class="container">
  <div class="row">
    <div class="col-6">Half width</div>
    <div class="col-6">Half width</div>
  </div>
</div>
```

### Stats Overlay

Real-time statistics display for development.

#### Methods

- `stats.init()` - Initialize the stats overlay
- Returns a cleanup function for removing event listeners

#### Features

- Current viewport dimensions
- Aspect ratio calculation
- Real-time FPS counter
- Toggle visibility with 's' key


## CSS Variables

The library uses CSS custom properties for theming:

```css
:root {
  --background-color: #ebecd6;
  --foreground-color: #0a100d;
  --accent-color: #3066be;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #0a100d;
    --foreground-color: #ebecd6;
    --accent-color: #3066be;
  }
}
```

## Keyboard Shortcuts

- **'g'** - Toggle grid overlay
- **'s'** - Toggle stats overlay

## Project Structure

```
yg-vanilla-js-helpers/
├── index.js              # Main entry point
├── script/
│   ├── grid.js           # Grid system
│   ├── stats.js          # Stats overlay
│   └── routing/
│       ├── router.js     # Router implementation
│       └── appState.js   # State management
├── dist/
│   └── styles/           # Compiled CSS files
└── scss/                 # Source SCSS files
```

## License

ISC

## Author

Yassine Gallaoui