import '../dist/styles/grid.min.css';

class Grid {
  constructor() {
    this.overlay = null;
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * Creates the grid overlay structure
   * @param {boolean} show - Whether to show the grid initially
   * @returns {HTMLElement} The grid overlay element
   */
  createGridOverlay(show = false) {
    const overlay = document.createElement('div');
    overlay.className = show ? 'grid-overlay show' : 'grid-overlay';

    // Apply custom styles if options exist
    if (this.options) {
      if (this.options.columnsColor) {
        overlay.style.setProperty('--grid-columns-color', this.options.columnsColor);
      }
      if (this.options.columnsBorderColor) {
        overlay.style.setProperty('--grid-columns-border-color', this.options.columnsBorderColor);
      }
      if (this.options.columnsBorderWidth) {
        overlay.style.setProperty('--grid-columns-border-width', this.options.columnsBorderWidth);
      }
      if (this.options.columnsBorderStyle) {
        overlay.style.setProperty('--grid-columns-border-style', this.options.columnsBorderStyle);
      }
    }

    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row';

    // Create 12 column guides
    for (let i = 0; i < 12; i++) {
      const col = document.createElement('div');
      col.className = 'col-guide';
      row.appendChild(col);
    }

    container.appendChild(row);
    overlay.appendChild(container);

    return overlay;
  }

  /**
   * Toggles the grid overlay visibility
   * @param {HTMLElement} overlay - The grid overlay element
   * @param {boolean} show - Whether to show or hide the overlay
   */
  toggleGridOverlay(show) {
    if (show) {
      if (!this.overlay.children.length) {
        const newOverlay = this.createGridOverlay(true);
        this.overlay.innerHTML = '';
        while (newOverlay.firstChild) {
          this.overlay.appendChild(newOverlay.firstChild);
        }
        // Re-apply styles if needed (though they are on the overlay itself)
      }
      this.overlay.classList.add('show');
    } else {
      this.overlay.classList.remove('show');
    }
  }

  /**
   * Handles keyboard events for grid toggling
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyPress(e) {
    if (e.altKey && e.code === 'KeyG') {
      this.toggleGridOverlay(!this.overlay.classList.contains('show'));
    }
  }

  /**
   * Initializes the grid overlay functionality
   * @param {Object} options - Configuration options
   * @param {boolean} options.show - Whether to show the grid initially (default: false)
   * @param {string} options.columnsColor - Custom column color
   * @param {string} options.columnsBorderColor - Custom column border color
   * @param {string} options.columnsBorderWidth - Custom column border width
   * @param {string} options.columnsBorderStyle - Custom column border style
   */
  init(options = {}) {
    this.options = options;
    const show = options.show || false;

    // Create and insert grid overlay
    this.overlay = this.createGridOverlay(show);
    document.body.insertBefore(this.overlay, document.body.firstChild);

    // Add keyboard shortcut listener
    document.addEventListener('keydown', this.handleKeyPress);

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', this.handleKeyPress);
      this.overlay.remove();
    };
  }
}

export const grid = new Grid();
