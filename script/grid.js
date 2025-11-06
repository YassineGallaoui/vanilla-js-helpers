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

    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row';

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
        this.overlay.appendChild(newOverlay);
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
   * @param {boolean} show - Whether to show the grid initially (default: false)
   */
  init(show = false) {
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
