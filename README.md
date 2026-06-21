# Vanilla JS Helpers

A collection of vanilla JavaScript utilities: a grid system and a stats overlay.

## Features

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
import { grid, stats } from 'yg-vanilla-js-helpers';

document.addEventListener('DOMContentLoaded', () => {
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
  - `options.zIndex` (number): z-index applied to the grid overlay
- Returns a cleanup function

### Breakpoints

| Prefix | Breakpoint | Active at |
|--------|-----------|-----------|
| *(none)* | — | always |
| `sm-` | 576px | `< 576px` only |
| `md-` | 768px | `≥ 576px` and up |
| `lg-` | 992px | `≥ 768px` and up |
| `xl-` | 1200px | `≥ 992px` and up |
| `xxl-` | 1440px | `≥ 1200px` and up |

The grid uses **4 columns** below `576px`, **8 columns** from `576px`, and **12 columns** from `768px`.

### Responsive Column Behavior

Prefixed column classes use **min-width** semantics: `md-col-*` applies from its breakpoint upward until a larger-breakpoint class overrides it. A higher-breakpoint class always wins regardless of class order in the HTML attribute.

```html
<!-- col-12 on mobile, 4 cols on tablet, 3 cols on desktop -->
<div class="col-12 md-col-4 lg-col-3">...</div>

<!-- identical result — class order in HTML doesn't matter -->
<div class="lg-col-3 col-12 md-col-4">...</div>
```

### CSS Classes

```css
/* Container */
.container

/* Columns (always applied) */
.col-1 to .col-12

/* Responsive columns */
.sm-col-1 to .sm-col-4    /* < 576px only */
.md-col-1 to .md-col-8    /* ≥ 576px and up */
.lg-col-1 to .lg-col-12   /* ≥ 768px and up */

/* Offsets (always applied) */
.offset-1 to .offset-12

/* Responsive offsets */
.sm-offset-1 to .sm-offset-4    /* < 576px only */
.md-offset-1 to .md-offset-8    /* ≥ 576px and up */
.lg-offset-1 to .lg-offset-12   /* ≥ 768px and up */

/* Sub-grids */
.sub-grid
.sm-sub-grid    /* < 576px only */
.md-sub-grid    /* ≥ 576px and up */
.lg-sub-grid    /* ≥ 768px and up */
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

- `stats.init(options)` - Initialize the stats overlay
  - `options.show` (boolean): Show overlay on init
  - `options.zIndex` (number): z-index applied to the stats overlay
- Returns a cleanup function

### Displays

- Viewport dimensions
- Aspect ratio
- FPS counter


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
│   └── stats.js
├── dist/
│   └── styles/
└── scss/
```

## License

ISC

## Author

Yassine Gallaoui
