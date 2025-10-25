import '../dist/styles/stats.min.css';

class Stats {
    constructor() {
        this.statsDiv = null;
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFPS = this.updateFPS.bind(this);
        
        // FPS tracking variables
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsUpdateInterval = 500; // Update FPS every 500ms
        this.animationFrameId = null;
    }

    /**
     * Gets the current window information
     * @returns {string} HTML string with window dimensions, aspect ratio, and FPS
     */
    getCurrentInfo() {
        return `
      <div>W:${window.innerWidth} x H:${window.innerHeight}</div>
      <div>Aspect Ratio: ${(window.innerWidth / window.innerHeight).toFixed(2)}</div>
      <div>FPS: ${this.fps}</div>
    `;
    }

    /**
     * Handles window resize events
     */
    handleResize() {
        this.statsDiv.innerHTML = this.getCurrentInfo();
    }

    /**
     * Updates FPS calculation using requestAnimationFrame
     */
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        // Update FPS every fpsUpdateInterval milliseconds
        if (deltaTime >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update the display if stats are visible
            if (this.statsDiv) {
                this.statsDiv.innerHTML = this.getCurrentInfo();
            }
        }

        // Continue the animation loop
        this.animationFrameId = requestAnimationFrame(this.updateFPS);
    }

    /**
     * Handles keyboard events for stats toggling
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyPress(e) {
        if (e.key.toLowerCase() === 's') {
            this.statsDiv.classList.toggle('show');
        }
    }

    /**
     * Initializes the stats functionality
     */
    init() {
        // Create stats div
        this.statsDiv = document.createElement('div');
        this.statsDiv.id = 'stats';
        this.statsDiv.className = 'stats';
        this.statsDiv.innerHTML = this.getCurrentInfo();

        // Insert as first child of body
        document.body.insertBefore(this.statsDiv, document.body.firstChild);

        // Add event listeners
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyPress);

        // Start FPS tracking
        this.animationFrameId = requestAnimationFrame(this.updateFPS);

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', this.handleResize);
            document.removeEventListener('keydown', this.handleKeyPress);
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.statsDiv.remove();
        };
    }
}

export const stats = new Stats();
