# Vanilla JS Helpers

A collection of vanilla JavaScript utilities: a grid system, a stats overlay, and a client-side router.

## Features

- **Router**: Client-side routing with page transitions
- **Stats Overlay**: Displays viewport dimensions, aspect ratio, and FPS
- **Grid System**: CSS grid with a development overlay
- **No dependencies**: JavaScript and CSS only
- **ES Modules**: Module system support
- **Dark mode**: Responds to `prefers-color-scheme`

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

## Grid System

CSS grid layout with a toggleable development overlay.

### Methods

- `grid.init(options)` - Initialize the grid
  - `options.show` (boolean): Show overlay on init
  - `options.columnsColor` (string): Column background color
  - `options.columnsBorderColor` (string): Column border color
  - `options.columnsBorderWidth` (string): Column border width
  - `options.columnsBorderStyle` (string): Column border style
- Returns a cleanup function

### CSS Classes

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

### Example

```javascript
grid.init({
  show: true,
  columnsColor: 'rgba(255, 0, 0, 0.1)',
  columnsBorderColor: 'red',
  columnsBorderWidth: '1px',
  columnsBorderStyle: 'dashed'
});
```

```html
<div class="container">
  <div class="col-6">Half width</div>
  <div class="col-6">Half width</div>
</div>
```

## Stats Overlay

Development overlay showing viewport and performance data.

### Methods

- `stats.init()` - Initialize the stats overlay
- Returns a cleanup function

### Displays

- Viewport dimensions
- Aspect ratio
- FPS counter


## Router

Client-side navigation with page transitions.

### Methods

- `router.init()` - Initialize the router
- `router.navigate(path)` - Navigate to a path

### Behavior

- Intercepts clicks on `<a href="...">` elements
- Supports browser back/forward navigation
- Applies CSS transition classes on page change

### Example

```javascript
import { router } from 'yg-vanilla-js-helpers';

router.init();
router.navigate('/about');
```


## CSS Variables

```css
:root {
  --background-color: #ebecd6;
  --foreground-color: #0a100d;
  --accent-color: #3066be;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #0a100d;
    --foreground-color: #ebecd6;
    --accent-color: #3066be;
  }
}
```

## Keyboard Shortcuts

- `Alt + G` — Toggle grid overlay
- `Alt + S` — Toggle stats overlay

## Project Structure

```
yg-vanilla-js-helpers/
├── index.js
├── script/
│   ├── grid.js
│   ├── stats.js
│   └── routing/
│       ├── router.js
│       └── appState.js
├── dist/
│   └── styles/
└── scss/
```

## License

ISC

## Author

Yassine Gallaoui
